#!/bin/bash
# 用微软官方音色（edge-tts）逐句配音 → voice_raw/sNN.wav
# 用法：bash tts.sh <项目> [句号...]     音色、语速读 config.json 的 voice / rate
#   默认云扬 zh-CN-YunyangNeural（成熟男声）+15%；女声可用晓晓 zh-CN-XiaoxiaoNeural，男声云希 zh-CN-YunxiNeural
set -e
P="$(cd "$1" && pwd)"; shift
ET="${EDGE_TTS:-$(command -v edge-tts || echo "$HOME/.cache/promo-tts/.venv/bin/edge-tts")}"
[ -x "$ET" ] || { echo "没找到 edge-tts：pip install edge-tts，或设 EDGE_TTS=/path/to/edge-tts"; exit 1; }
VOICE=$(python3 -c "import json;print(json.load(open('$P/config.json')).get('voice','zh-CN-YunyangNeural'))")
RATE=$(python3 -c "import json;print(json.load(open('$P/config.json')).get('rate','+15%'))")
N=$(python3 -c "import json;print(len(json.load(open('$P/lines.json'))))")
IDS="$*"; [ -z "$IDS" ] && IDS=$(seq 1 "$N")
for n in $IDS; do
  k=$(printf s%02d "$n"); t=$(python3 -c "import json;print(json.load(open('$P/lines.json'))[$n-1])")
  for try in 1 2 3; do   # 网络偶尔中断会只生成半句，按时长重试
    "$ET" --voice "$VOICE" --rate="$RATE" --text "$t" --write-media "$P/voice_raw/$k.mp3" 2>/dev/null || true
    ffmpeg -y -loglevel error -i "$P/voice_raw/$k.mp3" -ar 48000 -ac 1 "$P/voice_raw/$k.wav" && rm -f "$P/voice_raw/$k.mp3"
    d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$P/voice_raw/$k.wav")
    python3 -c "import sys;sys.exit(0 if $d > len('''$t''')/12 else 1)" && break
    echo "  $k 只有 ${d}s，重试"
  done
  echo "$k ${d}s"
done
