# 合成一段轻快的背景音乐（112 BPM：拨弦八分音符分解和弦 + 低音 + 轻底鼓 + 沙锤 + 响指），无版权问题
# 用法：python bgm.py <时长秒> <输出.wav>
import sys, wave
import numpy as np

SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
bpm = 112; beat = 60 / bpm
rng = np.random.default_rng(5)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
T = lambda length: np.arange(int(SR * length)) / SR

def pluck(f, length=.5, amp=.1):
    t = T(length); env = np.exp(-t * 7) * np.minimum(1, t / .004)
    return amp * env * (np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) * np.exp(-t * 10) + .2 * np.sin(6 * np.pi * f * t) * np.exp(-t * 14))
def bass(f, length, amp=.13):
    t = T(length); env = np.exp(-t * 2.5) * np.minimum(1, t / .01)
    return amp * env * (np.sin(2 * np.pi * f * t) + .2 * np.sin(4 * np.pi * f * t))
def kick(amp=.22):
    t = T(.25); f = 110 * np.exp(-t * 25) + 45
    return amp * np.exp(-t * 16) * np.sin(2 * np.pi * np.cumsum(f) / SR)
def shaker(amp=.025):
    t = T(.07); n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0)   # 高频噪声
    return amp * n * np.exp(-t * 60)
def snap(amp=.05):
    t = T(.12); n = rng.standard_normal(len(t))
    return amp * n * np.exp(-t * 35) + amp * .6 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 60)
def pad(fs, length, amp=.03):
    t = T(length); env = np.minimum(1, t / .4) * np.minimum(1, (length - t) / .4)
    return amp * env * sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate(fs)) / len(fs)

# C - G - Am - F，每个和弦一小节（4 拍）
chords = [[48, 60, 64, 67, 72], [43, 59, 62, 67, 71], [45, 60, 64, 69, 72], [41, 60, 65, 69, 72]]
arp = [1, 2, 3, 4, 3, 2, 3, 4]   # 八分音符分解顺序
bar = beat * 4
n = int(SR * (dur + bar + 4)); mix = np.zeros(n)
def add(t, x):
    s = int(t * SR); mix[s:s + len(x)] += x[:max(0, n - s)]
t0, k = 0.0, 0
while t0 < dur:
    ch = chords[k % 4]
    add(t0, pad([hz(m) for m in ch[1:4]], bar + .3))
    add(t0, bass(hz(ch[0]), beat * 1.5)); add(t0 + beat * 1.5, bass(hz(ch[0]), beat)); add(t0 + beat * 2.5, bass(hz(ch[0] + 7), beat * 1.5))
    for i in range(8):
        add(t0 + i * beat / 2 + rng.uniform(0, .008), pluck(hz(ch[arp[i]] + 12), amp=.075 * (1.15 if i % 2 == 0 else .9)))
        add(t0 + i * beat / 2, shaker(.03 if i % 2 else .018))
    if k >= 2:   # 前两小节只有乐器，之后进鼓
        add(t0, kick()); add(t0 + beat * 2, kick(.18)); add(t0 + beat * 2.75, kick(.1))
        add(t0 + beat, snap()); add(t0 + beat * 3, snap())
    t0 += bar; k += 1
rev = mix.copy()   # 一点房间感
for d, g in [(.023, .25), (.041, .2), (.067, .15), (.097, .1), (.149, .07)]:
    o = int(d * SR); rev[o:] += g * mix[:-o]
y = rev[:int(SR * dur)]
y[:int(SR * 1)] *= np.linspace(0, 1, int(SR * 1)); fade = int(SR * 2.5); y[-fade:] *= np.linspace(1, 0, fade)
y = y / np.abs(y).max() * .7
st = np.stack([y, np.roll(y, 180)], 1)
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("BGM →", out)
