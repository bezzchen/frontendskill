# Asset kit licences — Thornmere demo fixture

Every file here is legitimately redistributable in a public repository. Verified 2026-08-30.

## HDRI (image-based lighting)

| file | source | licence | size |
|---|---|---|---|
| `studio_small_09_1k.hdr` | [Poly Haven](https://polyhaven.com/a/studio_small_09), author Sergej Majboroda | **CC0 1.0** — no attribution required, redistribution explicitly permitted | 1.58 MB |

Note, verified independently by MD5 (`d5d7eb9d26d341d6aa4d11c1a54fd97c`): this file is
**byte-identical to the environment map shipped by Santioni Spirits**
(`santionispirits.com/assets/images/studio-szvyqmM3.hdr`), an Active Theory production. The
lighting environment used by a world-class WebGL studio is a free CC0 1k file, unmodified.

## Botanical plates (the page's subject matter)

All from *Köhler's Medizinal-Pflanzen* (Franz Eugen Köhler, 1887), via Wikimedia Commons.
**Public domain** — published 1887, author died 1904; PD in the US and in countries with
life+70 terms. Licence field confirmed "Public domain" on each Commons record.

| file | plant | plate | size |
|---|---|---|---|
| `botanicals/juniper.jpg` | *Juniperus communis* | 082 | 196 KB |
| `botanicals/coriander.jpg` | *Coriandrum sativum* | 193 | 164 KB |
| `botanicals/angelica.jpg` | *Angelica archangelica* | 158 | 120 KB |
| `botanicals/orris.jpg` | *Iris germanica florentina* | 078 | 168 KB |
| `botanicals/lemon.jpg` | *Citrus × limon* | 041 | 120 KB |

## Typography

Not bundled as files: Google Fonts (**SIL OFL 1.1**) are delivered at build time via
`next/font`, self-hosted in the build output. Bundling, self-hosting and commercial use are all
permitted under OFL.

## Deliberately excluded, and why

- **Sketchfab CC0 models** — the Store has closed and CC0/CC-BY-SA/NC/ND models cannot migrate to
  Fab; download access is time-limited. Unsafe foundation for a public repo.
- **Freesound / OpenGameArt** — mixed licences including CC-BY-NC (kills commercial use) and
  CC-BY-SA (viral, hostile to a permissive repo).
- **Any typeface used by the reference sites** — Articulat CF, PP Nikkei Maru, GT Era, Charles
  Rosie, Aktiv Grotesk, Neue Haas Grotesk, ABC Diatype are all commercial and none may be bundled.
- **Music of any kind.** One surveyed site ships a chart-pop and game-soundtrack library with
  filenames reading "from YouTube to MP3 Converter". Not a model to copy.
- **Photographs of identifiable people** — Unsplash/Pexels carry no model releases.

## Brand

**Thornmere** is a fictional distillery invented for this demo. No real company, branding, or
byline is used or imitated. Name checked against existing brands before use.
