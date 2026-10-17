# 整体变速（默认 1.2 倍，音调不变）→ voice_fast/，再逐句 ASR 跟稿子按拼音比对，列出可疑字
# 用法：python finalize.py <项目> [speed=1.2] [句号...]
import sys, os, subprocess, difflib, json
from common import *
def num_zh(s):
    """把 Whisper 写出的阿拉伯数字转回读法：2500→二千五百，35→三十五；以 0 开头或超过 4 位的逐位读"""
    d = "零一二三四五六七八九"
    if s.startswith("0") or len(s) > 4: return "".join(d[int(c)] for c in s)
    n = int(s); out = ""; zero = False
    for v, u in ((1000, "千"), (100, "百"), (10, "十"), (1, "")):
        q = n // v % 10
        if q: out += ("零" if zero else "") + ("" if (u == "十" and q == 1 and not out) else d[q]) + u; zero = False
        elif out: zero = True
    return out or "零"
P = os.path.abspath(sys.argv[1]); kv = dict(a.split("=", 1) for a in sys.argv[2:] if "=" in a)
cfgp = f"{P}/config.json"; cfg = json.load(open(cfgp)) if os.path.exists(cfgp) else {}
speed = float(kv.get("speed", cfg.get("speed", 1.2))); cfg["speed"] = speed; json.dump(cfg, open(cfgp, "w"), ensure_ascii=False, indent=1)
os.makedirs(f"{P}/voice_fast", exist_ok=True); L = lines(P); bad = 0
for n in ids(P, [a for a in sys.argv[2:] if "=" not in a]):
    k = f"s{n:02d}"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{P}/voice/{k}.wav", "-af", f"atempo={speed}", f"{P}/voice_fast/{k}.wav"], check=True)
    x, sr = rd(f"{P}/voice_fast/{k}.wav"); got = asr(x, sr)
    import re; got = re.sub(r"(\d)\.(\d)", r"\1点\2", got)  # 3.1 → 3点1
    got = re.sub(r"\d+", lambda m: num_zh(m.group()), got)
    a = [py(c) for c in L[n - 1].replace("两", "二") if isc(c)]; b = [py(c) for c in got.replace("两", "二") if isc(c)]
    diff = [op for op in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if op[0] != "equal"]
    flag = "" if not diff else "  <-- 拼音对不上 %d 处，听一下" % len(diff)
    bad += bool(diff); print(f"{k} | {got}{flag}", flush=True)
print("全部拼音一致" if not bad else f"{bad} 句有出入：同音字（原型/圆形）不用管；漏字、多字要单独截那句复核，确认漏了就改稿重配")
