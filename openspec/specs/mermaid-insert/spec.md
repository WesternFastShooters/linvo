# mermaid-insert Specification

## Purpose
TBD - created by archiving change add-mermaid-insert-workflow. Update Purpose after archive.
## Requirements
### Requirement: Mermaid Toolbar 入口

edgeless 编辑器 SHALL 在顶部 toolbar 中暴露一个 Mermaid 入口，用于启动 Mermaid 插入工作流。

#### Scenario: 从 toolbar 打开 Mermaid modal
- **WHEN** 用户在 edgeless 模式下点击 Mermaid toolbar 入口
- **THEN** 编辑器打开 Mermaid modal
- **AND** modal 展示 Mermaid 编辑与预览相关控件

### Requirement: Mermaid 编辑 Modal

Mermaid modal SHALL 在允许插入之前提供左右分栏的编辑与预览能力。

#### Scenario: 根据 Mermaid 源码渲染预览
- **WHEN** modal 已打开且 Mermaid 源码有效
- **THEN** 左侧栏 SHALL 展示 Mermaid 源码编辑区
- **AND** 右侧栏 SHALL 展示 Mermaid 渲染预览
- **AND** `Insert` 操作 SHALL 可用

#### Scenario: Mermaid 源码无效时禁止插入
- **WHEN** Mermaid 源码无法成功渲染
- **THEN** 预览区域 SHALL 展示错误状态
- **AND** `Insert` 操作 SHALL 被禁用

### Requirement: 带瞬态 Ghost 的 Placement Session

用户确认插入后，编辑器 SHALL 进入一个一次性的 placement session，并显示一个跟随指针移动的半透明 ghost。

#### Scenario: 启动 placement session
- **WHEN** 用户在存在有效 Mermaid 渲染结果时点击 `Insert`
- **THEN** modal SHALL 关闭
- **AND** 编辑器 SHALL 显示一个跟随指针移动的半透明 Mermaid ghost
- **AND** 该 ghost SHALL 仅存在于当前 placement session 生命周期内

#### Scenario: 取消 placement session
- **WHEN** placement session 正在进行且用户执行取消
- **THEN** ghost SHALL 被移除
- **AND** 画板中 SHALL 不会插入任何 Mermaid 内容

### Requirement: 点击画板后才真正放置 Mermaid

编辑器 SHALL 仅在用户点击 edgeless 画板某个位置后，才真正提交 Mermaid 插入。

#### Scenario: 通过画板点击提交放置
- **WHEN** placement session 正在进行且用户点击了 edgeless 画板中的一个有效位置
- **THEN** 编辑器 SHALL 将 Mermaid 结果以该位置为锚点插入画板
- **AND** ghost SHALL 被移除
- **AND** placement session SHALL 结束

### Requirement: Mermaid 采用混合插入策略

编辑器 SHALL 针对每个 Mermaid 结果决定插入方式：能原生表达时使用原生 edgeless 元素，不能原生表达时使用 SVG 图片 fallback。

#### Scenario: 对受支持 flowchart 使用 native insertion
- **WHEN** Mermaid 结果属于已定义原生转换范围内的受支持 `flowchart`
- **THEN** 编辑器 SHALL 将其作为原生 edgeless 元素插入
- **AND** 插入结果 SHALL 由 shapes、connectors、labels 和最终 group 组成

#### Scenario: 对不支持的 Mermaid 图使用 image fallback
- **WHEN** Mermaid 结果超出已定义原生转换范围
- **THEN** 编辑器 SHALL 将其作为渲染后的 SVG 图片插入

#### Scenario: 对 pie chart 使用 image fallback
- **WHEN** Mermaid 结果是一个 `pie` 图
- **THEN** 编辑器 SHALL 将其作为渲染后的 SVG 图片插入
- **AND** 编辑器 SHALL NOT 尝试用原生 edgeless primitives 去近似表达 pie chart

### Requirement: 原生转换范围必须显式收敛

编辑器 SHALL 将 v1 的原生转换限制在当前 edgeless primitives 能可靠表达的 Mermaid 图和特性范围内。

#### Scenario: 转换基础支持范围内的 flowchart 节点与边
- **WHEN** Mermaid 输入是一个仅包含受支持节点形状和有向边的 `flowchart`
- **THEN** 编辑器 SHALL 将这些节点映射为现有 edgeless shape 类型
- **AND** 编辑器 SHALL 将这些边映射为现有 edgeless connector 类型

#### Scenario: flowchart 使用不支持特性时回退
- **WHEN** 一个 `flowchart` 使用了超出受限原生范围的不支持特性
- **THEN** 编辑器 SHALL 回退为渲染后的 SVG 图片插入
- **AND** 编辑器 SHALL NOT 插入一个部分原生、部分失真的图

