# Abstract Toy Lab

抽象玩具研究所（Abstract Toy Lab）

一套带有玩具感、漫画感和轻微抽象气质的可复用 UI 资产库，服务于 AB 荷包及后续个人项目。

## 设计基线

- 气质：Playful / toy-like，圆润、轻手绘、少量不对称
- 主色：`#FFC94D` 荷包黄
- 底色：`#FFF8E8` 奶油白
- 墨色：`#2A1B12` 深棕
- 辅助色：`#F39AA9` 猫咪粉、`#F58A78` 暖珊瑚
- 字体：中文 ZCOOL KuaiLe；日文 Kiwi Maru Medium；数字与常见符号 Baloo 2
- 图标：圆润 SVG，优先使用实心块面和柔和边角，不使用 emoji 代替图标

## 目录

```text
assets/               可审批、可复用的 SVG 与图片资产
references/style/      用户提供的风格参考图，不进入审批目录
data/catalog.json     根据 assets 自动生成的作品索引与唯一 Code
data/catalog.js       供静态 HTML 直接加载的目录清单
data/reviews.js       由 reviews.json 同步出的静态初始审批记录
data/reviews.json     用户审批状态、标签和批语
scripts/              目录生成与项目自检脚本
index.html            本地设计审批台
DESIGN_RULES.md       人类与 AI 共同遵守的资产规则
```

## 打开审批台

这是一个无框架、可直接打开的静态 HTML 页面。直接双击 `index.html` 即可浏览资产和使用字体试验台。

审批内容会暂存在当前浏览器；完成一轮审批后，点击页面右上角的“导出 JSON”，再用导出的文件覆盖 `data/reviews.json`，然后运行一次 `npm run catalog` 以同步静态初始数据。下次也可以直接用“导入 JSON”继续该轮审批。静态 HTML 没有权限自行改写磁盘文件，因此这个导入/导出步骤是有意保留的。

## 常用操作

```bash
npm run catalog  # 新增或移动作品后，单独重建静态目录清单
npm run check    # 检查目录、Code 唯一性与审批数据格式
```

每件作品都有唯一的 `ATL-...` Code。把 Code 复制给另一个 AI，它应先通过 `data/catalog.json` 定位作品，再结合 `data/reviews.json` 的批语进行修改。完整规则见 `DESIGN_RULES.md`。

## AB 荷包字体试验台

页面已内置 AB 荷包目前加载的四套字体，文件位于 `assets/fonts/`：

- ZCOOL KuaiLe：中文标题
- Kiwi Maru Medium：日文正文
- Baloo 2 Bold：英文、数字和金额

可分别指定中文、日文、英文/数字的字体，也可用“全篇单一字体”检查某一字体是否有对应字符的原生字形（浏览器回退会在页面中直接呈现）。

## 当前资产

- `cat-paw.svg` / `dog-paw.svg`：猫爪与狗爪
- `purse.svg`：荷包
- `settings.svg` / `chart.svg` / `settle.svg`：基础操作图标
- `add.svg` / `add-light.svg`：添加按钮图标
- `share.svg`：分享图标
- `assets/icons/system/`：系统与应用高频图标库，涵盖文件操作（保存、复制、文件夹、文档、图片、过滤、排序、撤销、重做）、用户权限（用户、群组、加用户、锁、解锁、钥匙、安全盾牌）、社交互动（爱心、星标、书签、消息、铃声、邮件、发送、点赞）、硬件设备（相机、麦克风、音量、静音、Wi-Fi、电池、充电动效、日月模式）、财务统计（信用卡、钱包、钱币、购物袋、购物车、标签、饼图、趋势上升）、通用工具（时钟、沙漏、定位、指南针、眼睛/密码显隐、链接、勋章）及导航基础操作
- `assets/icons/calendar/`：日历、打卡、连续记录与提醒等轻量图标
- `assets/components/check-in/`：周进度、月历、习惯卡与打卡成功状态等可组合 UI 参考

## 风格参考

`references/style/cat-watercolor/` 保存用户提供的猫咪水彩插画参考。只学习其暖色、圆润轮廓、手绘抖动、动作线与留白，不直接复刻角色、姿势、文字、签名或构图。

## 使用约定

1. 新图标先放入 `assets/icons/`，保持单色或少色、圆角和清晰轮廓。
2. 颜色由使用方通过 CSS 或 SVG 属性适配，不在图标中写死一套新的品牌色。
3. 不为尚未出现的页面提前搭建组件或引入依赖；需要跨项目复用时再补最小的组件封装。
4. 每次新增资产说明用途，并保持文件名使用小写 kebab-case。
5. 新增或实质修改的作品必须回到 `pending`，只能由用户在审批台标记为 `approved`。

## 版本

当前为第一版资产快照，来源于 AB Purse 微信小程序。
