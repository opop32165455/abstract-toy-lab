# Abstract Toy Lab 设计资产规范

这份文件定义作品如何进入资产库、如何被审批，以及 AI 收到 Code 后应如何修改。它是项目设计工作的约束，不是审美灵感清单。

## 1. 目录与文件

- 所有可审批作品放在 `assets/` 下，可按产品、组件类型或主题继续分层。
- 当前支持 `.svg`、`.png`、`.jpg`、`.jpeg`、`.webp`、`.gif`。
- 文件名使用小写 `kebab-case`，表达“它是什么”，不要写 `final`、`new`、`v2-final`。
- 同一设计的探索稿应放在独立目录，例如 `assets/characters/cat/explorations/`；确定采用的版本放在上一级正式目录。
- 不把源代码、临时截图、参考图和待审批成品混在同一目录。需要时分别使用 `sources/`、`references/`、`assets/`。

推荐结构：

```text
assets/
  icons/
  characters/
    cat/
  components/
    buttons/
  patterns/
  illustrations/
```

## 2. 唯一 Code

目录生成器为每个作品生成形如 `ATL-ICONS-CAT-PAW-A1B2C3` 的 Code：

- `ATL`：项目命名空间。
- 中间两段：目录类别与文件名，方便人读。
- 末尾六位：文件内容指纹，避免重名冲突。

Code 首次写入审批记录后即视为稳定身份。文件只发生移动时，生成器会通过完整内容指纹找回原 Code 和审批；作品内容修改后仍应沿用原路径，审批台会继续显示同一位置的新内容。不要手工编造或批量改写 Code。

用户向 AI 提供 Code 时，AI 必须先在 `data/catalog.json` 查找 `code`，再读取对应的 `path` 和 `data/reviews.json` 中的批语。不要只凭文件名猜测。

## 3. 审批状态

- `pending`：待审批，尚不能作为正式资产使用。
- `approved`：已通过，可被其他程序引用。
- `changes_requested`：保留方向但需要修改，批语必须描述下一步。
- `rejected`：不采用，保留记录用于避免重复探索。

任何像素、路径、颜色、尺寸或语义上的内容变化，都应自动将原 `approved` 视为需要复审。当前工具不会删除历史批语；修改者应在批语中补充变更说明，并将状态改回 `pending`。

## 4. 标签

- 标签使用小写短词，推荐英文，便于跨项目搜索，例如 `animal`、`navigation`、`warm`、`outline`。
- 至少保留一个用途标签和一个视觉标签；目录名与文件类型会作为默认标签。
- 不用标签记录审批状态、版本号或人名，这些信息有独立字段。
- 同义词只选一个固定写法，例如统一使用 `character`，不要同时出现 `characters` 和 `avatar`。

## 5. SVG 交付要求

- 必须有正确的 `viewBox`；仅在固定尺寸本身具有语义时保留 `width`、`height`。
- 路径应可独立渲染，不依赖设计软件私有命名空间、外链字体或外部图片。
- 轮廓与填色保持有限、明确；避免不可解释的冗余节点和嵌套变换。
- 颜色优先使用项目基线色。需要让使用方换色的单色图标，可使用 `currentColor`；多色角色或插画可保留明确色值。
- 不在 SVG 内嵌脚本、事件处理器、远程资源或未经说明的滤镜。
- 需要无障碍语义的最终页面由使用方提供 `title` 或 `aria-label`；资产文件保持可复用。

## 6. AI 修改流程

1. 根据 Code 查 `data/catalog.json`，确认唯一目标路径。
2. 读取 `data/reviews.json` 中该路径的状态、标签和批语。
3. 只修改被点名的作品；如果修改会影响同系列一致性，先列出潜在受影响的其他 Code。
4. 保持原 `viewBox` 和调用方接口，除非批语明确要求改变。
5. 完成后运行 `npm run catalog` 与 `npm run check`。
6. 在 `data/reviews.json` 中保留原批语，将状态改为 `pending`，并在批语末尾追加简短变更摘要，等待用户重新审批。

## 7. 数据文件边界

- `data/catalog.json`：机器生成，不手工编辑；记录当前磁盘上真实存在的作品。
- `data/reviews.json`：审批事实源；静态审批台导出后由用户覆盖写入，可纳入 Git 版本控制。
- 删除作品前先检查其审批记录和外部使用方。生成器不会自动删除 `reviews.json` 中的历史记录，以免丢失决策背景。

审批数据结构：

```json
{
  "schemaVersion": 1,
  "updatedAt": "ISO-8601 time",
  "items": {
    "assets/icons/cat-paw.svg": {
      "code": "ATL-ICONS-CAT-PAW-XXXXXX",
      "contentHash": "12-char sha256 prefix",
      "status": "pending",
      "tags": ["icons", "vector"],
      "comment": "用户批语",
      "updatedAt": "ISO-8601 time"
    }
  }
}
```
