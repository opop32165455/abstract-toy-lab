# Agent instructions for Abstract Toy Lab

For any visual asset, SVG, font, review, or design-page request, first read and follow [skills/abstract-toy-design/SKILL.md](skills/abstract-toy-design/SKILL.md).

For any palette, color-token, contrast, or color-direction request, first read and follow [skills/color-palette-maker/SKILL.md](skills/color-palette-maker/SKILL.md).

Before creating or changing any visual asset, read `DESIGN_RULES.md` and the target asset's entry in both `data/catalog.json` and `data/reviews.json`.

- Resolve user-provided ATL Codes through `data/catalog.json`; never guess a path.
- Treat `assets/` as the reviewable deliverable surface and preserve its directory semantics.
- Follow the existing playful, toy-like, abstract cartoon language documented in `README.md` unless the user's review explicitly overrides it.
- Do not mark your own design `approved`. New or materially changed work must be `pending` until the user approves it.
- Preserve the user's comments. Append a concise change summary instead of replacing their review history.
- After asset changes, run `npm run catalog` and `npm run check`.
- Do not hand-edit `data/catalog.json`; it is generated from files on disk.
