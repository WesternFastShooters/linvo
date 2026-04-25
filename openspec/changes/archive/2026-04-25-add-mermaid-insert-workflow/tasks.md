## 1. Toolbar 与 Modal

- [x] 1.1 使用现有 toolbar extension 机制，在 edgeless 顶部 toolbar 中注册新的 `Mermaid` 入口。
- [x] 1.2 实现 Mermaid modal，包含左右两栏布局、底部居中的 `Insert` 按钮、关闭/取消逻辑，以及 loading/error 状态。
- [x] 1.3 增加编辑器状态管理，覆盖 Mermaid 源码、渲染结果和是否允许插入。

## 2. Mermaid 渲染流程

- [x] 2.1 集成 Mermaid runtime，并以兼容当前 Vite / 浏览器环境的方式完成初始化。
- [x] 2.2 实现 render-to-SVG 流程，返回标准化结果，至少包含 diagram type 和渲染尺寸。
- [x] 2.3 增加校验和错误处理，确保 Mermaid 源码无效时禁用插入，并在 modal 中显示可理解的错误反馈。

## 3. Insert Plan

- [x] 3.1 定义 `MermaidInsertPlan` 抽象，明确区分 native insertion 和 image fallback。
- [x] 3.2 仅针对受限 `flowchart` 子集实现 v1 的原生支持判定。
- [x] 3.3 为不支持的图，包括 `pie`，实现 fallback plan 生成，产出 SVG image insert plan。

## 4. Placement Session

- [x] 4.1 实现一次性的 Mermaid placement session：点击 `Insert` 后开始，放置成功或取消后结束。
- [x] 4.2 实现一个跟随指针移动的半透明 drag ghost，并保证它绝不作为画板元素持久化。
- [x] 4.3 处理画板点击放置、`Escape` 取消，以及 ghost / session 状态清理。

## 5. 提交插入

- [x] 5.1 实现 native plan 的 commit：创建 edgeless shapes、connectors、labels 以及最终 group。
- [x] 5.2 实现 image plan 的 commit：把 SVG 转成 file，并通过现有 edgeless image utilities 插入。
- [x] 5.3 在 commit 完成后选中新插入结果，使工作流结束在一个可预测的画板状态上。

## 6. 验证

- [x] 6.1 为 modal 状态切换、渲染失败处理和 plan 选择增加聚焦测试。
- [x] 6.2 为受支持的原生 `flowchart` 插入增加测试。
- [x] 6.3 为 `pie` 等 fallback 图插入增加测试。
- [x] 6.4 运行 `openspec validate add-mermaid-insert-workflow`，确保 OpenSpec change 合法。
