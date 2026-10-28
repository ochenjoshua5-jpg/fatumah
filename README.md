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

### It is always locked again when the tab closes

The unlock is **never written to `localStorage`**. It lives in `sessionStorage`, which the
browser destroys when the tab, window or installed app closes. On top of that:

| Situation | Behaviour |
|---|---|
| Close the tab, open the site again | **Locked.** Session is gone. |
| New tab or new window | **Locked.** Sessions do not travel. |
| Browser restores the tab (“continue where you left off”) | **Locked.** A heartbeat is written every 20 s while the page is alive; a revived tab comes back with a stale one (> 90 s) and locks on sight. |
| Back/forward cache brings the page back | **Locked** (`pageshow` → re-check). |
| Hidden for more than **15 minutes** | **Locked** on return. |
| A session older than **8 hours** | **Locked**, even mid-use. |
| ☰ → **Lock the closet** | **Locked immediately**, session wiped. |
| A forged session token, or `localStorage {"gate":true}` | **Locked.** Neither is accepted. |
| Someone taps buttons behind the door | **Nothing happens** — every action is refused without a live session. |

The unlocked state is a runtime fact only. `persist()` explicitly strips it before writing
anything to disk, so there is nothing stored to tamper with.

### Where the right answer is stored

In a real database, not in the file: **Supabase project `nawwkhgsipmcjumbimpy`**.

- `public.closet_keys` holds all four songs and their fingerprints. **RLS is on with no
  policies, and `SELECT` is revoked**, so the browser role is refused outright
  (`42501 permission denied for table closet_keys` — verified).
- The only thing the browser can do is call `public.closet_unlock(attempt)`, a
  `security definer` function that answers **true or false**. It never reveals the answer
  or any row.
- `public.lock_attempts` quietly records every try, so you can open the dashboard and see
  if somebody was poking at the door. She cannot read it.
- Exactly one row may be the answer — there is a partial unique index enforcing that, so you
  cannot accidentally create two keys.

So the password genuinely is stored, properly, server-side, and the browser can only ask a
yes/no question about the song it already guessed.

**If she is offline**, the check falls back to the fingerprint embedded in the file. That is
still a verification, not a bypass — the wrong songs still fail — and it keeps the app
usable on a plane or in a bad network.

### The honest part

This is a genuinely strict front door for a browser app. It stops a curious sibling, a
shared laptop, or someone who picks up her phone in about eight seconds, and it re-arms
itself every single time the tab closes.

It is **not** server-side authentication and cannot be: the code runs on her device.
Two things are worth knowing:

- With only four choices, a determined person with devtools can call the function four times
  and learn the answer. No client-side gate can prevent that. The lockout makes it slow and
  obvious (and you will see it in `lock_attempts`), but it is not a secret from a hacker.
- **If you want real privacy, use Netlify password protection**, and keep her photos out of
  a public repo — any file in this repo is reachable by URL even when the page is locked.

### Changing the song (one day she'll have a new favourite)

In the Supabase SQL editor:

```sql
select public.fnv1a('new-song-id' || 'kc-2026-fatumah-9f3a');   -- 1. the number
update public.closet_keys set is_answer = (song_id = 'new-song-id');  -- 2. the flag
```

Then in `index.html`: update the `songs` array, set `LOCK.digest` to the number from step 1,
and change `LOCK.hint` to something only she would follow. Bump `CACHE` in `sw.js` and
redeploy. Test with ☰ → **Lock the closet**.

### Door settings

At the top of the script:

```js
const LOCK={
  salt:'kc-2026-fatumah-9f3a',
  digest:4282841718,
  tiers:{3:30,4:120,5:600},        // wrong try → cooldown in seconds (survives a reload)
  sessionMax:8*60*60*1000,         // a session can never outlive this
  idleLock:15*60*1000,             // lock after this long hidden
  hint:'The one you play when you miss me.'
};
```

## Connecting Supabase (already done)

The project is live: **`https://nawwkhgsipmcjumbimpy.supabase.co`**, and the URL plus the
publishable anon key are already in `CONFIG.supabase`, so her notes and the door both work
out of the box.

| What | Where | Who can touch it |
|---|---|---|
| The right song (hashed) | `closet_keys` | nobody but the function |
| Yes/no check | `closet_unlock(text)` | anyone with the link, returns a boolean only |
| Door attempts | `lock_attempts` | insert only; you read it in the dashboard |
| Her notes | `notes` | she can read and add; **nobody can edit or delete** |

**The anon key is public by design** — it ships in the HTML and that is normal for Supabase.
Row-level security is the lock, not the key. Never paste the `service_role` or `sb_secret_…`
key into this repo; it bypasses every policy.

**Watching what she writes:** Supabase dashboard → Table editor → `notes`.
Optionally add a **Database Webhook** (Database → Webhooks → INSERT on `notes`) to email
yourself each one, and you will never miss a note.

**If you ever rebuild the database from scratch**, run `supabase/schema.sql`. It is exactly
what is deployed, it is safe to run twice, and it includes the one-answer-only index.

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
