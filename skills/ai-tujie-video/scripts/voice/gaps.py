# 检查人声轨里有没有超过 0.5 秒的无声段（build.mjs 之后跑；片尾留白不算）
# 用法：python3 gaps.py <项目> [上限秒=0.5]
import json, sys, wave
import numpy as np
P = sys.argv[1]; LIM = float(sys.argv[2]) if len(sys.argv) > 2 else .5
cfg = json.load(open(f"{P}/config.json")); vd = cfg.get("voiceDir", "voice_fast")
tl = json.load(open(f"{P}/timeline.json")); sr = 48000; N = int(tl["duration"] * sr); y = np.zeros(N)
for s in tl["scenes"]:
    w = wave.open(f"{P}/{vd}/{s['id']}.wav"); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)
    a = int(s["voiceAt"] * sr); y[a:a + len(x)] += x[:max(0, N - a)]
hop = sr // 100
db = np.array([20 * np.log10(np.sqrt(np.mean(y[i:i + hop] ** 2)) / 32768 + 1e-9) for i in range(0, N, hop)])
last = tl["duration"] - cfg.get("outro", 2.4) - .3
gaps, i = [], 0
while i < len(db):
    if db[i] < -42:
        j = i
        while j < len(db) and db[j] < -42: j += 1
        if 0 < i / 100 < last: gaps.append((i / 100, (j - i) / 100))
        i = j
    else: i += 1
bad = [g for g in gaps if g[1] > LIM]
print("最长的 3 段：", sorted(gaps, key=lambda g: -g[1])[:3])
print("全部 ≤ %.2fs" % LIM if not bad else f"超过 {LIM}s 的：{bad}（调小 config 的 lead/tail，或 tighten.py 的 KEEP）")
