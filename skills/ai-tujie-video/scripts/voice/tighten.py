# 收紧停顿：去掉每句首尾静音，句内超过 MAX 秒的静音压到 KEEP 秒（就地改 voice_raw/）
# 用法：python tighten.py <项目> [句号...]（反复跑没问题）
import sys, wave, glob
import numpy as np

MAX, KEEP, EDGE, DB = .4, .35, .03, -42
ids = {f"s{int(a):02d}.wav" for a in sys.argv[2:] if a.isdigit()}
for p in sorted(glob.glob(f"{sys.argv[1]}/voice_raw/s*.wav")):
    if ids and p.split("/")[-1] not in ids: continue
    with wave.open(p) as w: sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
    hop = sr // 100
    db = np.array([20 * np.log10(np.sqrt(np.mean(x[i:i + hop] ** 2)) / 32768 + 1e-9) for i in range(0, len(x), hop)])
    loud = np.where(db > DB)[0]
    a, b = max(0, loud[0] - int(EDGE * 100)), min(len(db), loud[-1] + 1 + int(EDGE * 100))
    keep, i, cut = [], a, 0
    while i < b:
        if db[i] <= DB:
            j = i
            while j < b and db[j] <= DB: j += 1
            n = j - i
            if n > MAX * 100:   # 保留两头各一半，切掉中间
                h = int(KEEP * 100) // 2
                keep += list(range(i, i + h)) + list(range(j - h, j)); cut += n - 2 * h
            else: keep += list(range(i, j))
            i = j
        else: keep.append(i); i += 1
    y = np.concatenate([x[f * hop:(f + 1) * hop] for f in keep])
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.astype(np.int16).tobytes())
    print(f"{p.split('/')[-1]} {len(x)/sr:.2f}s → {len(y)/sr:.2f}s（句内压掉 {cut/100:.2f}s）")
