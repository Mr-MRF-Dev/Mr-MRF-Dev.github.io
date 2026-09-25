# Projects data

`projects.json` drives the **Projects** section on the homepage. Edit it directly — no build step, no code changes needed. The site re-reads this file on every page load.

## Fields

| Field         | Type    | Required | Notes                                                                 |
| ------------- | ------- | -------- | ---------------------------------------------------------------------- |
| `name`        | string  | yes      | Card title.                                                            |
| `description` | string  | yes      | Short blurb. Gets clamped to a few lines on smaller cards.             |
| `image`       | string  | yes      | Preview image URL. Use a real screenshot for the best look.            |
| `liveUrl`     | string  | no       | Link to a live demo. Leave `""` if there isn't one.                    |
| `repoUrl`     | string  | yes      | Link to the source code.                                               |
| `language`    | string  | no       | Used to pick an emoji badge (see `LANGUAGE_EMOJIS` in `assets/js/script.js`). Leave `""` if not applicable. |
| `stars`       | number  | no       | Shown as a ⭐ badge. Defaults to `0` if omitted.                        |
| `tags`        | array   | no       | Short tech-stack labels shown as pills.                                |
| `size`        | string  | no       | Grid size: `"1x1"`, `"2x1"`, `"1x2"`, or `"2x2"`. Defaults to `"1x1"`. |
| `featured`    | boolean | no       | Shows a small "Featured" badge on the card.                            |

## Sizing the grid

The layout is a 4-column "bento" grid on desktop:

- `1x1` — a square tile.
- `2x1` — twice as wide, same height.
- `1x2` — twice as tall, same width.
- `2x2` — a large feature tile (twice as wide and tall).

On tablets, the grid drops to 2 columns; on phones, everything becomes a single column and every card renders at the same size regardless of `size`, so mobile always stays clean and readable.

Order in the JSON array is the order cards are placed into the grid (the grid uses `dense` packing, so smaller tiles will fill gaps left by larger ones automatically).

## Adding a project

Copy an existing entry, update the fields, and save. There's no cap on how many projects you can list, but keeping it to your best/most representative work usually makes for a stronger "Selected work" section than showing everything.
