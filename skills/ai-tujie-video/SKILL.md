---
name: ai-tujie-video
description: 把「AI 原理图解」（ai-tujie）仓库里的一套 3:4 图组（7 张 PNG + 一个 HTML）做成 2–3 分钟的竖版讲解短视频：抽图组文字 → 写口播稿 → 分镜 → 微软官方音色配音（默认成熟男声云扬，停顿 ≤0.5 秒）→ 手绘线稿 + 真实界面 + 原图卡片的动画画面（系列橙色）→ 渲染 → 轻快配乐 + 封面。当用户说「把 ai-tujie 第 N 篇做成视频」「图解做视频」「把这套图组做成讲解视频」「给 XX 图组配音」「ai-tujie 视频」时触发。
---

# ai-tujie-video · 图组转讲解视频

输入一套图组目录（如 `16-Skill运行原理/`，里面有 `01.png…07.png` 和一个 `.html`），输出：

```text
<项目>/
  source.md        ① 图组 7 页的文字（init.sh 自动抽）
  lines.json       ② 一句一场的口播稿
  storyboard.md    ③ 分镜
  voice_raw/ voice/ voice_fast/ align.json   ④ 配音
  scenes.mjs       ⑤ 每场画面
  out/video.mp4    ⑥ 画面
  cover/cover.png  ⑦ 封面
  out/<标题>.mp4   ⑧ 成片（人声 + 配乐 + 封面）
```

下文 `$K` 指本 skill 目录。完整例子：`examples/16-Skill运行原理/`（16 场、2 分 12 秒）。

## 默认设置（用户没说就照这个来）

| 项 | 默认 | 在哪改 |
|---|---|---|
| 比例 | 3:4，1080×1440 | config.json `W/H` |
| 时长 | 2–3 分钟，约 16 句 | 稿子字数 |
| 声音 | 微软「云扬」`zh-CN-YunyangNeural`（成熟、专业的男声），语速 `+15%` | config.json `voice` / `rate` |
| 停顿 | 任何无声段 ≤ 0.5 秒 | `tighten.py`、config `lead` / `tail` |
| 配乐 | 程序合成的轻快拨弦 + 轻鼓（112 BPM，无版权），-32 LUFS，说话时自动压低 | config `bgmLUFS`；自己的曲子放 `out/bgm.wav` |
| 强调色 | 系列橙 `#EE6A1F`（engine 里的 `BLUE` 常量就是它） | `engine/lib.mjs`、`style.css` |
| 标题 | 图组第 1 页的原标题，一字不改 | 封面 C |

其他官方音色：女声晓晓 `zh-CN-XiaoxiaoNeural`（温暖亲切），男声云希 `zh-CN-YunxiNeural`（阳光年轻）。

## 首次安装

```bash
cd $K/scripts && npm i          # roughjs、puppeteer-core
pip install edge-tts numpy       # 配音、收紧停顿、合成配乐
# 可选：Whisper 对齐 + 对稿（mlx-audio + whisper-turbo + pypinyin，Apple 芯片），用 PY=<python> 指定
```

另需 Node 22+、ffmpeg、Chrome。手写字体用 macOS 自带的 Hannotate SC。

## ① 建项目

```bash
bash $K/scripts/init.sh <ai-tujie>/16-Skill运行原理 <项目目录>
```

读 `source.md` 和 7 张原图（Read 看图），弄清：第 1 页的总图讲了什么流程、每页的核心句、哪些数字和例子（只用图组里有的，**不编数字**）。

## ② 口播稿 → lines.json

按 `references/script-style.md` 写，结构：

1. **痛点**：一个具体问题开头（「装几十个 Skill，AI 不会变慢吗？」）
2. **一句话答案**：用第 1 页的副标题
3. **是什么**：第 2 页
4. **分步讲**：第 3–5 页，每步带图组里的例子
5. **怎么写/怎么用/怎么区分**：第 6–7 页
6. **收尾**：判断方法 + 「这是 AI 原理图解第 N 篇，七张原图都放在我的开源仓库里。下一篇，讲 XX。」（下一篇看第 7 页页脚）

口吻：第一人称、平实，不说「首先其次」「值得注意的是」，不排比、不升华。一句 30–60 字，一句一场，全篇 700–1000 字。主角英文词（Skill、Agent、MCP）照说。写完先给用户过目，用户说直接做就不等。

## ③ 分镜 → storyboard.md

每场一行：场号 | 角标 | 大标题（≤16 字，各场句式不同，橙色 `<em>` 标重点）| 画面 | 跟词动作。画面原则见 `references/scene-patterns.md`：

- 三种素材：手绘线稿讲关系；真实界面（窗口、编辑器、终端、聊天、文件列表、进度条）讲「长什么样」；原图卡片 `shot(IMG(n), 宽)` 一场最多一张。
- 画面跟话走：一场至少 3 个「念到这个词，这个东西出现/变化」。
- 简约：一种橙色，不用 emoji、渐变、光球。

## ④ 配音

```bash
bash $K/scripts/voice/tts.sh <项目>          # 逐句生成，半句失败自动重试
bash $K/scripts/voice/prepare.sh <项目>      # 收紧停顿 →（有 Whisper）补标点停顿、逐字对齐、逐句对稿
```

看 `finalize` 的对稿结果：英文被听错（Skill→Scale）、同音字不用管；**漏字、多字**要处理——先单独截那句再识别确认，确实漏了就改稿换说法，重跑 `tts.sh <项目> N` 和 `prepare.sh <项目> N`。

## ⑤ 画面 → scenes.mjs

照 storyboard 一场一个函数，`c.at("关键词")` 是旁白念到这个词的时刻（关键词必须在这句稿子里）。组件、动画参数、坐标见 `references/scene-patterns.md`，照着 `examples/16-Skill运行原理/scenes.mjs` 写。

```bash
node $K/scripts/engine/build.mjs <项目>                 # 生成 index.html + timeline.json，打印总时长
python3 $K/scripts/voice/gaps.py <项目>                 # 确认没有 >0.5 秒的无声段
node $K/scripts/engine/render.mjs <项目> --stills ends  # 每场结尾一张 → contact.jpg
node $K/scripts/engine/render.mjs <项目> --stills mid   # 每场 35%/70%
```

Read 看 contact.jpg 逐场查：结尾帧东西都出完了吗（没出完就把动作挪到更早的关键词）；有没有重叠、出界、标题折行；画面和字幕说的是一回事。改完再截，直到干净。

## ⑥ 封面

改 `<项目>/cover/cover.mjs` 顶部的 C：`big` + `line2` 拆第 1 页标题，`bubble` 用第 1 页副标题，`card` 换成本期的关键对象，`icons` 选相关图标。

```bash
node $K/scripts/cover/shot.mjs <项目>    # → cover/cover.png + thumb.png
```

看 thumb.png（300px 宽）标题要读得清。IP 形象默认 `assets/ip.png`，用户给了高清图就放到 `<项目>/cover/ip.png`。

## ⑦ 渲染合成

```bash
node $K/scripts/engine/render.mjs <项目>                     # 30fps 逐帧，2 分钟约 3 分钟
bash $K/scripts/voice/mix_bgm.sh <项目> "<标题>"              # 人声 -16 LUFS + 配乐 + 嵌封面
```

抽 5 帧看一眼，`ffprobe` 确认 1080×1440、时长、有音轨。只改配乐音量时改 config `bgmLUFS` 后重跑 `mix_bgm.sh`，不用重新渲染。

## ⑧ 交付

告诉用户：成片和封面路径、时长、音色和语速、最长停顿、对稿结果（哪几句改过、哪些是识别误报）、需要亲耳确认的地方。推送到 GitHub、飞书等外部位置要用户明确说了才做。

## 参考

- `references/script-style.md`：口播稿写法
- `references/scene-patterns.md`：画面组件、动画参数、布局坐标、现成写法
- `references/pitfalls.md`：踩过的坑
- `examples/16-Skill运行原理/`：稿子、分镜、画面代码、封面、分镜拼图
