---
name: abstract-toy-design
description: "Create, review, or modify Abstract Toy Lab visual assets, SVGs, fonts, and approval records. Use for design work in this repository; not for unrelated application logic."
---

# Abstract Toy Design

Use this skill when the request touches a visual asset, design language, SVG, font, font preview, asset approval, or an `ATL-...` Code in this repository.

## Working context

- The project is an asset archive for playful, toy-like, abstract cartoon and comic styling.
- Reviewable assets live under `assets/`; the current groups include `assets/icons/` and `assets/fonts/`.
- The static review page is `index.html`. It has separate “设计资产” and “字体实验室” work areas; do not mix SVG approval UI into the font area.
- The project uses three bundled AB Purse fonts: ZCOOL KuaiLe (Chinese), Kiwi Maru Medium (Japanese), and Baloo 2 Bold (English and numbers). Unbound language segments should use the browser/system fallback, not an extra bundled fallback font.
- For palette or color-token work, additionally read [Color Palette Maker](../color-palette-maker/SKILL.md).
- For illustration-inspired icon work, inspect the user-provided references and notes in `references/style/cat-watercolor/`. Learn from their warm watercolor, rounded doodle lines, motion marks, and generous white space; do not copy their characters, poses, signatures, lettering, or compositions.

## Before changing an asset

1. If the request names an `ATL-...` Code, resolve it in `data/catalog.json`; do not guess from its name.
2. Read the matching entry in `data/reviews.json` and preserve the user’s comments.
3. For SVG and asset changes, follow [DESIGN_RULES.md](../../DESIGN_RULES.md). For the visual baseline and current fonts, read [README.md](../../README.md).

## Design constraints

- Preserve the existing warm AB Purse palette and rounded, lightly hand-drawn character unless the user requests a new direction.
- Keep SVGs portable: valid `viewBox`, no scripts, no external resources, and no unnecessary private-editor markup.
- A material asset change must return to `pending`; never approve work on the user’s behalf.
- Do not manually edit `data/catalog.json`. After asset changes, run `npm run catalog` and `npm run check`.

## Font laboratory behavior

- A font card only exposes language tags for languages it is intended to support.
- Each language tag is an independent on/off binding. Repeated click removes that binding.
- A selected font card remains highlighted while it owns at least one language.
- If a language has no selected asset font, the non-interactive browser/system fallback card must show that it is rendering that language.

## Handoff

Summarize changed asset paths and ATL Codes, note any review status reset, and state the validation result. Keep normal code-only changes outside this skill’s scope.
