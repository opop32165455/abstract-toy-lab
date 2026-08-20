---
name: color-palette-maker
description: "Create, evaluate, and maintain the versioned color palette for Abstract Toy Lab. Use for palette, color-token, contrast, or visual color-direction work; not for unrelated design changes."
---

# Color Palette Maker

Use this skill for color decisions in this repository. The authoritative project palette is [palette.json](palette.json).

## Workflow

1. Read `palette.json` before proposing a new color direction or changing a color token.
2. Preserve the semantic role names when refining a color; add a role only when it represents a new reusable purpose.
3. If the Color Designer - Palette Maker app is available, open its color UI using the current palette values so the user can tune them visually. If it is unavailable, present a concise list of proposed hex changes instead.
4. Do not silently replace an approved base color. Record the decision in `palette.json` by updating the relevant token and `updatedAt`.
5. When colors are used by the static page, update the matching CSS custom properties in `styles.css` in the same change.

## Constraints

- Keep the warm, playful AB Purse direction unless the user explicitly asks for a different visual direction.
- The `ink` and `paper` tokens must remain readable together; evaluate contrast before changing either.
- Use token names in CSS where practical. Avoid scattering new literal colors for an existing semantic role.
- Do not use color values to encode review status when a status token already exists.

## Handoff

State the palette tokens changed, the visual reason, and whether the user approved the resulting colors. The remote Color Designer app is optional; this local Skill and `palette.json` remain usable by any AI.
