<h1 align="center">AI 原理图解</h1>

<p align="center"><code>ai-tujie</code></p>

<p align="center"><em>「一张图看清结构，六张图讲明白原理。」</em></p>

<p align="center">
  <img alt="26 套图组" src="https://img.shields.io/badge/图组-26%20套-f97316">
  <img alt="每套 7 张" src="https://img.shields.io/badge/每套-7%20张-2f6feb">
  <img alt="3 比 4 竖版" src="https://img.shields.io/badge/版式-3%3A4-333333">
</p>

用 3:4 竖版图文讲清楚 AI 里常见的概念。每套 7 张：第 1 张是一张流程图、时序图或架构图，后面几张用文字把东西讲明白。

| # | 主题 | 封面 |
|---|---|---|
| 01 | [AI 行业分几层？](01-AI行业划分) | 分层架构图 |
| 02 | [AI 公司跨几层？](02-AI行业归类) | 跨层布局图 |
| 03 | [大模型怎么写字？](03-LLM运行原理) | 逐词预测图 |
| 04 | [大模型有几种？](04-大模型类型) | 分类矩阵图 |
| 05 | [模型是怎么练的？](05-预训练) | 训练流水线图 |
| 06 | [模型怎么变听话？](06-后训练) | 阶段流程图 |
| 07 | [模型会突然开窍吗？](07-涌现) | 规模—能力曲线图 |
| 08 | [模型底下是什么？](08-AIinfra) | 分层架构图 |
| 09 | [模型 API 怎么调？](09-模型API怎么调) | 调用架构图 |
| 10 | [一次请求能装多少？](10-上下文窗口) | 容器分区图 |
| 11 | [账单为什么差一半？](11-缓存命中) | 前缀对比图 |
| 12 | [提示词怎么写？](12-提示词工程) | 结构拆解图 |
| 13 | [上下文怎么管？](13-上下文工程) | 上下文结构图 |
| 14 | [RAG 是什么？](14-RAG) | 双段管线图 |
| 15 | [Agent 循环是什么？](15-Agent循环) | 环形流程图 |
| 16 | [Skill 怎么运行？](16-Skill运行原理) | 加载时序图 |
| 17 | [MCP 是什么？](17-MCP) | 协议架构图 |
| 18 | [沙箱，防什么？](18-沙箱) | 内外边界图 |
| 19 | [AI 名词怎么记？](19-AI名词解释) | 分段词表图 |
| 20 | [知识库怎么搭？](20-LLM知识库搭建) | 搭建流程图 |
| 21 | [AI 怎么记住事？](21-AI记忆) | 跨会话记忆分流图 |
| 22 | [AI 怎么动手？](22-工具调用) | 模型与工具时序图 |
| 23 | [该用 Agent 吗？](23-工作流与Agent) | 工作流与 Agent 分岔图 |
| 24 | [中断后怎么接着干？](24-长任务续跑) | 长任务接力流程图 |
| 25 | [AI 哪步该问人？](25-人工确认) | 操作风险闸门图 |
| 26 | [Agent 怎么验收？](26-Agent评测) | 任务验收循环图 |

编号是整个系列的排期编号，26 套图组已全部完成。阅读路径是"看清这一行 → 模型怎么来的 → 怎么用上它 → 让它干好活 → 让它自己干 → 让它稳定干活"。图组完成不代表已经发布。

## 预览

<table>
<tr>
<td><img src="01-AI行业划分/01.png" width="260"></td>
<td><img src="02-AI行业归类/01.png" width="260"></td>
<td><img src="03-LLM运行原理/01.png" width="260"></td>
</tr>
<tr>
<td><img src="04-大模型类型/01.png" width="260"></td>
<td><img src="05-预训练/01.png" width="260"></td>
<td><img src="06-后训练/01.png" width="260"></td>
</tr>
<tr>
<td><img src="07-涌现/01.png" width="260"></td>
<td><img src="08-AIinfra/01.png" width="260"></td>
<td><img src="09-模型API怎么调/01.png" width="260"></td>
</tr>
<tr>
<td><img src="10-上下文窗口/01.png" width="260"></td>
<td><img src="11-缓存命中/01.png" width="260"></td>
<td><img src="12-提示词工程/01.png" width="260"></td>
</tr>
<tr>
<td><img src="13-上下文工程/01.png" width="260"></td>
<td><img src="14-RAG/01.png" width="260"></td>
<td><img src="15-Agent循环/01.png" width="260"></td>
</tr>
<tr>
<td><img src="16-Skill运行原理/01.png" width="260"></td>
<td><img src="17-MCP/01.png" width="260"></td>
<td><img src="18-沙箱/01.png" width="260"></td>
</tr>
<tr>
<td><img src="19-AI名词解释/01.png" width="260"></td>
<td><img src="20-LLM知识库搭建/01.png" width="260"></td>
</tr>
<tr>
<td><img src="21-AI记忆/01.png" width="260"></td>
<td><img src="22-工具调用/01.png" width="260"></td>
<td><img src="23-工作流与Agent/01.png" width="260"></td>
</tr>
<tr>
<td><img src="24-长任务续跑/01.png" width="260"></td>
<td><img src="25-人工确认/01.png" width="260"></td>
<td><img src="26-Agent评测/01.png" width="260"></td>
</tr>
</table>

## 快速开始

每个文件夹里：

- `01.png` – `07.png`：成图，2160×2880（3:4）
- `*.html`：源文件，一页一个 `<section>`，改文字直接改这里
- `render.sh`：重新导出 PNG

## 使用

进入对应图组，修改 HTML 后重新导出：

```bash
cd 16-Skill运行原理
./render.sh Skill运行原理.html     # 需要本机装有 Google Chrome
```

字体用的是苹方（PingFang SC），在 macOS 上导出效果最好。

## 许可

仓库目前没有单独声明开源许可。
