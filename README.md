# AI 原理图解

用 3:4 竖版图文讲清楚 AI 里常见的概念。每套 7 张：第 1 张是一张流程图、时序图或架构图，后面几张用文字把东西讲明白。

| # | 主题 | 封面 |
|---|---|---|
| 01 | [AI 行业分几层？](01-AI行业划分) | 分层架构图 |
| 09 | [模型 API 怎么调？](09-模型API怎么调) | 调用架构图 |
| 13 | [上下文怎么管？](13-上下文工程) | 上下文结构图 |
| 15 | [Agent 循环是什么？](15-Agent循环) | 环形流程图 |
| 16 | [Skill 怎么运行？](16-Skill运行原理) | 加载时序图 |
| 17 | [MCP 是什么？](17-MCP) | 协议架构图 |

编号是整个系列的排期编号，后面会陆续补上 LLM 运行原理、提示词工程、缓存命中、RAG、预训练、后训练等主题。

## 预览

<table>
<tr>
<td><img src="01-AI行业划分/01.png" width="260"></td>
<td><img src="09-模型API怎么调/01.png" width="260"></td>
<td><img src="13-上下文工程/01.png" width="260"></td>
</tr>
<tr>
<td><img src="15-Agent循环/01.png" width="260"></td>
<td><img src="16-Skill运行原理/01.png" width="260"></td>
<td><img src="17-MCP/01.png" width="260"></td>
</tr>
</table>

## 文件说明

每个文件夹里：

- `01.png` – `07.png`：成图，2160×2880（3:4）
- `*.html`：源文件，一页一个 `<section>`，改文字直接改这里
- `render.sh`：重新导出 PNG

```bash
cd 16-Skill运行原理
./render.sh Skill运行原理.html     # 需要本机装有 Google Chrome
```

字体用的是苹方（PingFang SC），在 macOS 上导出效果最好。
