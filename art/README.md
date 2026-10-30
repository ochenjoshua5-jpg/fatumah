# The muse photograph

`her-muse.jpg` is the photograph in the big arch on the home screen;
`her-muse-face.jpg` is the square close-up inside the little gold locket
at the bottom of the arch. Swap them any time — the game never needs a
code change.

## The slot, exactly

| | |
|---|---|
| Frame | 3:4 portrait (the arch is 420 × 560 px on desktop) |
| Export | **800 × 1067 px**, JPEG, quality ~82, under ~250 KB |
| Better source | 1600 × 2133 px or larger, portrait orientation |
| Face | head in the **top third**, clear of the arch curve. Full-length is welcome |
| Bottom | leave room for the caption, the locket and the floating cards |
| Locket | `her-muse-face.jpg`, **260 × 260 px** square, her face filling it |
| Avoid | text, watermarks, logos, busy edges, harsh blue/green casts |

The site is cream, blush and gold, so warm pink / magenta / peach light
sits best. The current photo keeps its hot-pink neon and is framed in
gold-pink, so a bold colour is fine — just keep the highlights warm.

## Where to search (free, safe to use)

- **Unsplash** — <https://unsplash.com/s/photos/doll?orientation=portrait&color=pink>
- **Pexels** — <https://www.pexels.com/search/doll/?orientation=portrait>
- **Pixabay** — <https://pixabay.com/images/search/doll%20portrait/>
- **Burst** — <https://burst.shopify.com/photos/search?q=mannequin>
- **Kaboompics / StockSnap / Reshot** — smaller, softer, editorial

Paid, if you want something no one else has: Adobe Stock, iStock,
Shutterstock — search the same phrases and filter *portrait*.

## Search phrases that actually return the right look

The winning pattern is **subject + light + mood**:

1. `fashion doll portrait neon pink`
2. `barbie doll portrait pink background`
3. `black fashion doll portrait` · `doll with afro pink background`
4. `doll photoshoot editorial` · `designer doll portrait`
5. `pink neon beauty portrait` (real model — reads more grown-up)
6. `coquette doll aesthetic` · `y2k barbie aesthetic portrait`
7. `mannequin fashion portrait studio`
8. `vintage mannequin head pink light`

Add the filters the site offers: **portrait orientation**, **colour =
pink / magenta**, and sort by newest or most relevant.

## Three ways to get a better one than stock

1. **Follow the shoot, not the photo.** Open one you like and tap
   *More like this*, then browse the photographer's profile — the same
   session usually has other crops, angles and light. (The earlier muse
   came from <https://unsplash.com/photos/a-person-with-pink-hair-wu4UtPdcYb8>.)
2. **Reverse image search.** Put the current photo into Google Lens or
   TinEye and look for the larger, sharper versions of the same look.
3. **Shoot it yourself.** A black fashion doll, a phone in portrait mode,
   a pink LED strip and a piece of glass or acrylic gives you a one-off
   image that actually looks like her. Ten minutes, no licence worries.

## If you generate one instead

Prompt shape: *editorial photograph of a fashion doll with deep brown
skin and box braids, floral dress, neon pink studio light, magenta bokeh,
85 mm, shallow depth of field, portrait 3:4, no text*. Generate at 3:4,
then crop to the face-in-the-upper-third rule above.

## Replacing it

1. Drop the new file in this folder as `art/her-muse.jpg` (overwrite), **or**
2. Put it anywhere and point `heroPhoto` at it in `CONFIG`:

```js
heroPhoto:'./art/my-new-photo.jpg',      // '' brings back the drawn her
heroFace:'./art/my-new-photo-face.jpg',  // '' hides the gold locket
```

The current doll is a full-length shot, so the face crop is taken from
the same photo: crop a square around her head, about **220 × 220 px** of
the source, then export at 260 × 260.

Keep the old file until the new one looks right — the service worker
caches whichever path `heroPhoto` names.
