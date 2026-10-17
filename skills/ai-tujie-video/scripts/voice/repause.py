# 标点处补停顿：克隆模型常把逗号念过去（「AI 出八成人改两成」）。
# 做法：Whisper 逐字时间戳估位置 → 附近找静音谷 → 「截前段识别末字」验证切点 → 不够长就补静音
# 输入 voice_raw/，输出 voice/ + align.json（每个字在新音频里的时间，build.mjs 用它对齐字幕和动画）
# 用法：python repause.py <项目> [句号...]
# 自动找不到切点时会打印出来；看能量曲线后写进 <项目>/manual_cuts.json：{"s01": [[17, 3.17]]}（标点在稿子里的下标, 秒）
#   查能量曲线：python repause.py <项目> --env 1 2.0 3.6   （第 1 句 2.0–3.6 秒）
import sys, os, json, difflib
from common import *
TARGET = {"，": .26, "、": .16, "：": .32, "；": .36, "。": .48, "？": .48, "！": .48}
P = os.path.abspath(sys.argv[1])
if "--env" in sys.argv:
    i = sys.argv.index("--env"); n, a, b = int(sys.argv[i + 1]), float(sys.argv[i + 2]), float(sys.argv[i + 3])
    x, sr = rd(f"{P}/voice_raw/s{n:02d}.wav"); db, hop = db_env(x, sr)
    for f in range(int(a * 100), int(b * 100), 2): print(f"{f/100:.2f} {db[f]:6.1f}", "#" * int(max(0, db[f] + 70) // 3))
    sys.exit()
MANUAL = json.load(open(f"{P}/manual_cuts.json")) if os.path.exists(f"{P}/manual_cuts.json") else {}
L = lines(P); os.makedirs(f"{P}/voice", exist_ok=True)
out = json.load(open(f"{P}/align.json")) if os.path.exists(f"{P}/align.json") else {}
def verify(x, sr, at, before, after, loose=False):
    a = [c for c in asr(x[max(0, at - sr * 3):at], sr, pad=0) if isc(c)]
    if not a or py(a[-1]) != py(before): return False
    if loose: return True
    b = [c for c in asr(x[at:at + int(sr * 2.2)], sr, pad=0) if isc(c)]
    return bool(b) and py(b[0]) == py(after)
for n in ids(P, sys.argv[2:]):
    key = f"s{n:02d}"; text = L[n - 1]; src = f"{P}/voice_raw/{key}.wav"; x, sr = rd(src)
    r = model().generate(src, language="zh", word_timestamps=True)
    chars = []
    for s in r.segments:
        for w in s.get("words", []):
            cs = [c for c in w["word"] if isc(c)]
            for k, c in enumerate(cs):
                d = (w["end"] - w["start"]) / len(cs); chars.append((c, w["start"] + k * d, w["start"] + (k + 1) * d))
    sidx = [i for i, ch in enumerate(text) if isc(ch)]
    a = [py(text[i]) for i in sidx]; b = [py(c[0]) for c in chars]
    amap = {}
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag in ("equal", "replace") and j2 > j1:
            for k in range(i1, i2): amap[k] = j1 + min(k - i1, j2 - j1 - 1)
    st = [None] * len(sidx); en = [None] * len(sidx)
    for k, j in amap.items(): st[k], en[k] = chars[j][1], chars[j][2]
    for arr in (st, en):
        known = [(k, v) for k, v in enumerate(arr) if v is not None]
        for k in range(len(arr)):
            if arr[k] is None:
                lo = max([kv for kv in known if kv[0] < k], default=(0, 0.0)); hi = min([kv for kv in known if kv[0] > k], default=(len(arr), len(x) / sr))
                arr[k] = lo[1] + (hi[1] - lo[1]) * (k - lo[0]) / max(1, hi[0] - lo[0])
    db, hop = db_env(x, sr); man = {int(p): t for p, t in MANUAL.get(key, [])}
    inserts = []
    for pi, ch in enumerate(text):
        if ch not in TARGET or pi == len(text) - 1: continue
        kb = max([k for k, i in enumerate(sidx) if i < pi], default=None); ka = min([k for k, i in enumerate(sidx) if i > pi], default=None)
        if kb is None or ka is None: continue
        cut = int(man[pi] / .01) if pi in man else None
        if cut is None:
            est = (en[kb] + st[ka]) / 2
            f0, f1 = max(1, int((est - .6) / .01)), min(len(db) - 2, int((est + .6) / .01))
            cands = sorted([f for f in range(f0, f1 + 1) if db[f] <= db[max(0, f - 4):f + 5].min() + 1e-9], key=lambda f: db[f] + abs(f * .01 - est) * 20)[:6]
            for loose in (False, True):
                cut = next((f for f in cands if verify(x, sr, f * hop, text[sidx[kb]], text[sidx[ka]], loose)), None)
                if cut is not None: break
        if cut is None: print(f"  {key} 下标{pi}「{text[max(0,pi-3):pi+3]}」没找到可靠切点，跳过（可写进 manual_cuts.json）", flush=True); continue
        l = r_ = cut
        while l > 0 and db[l - 1] < -42: l -= 1
        while r_ < len(db) - 1 and db[r_ + 1] < -42: r_ += 1
        have = (r_ - l + 1) * .01 if db[cut] < -42 else 0
        if TARGET[ch] - have > .04: inserts.append((cut * hop, TARGET[ch] - have))
    segs, last, tmap = [], 0, []
    for at, need in inserts: segs += [x[last:at], np.zeros(int(need * sr), np.float32)]; tmap.append((at / sr, need)); last = at
    segs.append(x[last:]); wr(f"{P}/voice/{key}.wav", np.concatenate(segs), sr)
    sh = lambda t: t + sum(d for a0, d in tmap if a0 <= t)
    times = [None] * len(text)
    for k, i in enumerate(sidx): times[i] = round(sh(st[k]), 3)
    for i in range(len(text)):
        if times[i] is None: times[i] = times[i - 1] if i else 0.0
    out[key] = times
    print(f"{key} 补 {len(inserts)} 处停顿 共 {sum(d for _, d in inserts):.2f}s，对齐 {len(amap)}/{len(sidx)} 字", flush=True)
    json.dump(out, open(f"{P}/align.json", "w"), ensure_ascii=False)
