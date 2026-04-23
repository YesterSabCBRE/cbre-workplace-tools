# CBRE Brand Specification
> Source: `cbre_template_2024_us (2).potx` (October 2024), theme name "Master presentation 2024"

---

## Fonts

### Primary Typefaces

| Font | Weight/Style | PowerPoint Name | Use |
|------|-------------|-----------------|-----|
| Calibre | Regular | `Calibre` | Body text, general content |
| Calibre | Light | `Calibre Light` | Statements, dividers, supporting text |
| Calibre | Medium | `Calibre Medium` | Subheadings, emphasis |
| Calibre | Semibold | `Calibre Semibold` | Slide titles, key headings, numbers |
| Financier Display | Regular | `Financier Display` | Long pull quotes, 44pt max 3 lines |

### Accent / Specialty Fonts (use sparingly)

| Font | Use |
|------|-----|
| `Space Mono` | Code references, monospace accents on title slides |
| `Barlow Condensed` | Thank you / closing slide decorative text |

### Font Hierarchy by Slide Type

| Context | Font | Size |
|---------|------|------|
| Title slide — main headline | Calibre Semibold | 72–88pt |
| Divider slide — large text | Calibre Light | 44–66pt |
| Statement / pull quote | Financier Display | 44pt |
| Slide title (content slides) | Calibre Semibold | 28–36pt |
| Key number / stat callout | Calibre or Calibre Light | 36–110pt |
| Body text | Calibre | 10–14pt |
| Footnote / label | Calibre Light | 8–10pt |

### Notes on Font Variants
- **Calibre Bold** does not appear in the template — use `Calibre Semibold` instead
- **Calibre Italic** is available but not explicitly named in the template XML
- Arial appears as a system fallback only — do not use intentionally in deliverables
- Financier Display is for display/quote use only, not body text or data labels

---

## Color Palette

### Primary Brand Colors

| Name | Hex | Use |
|------|-----|-----|
| Primary Green | `#003F2D` | Primary brand color, slide backgrounds, headers |
| Accent Green | `#17E88F` | CTAs, highlights, accent elements |
| Dark Green | `#012A2D` | Dark backgrounds |
| Dark Grey | `#435254` | Body text on light backgrounds, charts |
| Light Grey | `#CAD1D3` | Borders, dividers, subtle backgrounds |

### Secondary Colors

| Name | Hex | Use |
|------|-----|-----|
| Midnight | `#032842` | Dark accent backgrounds |
| Sage | `#538184` | Supporting color, links |
| Celadon | `#80BBAD` | Charts, data visualization |
| Wheat | `#DBD99A` | Warm accent, data visualization |
| Cement | `#7F8480` | Muted text, secondary labels |

### Secondary Tints

| Name | Hex |
|------|-----|
| Midnight Tint | `#778F9C` |
| Sage Tint | `#96B3B6` |
| Celadon Tint | `#C0D4CB` |
| Wheat Tint | `#EFECD2` |
| Cement Tint | `#CBCDCB` |

### Data Visualization Palette (use in order)

| # | Name | Hex |
|---|------|-----|
| 1 | Celadon | `#80BBAD` |
| 2 | Dark Grey | `#435254` |
| 3 | Accent Green | `#17E88F` |
| 4 | Wheat | `#DBD99A` |
| 5 | Data Orange | `#D2785A` |
| 6 | Data Purple | `#885073` |
| 7 | Data Lt. Purple | `#A388BF` |
| 8 | Data Blue | `#1F3765` |
| 9 | Data Lt. Blue | `#3E7CA6` |
| 10 | Light Grey | `#CAD1D3` |

### Special / Status Colors

| Name | Hex | Use |
|------|-----|-----|
| Negative Value Red | `#AD2A2A` | Negative metrics, alerts |
| DataViz Background | `#F6F6F6` | Chart backgrounds (20% Lt. Grey) |
| White | `#FFFFFF` | Light slide backgrounds, text on dark |

### Theme Slot Colors (PowerPoint internal)

| Slot | Hex | Label |
|------|-----|-------|
| dk1 | `#435254` | Dark text |
| lt1 | `#FFFFFF` | Light / white |
| dk2 | `#DBD99A` | Wheat (secondary dark) |
| lt2 | `#80BBAD` | Celadon (secondary light) |
| accent1 | `#1F3765` | Navy Blue |
| accent2 | `#3E7CA6` | Medium Blue |
| accent3 | `#CAD1D3` | Light Grey |
| accent4 | `#96B3B6` | Sage Tint |
| accent5 | `#7F8481` | Cement |
| accent6 | `#003F2D` | Primary Green |

---

## Slide Layouts

The template includes 35 named layouts across these categories:

| Category | Layouts |
|----------|---------|
| **Title slides** | Text title, Title + image 01, Title + image 02 |
| **Agenda** | Agenda |
| **Divider slides** | Text only, Image + Text, Speaker names, Subdivider |
| **Content slides** | 1 Column, 2 Column, 3 Column, 1 Column light/dark, Horizontal light/dark, 2/3/4 image comparison |
| **Statement slides** | Image and text 01–04, Text placeholder 01–03 |
| **Key Numbers** | Key Numbers, Number and text 01–06 |
| **Special** | Executive summary, Thank you, Full screen dataviz |

---

## Design System for Web Tools

When generating web-based outputs (HTML, exported reports) to match CBRE brand:

```css
/* Font stack — use web-safe fallbacks when Calibre is unavailable */
--font-heading: 'Calibre', 'Gill Sans', 'Trebuchet MS', sans-serif;
--font-body: 'Calibre', 'Gill Sans', 'Trebuchet MS', sans-serif;
--font-display: 'Financier Display', Georgia, 'Times New Roman', serif;
--font-mono: 'Space Mono', 'Courier New', monospace;

/* Core palette */
--color-primary: #003F2D;
--color-accent: #17E88F;
--color-dark-green: #012A2D;
--color-dark-grey: #435254;
--color-light-grey: #CAD1D3;
--color-white: #FFFFFF;

/* Data viz (use in order) */
--dv-1: #80BBAD;
--dv-2: #435254;
--dv-3: #17E88F;
--dv-4: #DBD99A;
--dv-5: #D2785A;
--dv-6: #885073;
```

---

## PPTX Export Guidance

When generating `.pptx` files from this platform:

1. **Set the theme font scheme** to major=`Financier Display`, minor=`Calibre`
2. **Slide dimensions**: 12192000 × 6858000 EMU (widescreen 16:9)
3. **Title slides**: dark green background (`#003F2D`), white text, CBRE logo top-right
4. **Content slides**: white background, dark grey body text (`#435254`)
5. **Headings**: Calibre Semibold, 28–36pt, Primary Green or Dark Grey
6. **Quotes / statements**: Financier Display, 44pt, max 3 lines
7. **Data labels**: Calibre Light, 9–10pt
8. **Negative values in charts**: always use `#AD2A2A` (Negative Value Red)
9. **Chart backgrounds**: `#F6F6F6` (DataViz Background)
