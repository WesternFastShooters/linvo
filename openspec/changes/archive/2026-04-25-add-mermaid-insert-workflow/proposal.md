## Why

当前编辑器还没有一条完整的 Mermaid 插入工作流。用户虽然可以在 edgeless 画板上手动画图，但还做不到：

- 从顶部 toolbar 打开 Mermaid 插入入口；
- 在同一个界面中一边编辑 Mermaid 源码、一边预览渲染结果；
- 按照画板交互习惯，通过“先确认插入，再点击落点”的方式放置 Mermaid；
- 对简单流程图复用画板已有的 shape / connector 能力；
- 对画板无法原生表达的 Mermaid 图表自动回退到图片插入。

现在就需要先把这件事规范清楚，因为 Mermaid 插入不是一个孤立按钮，而是一整条工作流：编辑、预览、判定插入策略、进入放置态、最终落板。如果不先把工作流和边界定义清楚，后续实现要么会过度绑定某一种 Mermaid 图类型，要么会做出一个只能演示、无法扩展的临时 modal。

## What Changes

本变更为 edgeless 编辑器引入 Mermaid 插入工作流。

工作流包括：

- 在顶部 edgeless toolbar 中增加一个新的 `Mermaid` 入口；
- 增加一个两栏布局的 modal：
  - 左侧用于编辑 Mermaid 源码；
  - 右侧用于实时预览 Mermaid 渲染结果；
- 在 modal 底部居中提供 `Insert` 按钮；
- 点击 `Insert` 后进入一个短暂存在的拖拽预览态；
- 用户在 edgeless 画板上点击某处后才真正完成插入；
- 采用混合插入策略：
  - 对受支持的简单 `flowchart`，转换为原生 edgeless shapes、connectors、labels 和 group；
  - 对不支持原生表达的 Mermaid 图，转为渲染后的 SVG 图片插入；
- 明确 fallback 规则，确保像 `pie` 这样的图即使无法原生化，也仍然可以插入。

这个 proposal 不要求所有 Mermaid 图类型都能原生编辑。它定义的是一个可落地的原生转换边界，以及一个默认可用的 SVG fallback 路径。

## Capabilities

### New Capabilities

- `mermaid-insert`：在 edgeless 画板中完成 Mermaid 图的编辑、预览、放置和插入；在支持时使用原生元素插入，在不支持时使用 SVG 图片回退。

### Modified Capabilities

- 无。

## Impact

受影响的部分包括：

- edgeless toolbar 扩展和按钮注册；
- modal UI 和状态管理；
- Mermaid 渲染流程；
- edgeless 拖拽/放置 session；
- 对受支持 flowchart 的原生元素创建；
- 对不支持 Mermaid 图的 SVG 图片插入流程。

大概率会影响的代码区域：

- `src/extensions.ts`
- `src/editor.ts`
- `packages/linvo/widgets/edgeless-toolbar/**`
- `packages/linvo/blocks/image/**`
- edgeless CRUD 与 overlay 相关集成点

潜在新增依赖：

- Mermaid runtime 包，用于 render / parse

主要风险：

- 原生转换范围失控，越做越宽；
- 放置交互与现有 edgeless pointer 行为冲突；
- 后续若要支持重新编辑 Mermaid 源码，可能需要比普通图片更多的元数据承载方式。
