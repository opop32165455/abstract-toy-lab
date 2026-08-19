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
assets/icons/   可直接复制到小程序、Web 或其他项目的 SVG 图标
```

## 当前资产

- `cat-paw.svg` / `dog-paw.svg`：猫爪与狗爪
- `purse.svg`：荷包
- `settings.svg` / `chart.svg` / `settle.svg`：基础操作图标
- `add.svg` / `add-light.svg`：添加按钮图标
- `share.svg`：分享图标

## 使用约定

1. 新图标先放入 `assets/icons/`，保持单色或少色、圆角和清晰轮廓。
2. 颜色由使用方通过 CSS 或 SVG 属性适配，不在图标中写死一套新的品牌色。
3. 不为尚未出现的页面提前搭建组件、构建脚本或依赖；需要跨项目复用时再补最小的组件封装。
4. 每次新增资产说明用途，并保持文件名使用小写 kebab-case。

## 版本

当前为第一版资产快照，来源于 AB Purse 微信小程序。
