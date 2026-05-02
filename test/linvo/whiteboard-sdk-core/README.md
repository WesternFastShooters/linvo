# `@linvo/test-linvo-runtime`

一个不依赖旧共享文档运行时、`@linvo-core/store`、`@linvo-core/std` 的离线白板运行时骨架。

这次改动已经落地的能力：

- `PlainText`
  - 用本地字符串和轻量观察器替代 `Y.Text`
  - 提供 `insert/delete/replace/toDelta/toJSON`
- `LocalStore`
  - 提供本地事务 `transact`
  - 提供 `undo/redo/withoutHistory`
  - 提供事务提交事件和历史状态事件
- `LocalSurfaceModel`
  - 用 `Map<string, LocalElementState>` 管理 element
  - 提供 `add/update/delete/import/export`
  - 提供 element add/update/remove 事件
- `LocalElementModel`
  - 作为 plain object element 的轻量包装器

## 设计边界

这个包故意不做下面这些事：

- 不接入旧共享文档运行时
- 不接入 `UndoManager`
- 不接入 `awareness`
- 不接入 `framework/sync`
- 不直接复用现有 `SurfaceBlockModel` / `GfxPrimitiveElementModel`
- 不直接复用 `<rich-text>`

目标是先把离线 SDK 的数据层独立出来，再由上层 UI 逐步迁移。

## 建议接入方式

1. 新 SDK 入口直接实例化 `LocalStore + LocalSurfaceModel`
2. 画板工具层先改调本地 surface API
3. 文字编辑改接 `PlainTextEditor`
4. 旧共享文档格式通过一次性导入器迁入本地 snapshot

## Todo List

### 1. 接管 element 基类

状态：`已完成基础 runtime，待接 UI`

怎么做：

- 新建一套离线 element class，继承 `LocalElementModel`
- 不再让 element 持有 `yMap`
- 原来依赖 `@field/@observe` 的属性，先直接改成普通 getter/setter 或显式 `patch`
- 优先迁移：
  - `shape`
  - `text`
  - `connector`
  - `group`
  - `mindmap`

完成标准：

- 这几类 element 能在不导入旧共享文档运行时的前提下完成新增、更新、删除、序列化

### 2. 替换 shape/text/group/connector 的文本能力

状态：`已提供 PlainText，待替换 UI`

怎么做：

- 把以下字段从 `Y.Text` 改成 `PlainText`
  - `shape.text`
  - `text.text`
  - `connector.text`
  - `group.title`
  - `mindmap` 节点文本
- 富文本编辑器先降级成单段纯文本编辑
- 渲染层继续调用 `toString()` 或 `toDelta()`

完成标准：

- SDK 中不再出现运行时 `Y.Text`
- 文本元素仍然可以编辑和导出

### 3. 替换 group / mindmap 容器字段

状态：`runtime 已支持 plain object，待迁模型`

怎么做：

- `group.children` 改成 `Record<string, boolean>`
- `mindmap.children` 改成 `Record<string, NodeDetail>`
- 原来靠 `Y.Map.observe` 触发的逻辑，改成显式调用：
  - `addChild`
  - `removeChild`
  - `buildTree`
  - `layout`

完成标准：

- SDK 中不再出现运行时 `Y.Map` 容器字段

### 4. 抽掉 SurfaceBlockModel 的 block 依赖

状态：`已提供 LocalSurfaceModel，待迁工具层`

怎么做：

- 新 SDK 不再实例化 `SurfaceBlockModel`
- 工具层直接依赖 `LocalSurfaceModel`
- 依赖 `store.getModelById/hasBlock/deleteBlock` 的逻辑要拆开
- `frame` 如果要保留，建议改造成 surface element，不要再走 block 模型

完成标准：

- 白板运行时不再要求 document block tree 存在

### 5. 剪贴板和模板改成本地 snapshot

状态：`已提供 import/export snapshot，待接入功能`

怎么做：

- 复制粘贴统一走 `LocalSurfaceSnapshot`
- 模板导出直接序列化 `surface.exportSnapshot()`
- 模板导入直接 `surface.importSnapshot(snapshot)`
- 不再构造 `Y.Map/Y.Text`

完成标准：

- clipboard/template 路径不再依赖 `surface-transformer.ts` 里的旧共享文档适配逻辑

### 6. 用本地命令栈替换 UndoManager 绑定

状态：`已实现 LocalStore undo/redo`

怎么做：

- 工具层统一通过 `store.transact()` 包住修改
- 不再依赖 `transaction.origin`
- 不再依赖 `trackedOrigins`
- 需要 selection 恢复的话，在事务层自己追加 selection patch

完成标准：

- `undo/redo` 完全不再依赖 `Y.UndoManager`

### 7. 彻底移除同步和多人状态

状态：`待删`

怎么做：

- SDK 构建中删除：
  - `framework/sync`
  - `AwarenessStore`
  - remote selection
  - remote color
- UI 如果还要显示多人状态，放到宿主应用自己做

完成标准：

- SDK bundle 不再包含旧共享文档运行时和旧同步协议层

### 8. 做旧数据一次性迁移器

状态：`待实现`

怎么做：

- 提供一个单向转换器，把旧 surface / template / clipboard 数据转成 `LocalSurfaceSnapshot`
- 允许旧系统导出，新 SDK 导入
- 不要求运行时双向兼容

完成标准：

- 旧数据可以进入离线 SDK
- 新 SDK 运行期不再携带旧共享文档运行时

## 推荐施工顺序

1. 先迁 element 数据层
2. 再迁文本编辑
3. 再迁 group/mindmap 容器
4. 再迁 clipboard/template
5. 最后删除旧共享文档/sync/awareness 依赖

## 代码入口

- [PlainText](./src/plain-text.ts)
- [LocalStore](./src/local-store.ts)
- [LocalSurfaceModel](./src/local-surface.ts)
- [LocalElementModel](./src/local-element.ts)
