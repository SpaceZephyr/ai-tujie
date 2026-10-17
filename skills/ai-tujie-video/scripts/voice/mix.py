# 按 timeline.json 把每句人声放到对应时间 → 响度标准化 → 和画面合成 → 嵌入封面
# 用法：python mix.py <项目> "<成片文件名>"     （只要人声，不加配乐）
import json, subprocess, sys, os
P = os.path.abspath(sys.argv[1]); name = sys.argv[2] if len(sys.argv) > 2 else "成片"
cfg = json.load(open(f"{P}/config.json")) if os.path.exists(f"{P}/config.json") else {}
vd = cfg.get("voiceDir", "voice_fast")
tl = json.load(open(f"{P}/timeline.json")); inp, flt = [], []
for i, s in enumerate(tl["scenes"]):
    inp += ["-i", f"{P}/{vd}/{s['id']}.wav"]; ms = int(s["voiceAt"] * 1000); flt.append(f"[{i}:a]adelay={ms}|{ms},apad[v{i}]")
n = len(tl["scenes"])
flt.append("".join(f"[v{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0,atrim=0:{tl['duration']},loudnorm=I=-16:TP=-1.5:LRA=11[out]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inp, "-filter_complex", ";".join(flt), "-map", "[out]", "-ar", "48000", "-ac", "2", f"{P}/out/mix.wav"], check=True)
dst = f"{P}/out/{name}.mp4"; cover = f"{P}/cover/cover.png"; tmp = f"{P}/out/_av.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{P}/out/video.mp4", "-i", f"{P}/out/mix.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", tmp], check=True)
if os.path.exists(cover):  # 封面单独一遍嵌进去；和 -shortest 放在同一条命令里会把视频截短
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-i", cover, "-map", "0", "-map", "1", "-c", "copy", "-c:v:1", "png", "-disposition:v:1", "attached_pic", dst], check=True); os.remove(tmp)
else: os.replace(tmp, dst)
print("成片 →", dst)
