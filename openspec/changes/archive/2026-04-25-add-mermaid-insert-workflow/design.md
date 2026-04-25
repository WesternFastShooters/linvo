## Context

当前仓库是一个基于 BlockSuite/AFFiNE primitives 构建的 edgeless 白板。它已经具备：

- 通过 edgeless toolbar quick/senior tools 扩展顶部工具栏；
- 使用 shape、connector 等原生画板元素；
- 在 edgeless surface 中插入图片；
- 通过 overlay 提供拖拽过程中的临时视觉反馈。

本次 Mermaid 工作流有两种本质不同的落板目标：

1. 对画板能够较好表达的图，落为原生 edgeless primitives；
2. 对画板无法原生表达的图，落为渲染后的 SVG 图片。

整个设计的核心约束是：对用户来说这必须是一条统一的 Mermaid 插入工作流，但在内部允许根据图类型分流。

## Goals / Non-Goals

**Goals:**

- 在顶部 toolbar 增加一个 Mermaid 入口并打开 modal。
- 提供 Mermaid 源码编辑和实时预览的左右分栏界面。
- 点击 `Insert` 后支持一个短暂存在的拖拽 ghost。
- 只有用户在 edgeless 画板点击某处后才真正完成插入。
- 将受支持的 `flowchart` 转换为原生 edgeless 元素。
- 对不支持的 Mermaid 图类型，包括 `pie`，自动回退为 SVG 图片插入。
- 为 v1 定义一个收敛、可实现的原生转换范围。
- 保持后续扩展其他 Mermaid 图类型的空间。

**Non-Goals:**

- 在 v1 中原生支持所有 Mermaid 语法。
- 在 v1 中支持插入后完整回写 Mermaid 源码并重新编辑。
- 无损映射 Mermaid 的所有样式能力到 edgeless 样式系统。
- 在 placement 期间真的往画板里塞一个临时持久化元素。
- 替换现有的 edgeless toolbar 或 pointer 架构。

## Decisions

### 1. 采用混合插入模型

系统在 Mermaid 成功渲染后，会先生成一个内部 insert plan：

- 对受支持 flowchart 生成 `native` plan；
- 对其他情况生成 `image` plan。

这样可以保持用户看到的是一条统一工作流，同时避免实现阶段被迫承诺“所有 Mermaid 都原生化”。

### 2. 将插入后的预览定义为瞬态 drag ghost

跟随鼠标移动的半透明预览图不是画板元素，也不会写入文档模型。它只是一个短暂存在的交互产物，生命周期仅覆盖：

- 用户点击 `Insert` 之后；
- 用户完成放置或取消之前。

这和用户要求一致，也和仓库里现有 overlay / drag controller 的思路一致。

### 3. 将放置行为设计为一次性 session

点击 `Insert` 后：

- modal 关闭；
- 编辑器进入 Mermaid placement session；
- ghost 跟随鼠标；
- 用户下一次有效的画板点击会提交插入；
- 按 `Escape` 或取消会清理整个 session。

这样可以避免交互状态不清晰，也能让整体行为保持可预测。

### 4. 在 v1 中严格收敛原生转换范围

v1 的原生转换仅支持受限子集的 Mermaid `flowchart`：

- 将节点形状映射到现有 edgeless shape：
  - rectangle
  - rounded rectangle
  - diamond
  - ellipse
- 使用 edgeless connector 表达有向边；
- 支持节点 label；
- Mermaid 可解析出的 edge label 在可行时也一并转换。

对于 `flowchart` 中不在支持范围内的特性，不做部分原生化，而是整体回退到 image fallback。

典型 fallback 触发条件包括：

- 不支持的 icon 或 HTML label；
- 不属于受支持 `flowchart` 范围的 Mermaid 图类型；
- 当前 shape / connector primitives 无法可靠表达的布局或视觉结构。

### 5. 对非原生 Mermaid 图统一使用 SVG fallback

对于 `pie` 这类图表，编辑器将：

- 先把 Mermaid 渲染为 SVG；
- 再将 SVG 包装为图片负载；
- 最终通过现有 edgeless image pipeline 插入。

这样可以保证所有 Mermaid 图都“可插入”，而不需要为画板本来不擅长的图表硬拼出一套脆弱的原生表达。

### 6. 实现分为四层

#### Toolbar / Modal 层

职责：

- 注册 toolbar 入口；
- 打开/关闭 modal；
- 管理 Mermaid 输入状态；
- 展示渲染错误；
- 只有在渲染结果有效时才允许点击 `Insert`。

#### Mermaid Render 层

职责：

- 初始化 Mermaid runtime；
- 将 Mermaid 源码渲染为 SVG；
- 判断 diagram type；
- 计算渲染尺寸；
- 输出标准化 render result。

建议输出结构：

```ts
type MermaidRenderResult = {
  code: string;
  svg: string;
  width: number;
  height: number;
  diagramType: 'flowchart' | 'pie' | 'sequence' | 'class' | 'unknown';
};
```

#### Insert Plan 层

职责：

- 决定走 `native` 还是 `image`；
- 判断当前 Mermaid 是否落在 v1 原生支持范围内；
- 生成可直接用于落板的 plan。

建议结构：

```ts
type MermaidInsertPlan =
  | {
      kind: 'native';
      width: number;
      height: number;
      nodes: NativeNodePlan[];
      edges: NativeEdgePlan[];
    }
  | {
      kind: 'image';
      width: number;
      height: number;
      svg: string;
    };
```

#### Placement Session 层

职责：

- 创建并移动 ghost；
- 将 viewport 坐标转换为 model 坐标；
- 校验 placement 目标；
- 提交 native/image 插入；
- 在成功或取消时释放 session 状态。

### 7. 原生插入通过现有 edgeless primitives 提交

对于受支持的 flowchart，commit 阶段将：

- 以用户点击点为锚点，对 plan 做整体平移；
- 通过 edgeless CRUD 创建 shapes；
- 通过 edgeless CRUD 创建 connectors；
- 在现有画板 primitives 能支持的范围内附加 labels 和样式；
- 将整组插入元素分组，使它在放置完成后作为一个逻辑整体被选中和操作。

分组是必要的，因为对用户来说这是一次插入一个 Mermaid 图，而不是一次插入若干零散元素。

### 8. 图片插入通过现有 image pipeline 提交

对于 fallback 图，commit 阶段将：

- 将 SVG 字符串转换为 `File`；
- 通过现有 edgeless image helper 插入；
- 将新插入的图片选中。

这条路径实现成本最低，也能最大程度复用当前图片尺寸、索引和选择逻辑。

### 9. v1 不处理 Mermaid 回编辑

v1 不要求重新打开一个已插入对象并恢复出 Mermaid 源码。spec 不应默认假设图片插入结果或 native group 可以无损逆向恢复成 Mermaid。

但设计上也不应封死后续能力，例如未来增加专门的 `affine:mermaid` block 或额外 metadata 承载层。

## Risks / Trade-offs

- 如果基于 Mermaid 渲染后的 SVG 位置来做 native conversion，实现可能更快，但 Mermaid 输出结构一旦变化，稳定性会差。
- 如果基于 Mermaid AST 做 native conversion，结构更干净，但实现复杂度和 parser 耦合都会明显上升。
- 严格 fallback 策略可以减少“半对半错”的图，但对某些 `flowchart` 输入会显得保守。
- 如果没有 round-trip metadata，v1 插入出来的结果就是单向制品。
- placement session 不能干扰现有画板 pointer、selection 或 toolbar hide/show 行为。

v1 推荐取舍：

- 以 Mermaid 渲染结果作为预览真值来源；
- 对 `flowchart` 使用严格校验的窄范围原生转换；
- 当转换置信度不足时，果断回退为 image insertion。
