# Design System

A reusable visual and interaction foundation for the product. Keep this document focused on design language, tokens, typography, layout principles, and component behavior. Product-specific content, page structure, article layouts, and one-off illustrations belong in implementation documentation instead.

## 1. Design Direction

- **Mood:** editorial, technical, independent, and considered.
- **Surface language:** flat fills, crisp one-pixel rules, square corners, and minimal depth.
- **Hierarchy:** created through typography, contrast, borders, spacing, and alignment rather than decoration.
- **Density:** balanced; provide generous breathing room while keeping information easy to scan.
- **Motion:** brief and functional. Avoid animation that competes with content.

## 2. Color Tokens

Use semantic tokens rather than hard-coding colors in components.

### Light theme

| Token | Value | Use |
|---|---:|---|
| `--background` | `#F2F8FC` | Page background |
| `--foreground` | `#000000` | Primary text, borders, active controls |
| `--surface` | `#E3EEF5` | Secondary panels and muted surfaces |
| `--surface-subtle` | `#F8FCFF` | Softer inset surfaces |
| `--text-secondary` | `rgba(0, 0, 0, 0.76)` | Body and supporting copy |
| `--text-muted` | `rgba(0, 0, 0, 0.68)` | Metadata and tertiary labels |
| `--rule` | `rgba(0, 0, 0, 0.45)` | Subordinate dividers |
| `--selection` | `#000000` | Selected and inverted states |
| `--selection-text` | `#F2F8FC` | Text on selected states |

### Dark theme

| Token | Value | Use |
|---|---:|---|
| `--background` | `#24221F` | Page background |
| `--foreground` | `#F2F8FC` | Primary text, borders, active controls |
| `--surface` | `#302D28` | Secondary panels and muted surfaces |
| `--surface-subtle` | `#2A2824` | Softer inset surfaces |
| `--text-secondary` | `rgba(242, 248, 252, 0.76)` | Body and supporting copy |
| `--text-muted` | `rgba(242, 248, 252, 0.68)` | Metadata and tertiary labels |
| `--rule` | `#82796D` | Subordinate dividers |
| `--accent` | `#D1B46A` | Rare, restrained emphasis |
| `--selection` | `#F2F8FC` | Selected and inverted states |
| `--selection-text` | `#24221F` | Text on selected states |

### Color rules

- Maintain strong contrast for text, controls, and structural rules.
- Keep the palette restrained and primarily monochrome.
- Do not use gradients, neon colors, bloom, or glow effects.
- Theme changes should preserve component geometry; only semantic tokens change.
- Use accent colors sparingly and never as a replacement for hierarchy.
- Background colors must use a consistent reference saturation and value/lightness. When introducing a new color choice or theme, keep those values constant and change only the hue.
- Convert each resulting color to a hex value and store that hex value in the relevant semantic token. Do not leave generated HSL/HSV calculations or runtime color transformations as the source of truth.

## 3. Typography

### Families

- **Display and interface:** `Space Mono`, falling back to `ui-monospace, SFMono-Regular, Menlo, monospace`.
- **Body copy:** `Rubik`, falling back to `ui-sans-serif, system-ui, sans-serif`.

The contrast between a rigid monospaced interface voice and readable sans-serif copy is intentional.

### Type scale

| Role | Specification |
|---|---|
| Display | `clamp(2.4rem, 5.2vw, 4.16rem)`, weight 400, line-height `.95` |
| Large heading | `clamp(2rem, 4vw, 3rem)`, weight 700, line-height `1.08` |
| Heading | `clamp(1.5rem, 2.5vw, 2rem)`, weight 700, line-height `1.1` |
| Body | `1rem`, line-height `1.6` |
| Small copy | `.875rem`, line-height `1.4` |
| Interface label | `.6875rem`, uppercase, tracking `.12em` |
| Metadata | `.5625rem–.75rem`, uppercase, tracking `.10em–.16em` |

### Type rules

- Use tight negative tracking only for large monospaced headings.
- Keep body copy normally tracked and comfortably led.
- Use uppercase, wide-tracked mono labels for metadata, controls, and status text.
- Keep readable text blocks below roughly `65ch`.
- Do not use all-sans typography for interfaces that rely on the editorial/technical character.
- Body copy should not be smaller than `15px` on mobile.

## 4. Layout and Spacing

- Use a centered content frame with responsive gutters; `24px` is a useful large-screen baseline.
- Prefer a strict grid with consistent columns, rows, and one-pixel gaps where appropriate.
- Use whitespace and alignment to establish hierarchy.
- Let borders and section rules define structure instead of nested cards and shadows.
- Use `clamp()` for fluid display sizes and responsive spacing.
- Avoid horizontal overflow at every viewport size.
- Use a spacing scale based on multiples of `4px` or `8px`.
- Collapse complex multi-column layouts into a clear single-column flow on small screens.

## 5. Component Guidelines

### Shared principles

- Components should have clear hierarchy, predictable spacing, and semantic HTML.
- Use square corners by default: `border-radius: 0`.
- Prefer a crisp `1px` border using `--rule` or `--foreground`.
- Avoid floating containers, card stacks, heavy shadows, and pill-heavy interfaces.
- Component variants should change tokens, borders, or inversion—not introduce unrelated visual styles.

### Buttons and controls

- Primary controls use an inverted fill with background-colored text.
- Secondary controls use a transparent background with foreground text.
- Include visible hover, active, focus, and disabled states.
- Use subtle inversion or a `1–2px` translation for interaction feedback; never use glow.
- Keep touch targets at least `44×44px`, even when the visible control is smaller.

### Forms

- Use real labels and clear validation messages.
- Inputs should have a transparent or surface-colored background, a `1px` rule, square corners, and comfortable horizontal padding.
- Keep focus states visible with a `2px` outline offset from the component edge.
- Group related fields with consistent spacing and align labels with their controls.

### Panels and cards

- Treat cards as grid cells or grouped content, not floating objects.
- Use surface tokens to establish subtle contrast.
- Keep internal padding consistent and responsive.
- Do not nest cards inside cards unless the information hierarchy genuinely requires it.
- Use imagery sparingly and keep its treatment consistent with the overall palette.

### Labels, badges, and status

- Prefer compact outlined rectangular labels with uppercase monospaced text.
- Use wide tracking for metadata and status labels.
- Avoid colorful tag systems and excessive decorative badges.
- Do not communicate important state through color alone.

### Loading, empty, and error states

- Loading states should match the geometry of the content with restrained line-based skeletons.
- Empty states should preserve the surrounding layout and explain what is missing.
- Errors should appear inline near the affected content with clear recovery guidance.
- Avoid unexplained spinners and disruptive floating toasts.

## 6. Responsive Behavior

- Design for small screens first, then add columns and density as space permits.
- Keep primary actions accessible without relying on hover.
- Stack form controls and multi-column groups when they become cramped.
- Preserve readable line lengths, adequate padding, and minimum touch targets.
- Test at representative small, medium, and large viewport sizes.

## 7. Motion and Interaction

- Animate only `transform`, `opacity`, and color/background changes where possible.
- Keep transitions brief, generally `150–300ms`.
- Use motion to clarify state changes, navigation, and feedback—not to decorate every element.
- Respect `prefers-reduced-motion` by removing nonessential transitions and animation.
- Do not use parallax, cursor replacements, bouncing prompts, or large reveal choreography.

## 8. Accessibility

- Maintain accessible contrast in every theme and component state.
- Use semantic elements and appropriate ARIA only when native HTML is insufficient.
- Provide accessible names for icon-only controls.
- Preserve visible keyboard focus.
- Ensure selected, expanded, and disabled states are not conveyed by color alone.
- Associate labels, instructions, and error messages with form fields.
- Verify keyboard navigation, responsive layouts, and reduced-motion behavior.

## 9. Anti-Patterns

- Gradients, neon, bloom, and outer glows.
- Floating glass navigation or excessive blur.
- Conventional drop-shadow-heavy surfaces.
- Rounded card stacks and pill-heavy tag systems.
- Generic three-card marketing layouts.
- Decorative emoji or custom cursors.
- Overlapping copy, fragile absolute positioning, or unexplained ornament.
- Tiny body text or inaccessible low-contrast metadata.
- One-off component styles that do not use the shared tokens.

## 10. Implementation Checklist

1. Load the defined font families and required weights.
2. Define semantic color tokens for each theme.
3. Establish the spacing, type, border, and responsive primitives.
4. Build components with square geometry, clear states, and shared tokens.
5. Verify keyboard focus, contrast, touch targets, and reduced motion.
6. Test representative viewport sizes and confirm there is no horizontal overflow.
