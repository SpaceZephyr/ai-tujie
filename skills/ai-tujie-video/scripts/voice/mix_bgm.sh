#!/bin/bash
# 人声 + 轻快配乐合成成片：人声 -16 LUFS（mix.py），配乐压到 config.bgmLUFS（默认 -32），说话时再侧链压低，最后嵌封面
# 用法：bash mix_bgm.sh <项目> "<成片名>"     先跑完 render.mjs；out/bgm.wav 不存在时自动用 bgm.py 合成
#   换成自己的曲子：放到 <项目>/out/bgm.wav 再跑
set -e
V="$(cd "$(dirname "$0")" && pwd)"; P="$(cd "$1" && pwd)"; NAME="${2:-成片}"
PY="${PY:-$HOME/.cache/promo-tts/.venv/bin/python}"; [ -x "$PY" ] || PY=python3
LUFS=$(python3 -c "import json;print(json.load(open('$P/config.json')).get('bgmLUFS',-32))")
python3 "$V/mix.py" "$P" "$NAME" >/dev/null   # 生成 out/mix.wav（人声）
if [ ! -f "$P/out/bgm.wav" ]; then
  D=$(python3 -c "import json;print(json.load(open('$P/timeline.json'))['duration'])"); "$PY" "$V/bgm.py" "$D" "$P/out/bgm.wav"
fi
cd "$P"
ffmpeg -y -loglevel error -i out/bgm.wav -af loudnorm=I=$LUFS:TP=-9:LRA=7 -ar 48000 -ac 2 out/bgm_q.wav
ffmpeg -y -loglevel error -i out/mix.wav -i out/bgm_q.wav -filter_complex \
  "[0:a]asplit=2[v][sc];[1:a][sc]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=600[b];[v][b]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.89[out]" \
  -map "[out]" -ar 48000 -ac 2 out/mix_bgm.wav
# 封面单独一遍嵌：和 -shortest 放在同一条命令里会把视频截短
ffmpeg -y -loglevel error -i out/video.mp4 -i out/mix_bgm.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/_av.mp4
if [ -f cover/cover.png ]; then
  ffmpeg -y -loglevel error -i out/_av.mp4 -i cover/cover.png -map 0 -map 1 -c copy -c:v:1 png -disposition:v:1 attached_pic "out/$NAME.mp4"; rm out/_av.mp4
else mv out/_av.mp4 "out/$NAME.mp4"; fi
echo "成片 → $P/out/$NAME.mp4"
