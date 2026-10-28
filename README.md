# Fatumah’s Closet ♡

A little world, styled by her. Six dreamy worlds, a full wardrobe, a jar of love notes,
a wall of memories, and a place to write back — made by hand, with a very full heart.

**Live:** https://fatumahzcloset.netlify.app/
**Privacy:** not indexed (noindex + X-Robots-Tag). It is a private gift, not a search result.

---

## What is in here

| File / folder | What it is |
|---|---|
| `index.html` | The whole game. Single file, no build step, no dependencies. |
| `sw.js` | Service worker — network-first for the page (so new letters always arrive), cache-first for art. |
| `manifest.webmanifest` | Makes it installable on her home screen. |
| `netlify.toml` | Headers, caching, and the `noindex` rule. |
| `og-image.png` + icons | The link preview card and home-screen icons. **These were missing before — the WhatsApp preview used to be blank.** |
| `voice/` | Drop your voice note here (see `voice/README.md`). |
| `moments/` | Drop your photos here (see `moments/README.md`). |
| `supabase/schema.sql` | One-time setup so her notes reach you. |
| `UPGRADE-PLAN.md` | The original review: what was broken, and the 15 upgrades. Everything in it is now built. |

---

## The one thing you should edit

Everything personal lives in `CONFIG` at the top of the `<script>` in `index.html`.
Nothing else needs touching.

```js
const CONFIG={
  herName:'Fatumah',
  hisName:'Joshua',
  hisFullName:'Joshua Ochen',
  herInitial:'F',
  nickname:'',            // ← what you actually call her. blank = her name

  skinTone:'#75452f',
  hairStyle:'box braids',
  hairColor:'#201a1b',
  favoriteColors:['#FFB6C1','#E6CCFF'],

  specialDate:'',         // ← 'YYYY-MM-DD' → powers "Day 214 with you"
  birthday:'',            // ← 'MM-DD' → unlocks her birthday letter
  insideJokes:[],         // ← up to 5 lines. they appear as gentle toasts
  extraLoveNote:'',       // ← one more note in the jar

  voiceNote:'',           // ← './voice/for-her.mp3'
  whatsapp:'',            // ← your number, digits only: '2567XXXXXXXX'
  moments:[...],          // ← photos + captions

  supabase:{url:'',anonKey:''},   // ← optional, see below
  musicOnByDefault:false,
  modestDefault:false
};
```

Fill `nickname`, `specialDate`, `birthday`, `insideJokes`, `extraLoveNote` first —
those five empty strings were doing nothing before, and they are the difference
between "a website" and "a website for her".

---

## What she can do

**Six worlds** — Coquette Cloud, Y2K Rewind, Downtown Girl, Angelcore Heaven,
Clean Girl Streetwear and **Kampala Muse** (gomesi, kitenge, abaya, gele, silk headwrap,
soft hijab, kitenge maxi, Ankara kimono, cowrie gold).

**Her, not a template** — 10 skin tones, 14 hairstyles (box braids, knotless braids,
passion twists, cornrows, afro, bantu knots, headwrap, silk press, bob, ponytail, space buns,
waves, pixie, low bun), 12 hair colours, 6 eye colours, makeup, lashes, glitter, gems,
and a soft/quiet face toggle.

**Makeup presets** — Everyday, Soft Glam, Golden Hour, one tap each.

**Modest wardrobe** — a toggle that hides the shorter, sheerer pieces. Nothing is deleted,
and she can turn it off whenever. Off by default; set `modestDefault:true` if it should start on.

**The Glam Score** — completeness, world cohesion, accessories, harmony, plus a hidden
*Fate* number that is derived from a hash of the look. Same look = same score, forever,
on any phone. That means you two can style an identical outfit and get an identical
number, like a shared secret.

**His heart %** — a warm, generous number. It is never a test of anything real.

**The love notes jar** — 16 sealed notes that open every 3 served looks, plus:

- **Open when it is a heavy day** — always available, no unlocking, no dressing up
- **Open when you miss me** — always available
- **Open on your birthday** — appears only on the day you set
- **Open when you have seen everything** — for the very end

**A note a day** — 48 short notes, date-seeded, changes at midnight, never repeats in a month.
No streaks to lose, no guilt, ever.

**Our moments** — a polaroid wall with soft illustrations now, real photos when you add them.

**A sticker book** — 12 little wins. Nothing lost, nothing timed, nothing to fail.

**Write to me** — she can leave you a note. Saved on her phone always, and delivered to
your inbox/table if you connect Supabase.

**Secrets** — type a name on any screen, tap the footer heart five times, or find the
four-digit door in the menu. The letter itself gives one honest hint.

**Save & share** — saves to the Look Book and exports a proper 1080×1350 (or 1080×1920 story)
card with her name, the world, the score and a made-by-you line.

---

## The door — a song is the key

Before anything loads, she has to name the song that is yours. Four choices, one right answer:

| Song | Artist | Right? |
|---|---|---|
| Please Please Please | Sabrina Carpenter | ✗ |
| Rich Flex | Drake & 21 Savage | ✗ |
| Knife Talk | Drake & 21 Savage | ✗ |
| **These Walls** | **Dua Lipa** | **✓** |

Nothing opens until she picks it — no letter, no closet, not one pixel of it.

**Why it cannot be guessed or bypassed from the screen**

- The correct answer is **not written anywhere** in the file. Only a fingerprint is stored
  (`LOCK.digest`), and each tap is hashed and compared. Reading the source tells you nothing.
- **Three wrong taps** and the door rests for 30 seconds. A fourth → 2 minutes. A fifth → 10 minutes.
  The countdown survives a reload, and the buttons are genuinely disabled while it runs.
- What gets saved on success is a **token**, not `true`. Hand-editing `localStorage` to
  `{"gate":true}` does nothing — you would have to produce the exact token, which you can
  only get by solving the door.
- The screen state, navigation and rendering are all gated, so there is no hidden route in.

The lock screen is deliberately its own world: a dim room, one record spinning, four album
sleeves, and a line that is a hint rather than a giveaway —
*“The one you play when you miss me.”*

### Changing the song (one day she’ll have a new favourite)

1. Edit the `songs` array in `index.html` — title, artist, and a short `key` for the artwork.
2. Generate the new fingerprint. Run this in any terminal:

```bash
node -e "const h=s=>{let x=2166136261;const t=s+'kc-2026-fatumah-9f3a';for(let i=0;i<t.length;i++)x=Math.imul(x^t.charCodeAt(i),16777619);console.log(x>>>0)};h('these-walls')"
```

3. Paste the number into `LOCK.digest`. Keep the salt the same, or regenerate both.
4. Change `LOCK.hint` to something only she would follow.
5. Bump `CACHE` in `sw.js` and redeploy.

Press **Lock the closet** in the ☰ menu to test it again without clearing your data.

### Be honest with yourself about what this is

This is a beautiful, genuinely strict *front door* for a browser app — it stops a curious
sibling or a shared laptop in about eight seconds flat. It is **not** server-side
authentication, and it cannot be: the code runs on her device, so someone technical with
devtools can always get in. Two consequences worth knowing:

- If you want real privacy, put the whole site behind **Netlify password protection**, and
  keep her photos out of a public repo (they are visible by URL even if the page is locked).
- Do not reuse this pattern for anything that actually holds secrets, money or health data.

## Connecting Supabase (so her notes reach you)

Without this, her notes still save on her phone — the app just cannot deliver them.
With it, everything she writes lands in your Supabase table and appears in her journal
with a real timestamp.

1. Create a free project at supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, run it.
3. Go to **Project Settings → API** and copy the **Project URL** and the **anon public** key.
4. Paste them into `CONFIG.supabase`:

```js
supabase:{
  url:'https://xxxxxxxxxxxx.supabase.co',
  anonKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

5. Deploy. The journal footer changes to “delivered straight to him”.

**Notes on safety:** the anon key is public by design; the table's row-level security is
what protects you. The schema allows `select` and `insert` for `anon` and revokes
`update`/`delete`, so nobody can rewrite or erase her words. If you want it stricter,
swap the policy for an Edge Function that checks a shared secret — instructions are at the
bottom of `schema.sql`. Optionally add a **Database Webhook** on `INSERT` to email yourself
each note, and you will never miss one.

The site works completely offline. Supabase is the only network call, and it fails soft.

---

## Deploying

Static hosting — Netlify, Vercel, GitHub Pages, anything.

```
publish directory: .        (no build command)
```

If you are on Netlify and connected to this repo, pushing to `main` deploys.

**Every time you change anything, bump the cache name in `sw.js`:**

```js
const CACHE='fatumahs-closet-v4';   // v3 → v4 → v5 …
```

Otherwise her phone keeps serving the old version and thinks you stopped caring.

---

## Before you send it to her

- [ ] Fill in `CONFIG` — at least `nickname`, `specialDate`, `birthday`
- [ ] Record `voice/for-her.mp3` and set `voiceNote`
- [ ] Set `whatsapp` so one tap sends a look to you
- [ ] Add 3–6 real photos to `moments/` (and ask her first)
- [ ] Connect Supabase if you want her notes delivered
- [ ] Open the link on **her kind of phone**, on **mobile data**, in **incognito**
- [ ] Paste the link into WhatsApp and check the preview card shows
- [ ] Turn on airplane mode and reload — it should still open
- [ ] Bump `CACHE` and redeploy one last time

Then send it when she is somewhere comfortable, with a voice note telling her not to
open it until she is settled. Anticipation is most of romance.

---

## Keeping it alive

The graveyard of romantic tech gifts is full of beautiful things that stopped changing on
week two. Ten minutes a month is the whole trick:

- add one note to `notes`
- add one photo to `moments`
- add one line to the letter
- bump `CACHE`, redeploy

---

## Tech

Single-file HTML + vanilla JS + hand-authored SVG. No build step, no framework,
no tracking, no analytics, no accounts. ~157 KB of HTML including everything.
Offline-capable. Works with JavaScript storage disabled (falls back to memory).

By Joshua Ochen — for Fatumah, who deserves the world. 🤍
