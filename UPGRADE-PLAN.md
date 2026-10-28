# Fatumah's Closet — How to Make It 10× Better

> A review of the actual code, plus the 15 upgrades that will matter most to a 19-year-old girl — and the 3 things that are quietly broken right now.

**What you already have (and it's genuinely good):** a single-file, offline-capable dress-up game with 5 worlds, 80+ SVG garments, makeup/hair/skin customization, a real scoring engine (completeness + cohesion + accessories + harmony + a deterministic "sparkle" hash), a Love Notes jar that unlocks every 3 looks, a Look Book, PNG export, keyboard easter eggs, and a typed opening letter. That's a better gift than 99% of people make.

**The honest diagnosis:** the *engineering* is already at ~9/10. What's at ~3/10 is the part she actually feels — **how personal it is, how it reaches her, and how alive it stays after week one.** Almost every upgrade below is an emotional upgrade, not a technical one. You don't need more code. You need more *her*.

---

## First: 3 things that are actually broken

These aren't ideas. These are bugs you should fix before you add a single feature.

### 1. The link preview is blank (the most important screen you own)

These files are referenced but **do not exist in the repo**:

| Referenced in | File | Used for |
|---|---|---|
| `index.html` | `og-image.png` (1200×630) | The card shown when you paste the link into WhatsApp |
| `index.html` | `apple-touch-icon.png` (180×180) | Home-screen icon on iPhone |
| `index.html` | `favicon-32.png`, `favicon-16.png` | Browser tab |
| `manifest.webmanifest` + `sw.js` | `icon-192.png`, `icon-512.png` | Android install icon |
| `manifest.webmanifest` | `icon-192-maskable.png`, `icon-512-maskable.png` | Android adaptive icon |

When you send this to her on WhatsApp — which is how this gift will actually arrive — the preview is a **grey empty box with a broken-image icon**. That is the first thing she sees of the thing you spent weeks on. Fix this first. It's 20 minutes.

**And it breaks offline mode too:** `sw.js` installs with `caches.addAll(ASSETS)`, and `addAll` rejects the whole batch if *any* URL 404s. So the service worker never installs, and the "offline support via PWA" in your README doesn't actually work. Add the real icons and it starts working.

### 2. She will never see your updates (stale cache)

`sw.js` hardcodes `const CACHE = 'fatumahs-closet-v1'` and serves cached HTML. If you rewrite the letter next month, her phone keeps serving the old one — forever, silently. Either bump the cache name on every change (`v2`, `v3`, …) or, better, make HTML network-first:

```js
// in sw.js — always try the network for the page, fall back to cache offline
if (e.request.mode === 'navigate') {
  e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
  return;
}
```
Also set `lastmod` in `sitemap.xml` to a real date — it says `2025-01-01`.

### 3. It's public, indexed, and has her name on it

You have `robots.txt: Allow /`, a submitted `sitemap.xml`, a Google Search Console verification file, and `robots: index, follow`. So a page titled "Fatumah's Closet", with her first name, her skin tone, her hair, a love letter, and (if you add photos) pictures of her — is a public, Googleable web page.

She's 19. That deserves a decision, not an accident. Add this and mean it:

```html
<meta name="robots" content="noindex, nofollow">
```
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
```
Then delete the sitemap + verification file, and for real privacy use Netlify password protection (paid) or a soft client-side gate keyed to a date only you two know. If you ever add her photos, **ask her first** and never commit them to a public repo.

---

## The 15 upgrades

Ranked by *emotional return per hour of work*. Effort: **S** = under an hour, **M** = an evening, **L** = a weekend.

### Tier 1 — Make it about *her*, not about a game (do these first)

#### 1. Fill in every `CONFIG` field — you built the personalization and left it empty **(S · huge)**

Line 17 of `index.html` is the whole gift's soul, and it's mostly blank:

```js
const CONFIG={herName:'Fatumah',hisName:'Joshua',hisFullName:'Joshua Ochen',nickname:'',skinTone:'#75452f',hairStyle:'box braids',hairColor:'#201a1b',favoriteColors:['#FFB6C1','#E6CCFF'],herInitial:'F',insideJokes:[],specialDate:'',extraLoveNote:'',musicOnByDefault:false};
```

`nickname`, `insideJokes`, `specialDate`, and `extraLoveNote` are `''`/`[]`, so four working features are doing nothing:

```js
const CONFIG = {
  nickname: '[what you actually call her — not her name]',
  specialDate: '2025-03-14',        // YYYY-MM-DD → powers "Day 214 with you"
  insideJokes: [                    // shows up in the rotating toasts (first 5)
    '[the matatu story]',
    '[the thing she always says]',
    '[the meal you always argue about]',
  ],
  extraLoveNote: '[a line only she would understand]',
  musicOnByDefault: false,   // keep sound off until she opts in
};
```

`specialDate` alone turns the Love Notes jar into a day counter. That's a one-line change that makes her feel *tracked-in-a-good-way*. Do this today, before anything else.

#### 2. Record a real voice note and put it inside the app **(S · huge)**

This is the single most romantic thing you can add, and it costs you 60 seconds of courage. Text can be re-read; your actual voice saying her name cannot be faked and cannot be reread without your accent, your hesitation, your laugh. Nobody forgets the first time someone's voice says "I made this for you."

Put it on the letter screen and lock a second one behind the final note:

```html
<audio id="vn" src="./voice/for-her.mp3" preload="none"></audio>
<button class="gold" data-act="voice">▶ A voice note from me</button>
```
```js
// in the existing document click handler, alongside the other data-act branches
else if (a === 'voice') {
  const el = document.getElementById('vn');
  el.paused ? el.play() : el.pause();
}
```

Rules: under 60 seconds, mono, 64–96 kbps MP3 (~500 KB), `preload="none"` so it never eats her data by accident, and **never autoplay** — she may open this in a lecture hall or next to her mum.

#### 3. Rewrite the letter as a real letter — and add "open when you're sad" **(S · huge)**

Right now `renderLetter()` types out five generic lines ("I'm not the best at words, but I built you something instead"). It's sweet, but it's the template's voice, not yours. This is the one place on the site where **your** writing belongs. Keep it short (a letter she finishes in 40 seconds), keep it specific (name one ordinary Tuesday you remember), and end with a promise rather than a compliment.

Then add a second envelope that's **always** available, no grinding required:

- **"Open when it's a heavy day"** — a note that doesn't try to fix anything, just says you're on her side. No score, no unlock requirement, one tap from the home screen.
- **"Open when you've finished everything"** — the real final letter, revealed only at 100 / all 5 worlds.

That gives the app three emotional registers instead of one, and it means the gift still works on her worst day — which is when a gift actually matters.

#### 4. Build an "Our moments" polaroid wall **(M · high)**

The love notes are text. Add 6–10 photos: her, you two, the place you met, the food you always get, a terrible selfie you both love. Render as slightly-rotated polaroids with tape, a handwritten caption, and the date.

```js
const moments = [
  { src: './moments/01.webp', caption: '[the caption only you two get]', date: 'Mar 2025' },
];
```
```js
`<div class="polaroid" style="--r:${(i % 3) - 1}deg">
   <img src="${m.src}" loading="lazy" alt="${esc(m.caption)}">
   <span>${esc(m.caption)}</span><small>${m.date}</small>
 </div>`
```

This is the thing she'll screenshot and send back to you. Compress to WebP, 1000px wide, ~100 KB each — she may be on mobile data. Unlock it after 5 looks so it feels earned; **get her consent before putting her face on a website.**

#### 5. Modest mode, and hair that's actually hers **(M · huge if it applies)**

I don't know her, so I'll say it carefully: **Fatumah is a Muslim name**, and a 19-year-old in Kampala may well wear hijab. If she does, then a dress-up game where every top is a camisole and every skirt is a mini isn't a game about her — it's a game about somebody else. That's the opposite of romantic.

Add a `saved.modest` toggle that re-renders the same catalogue modestly: camisoles become long-sleeve, minis become maxi, sheer layers become opaque, necklines rise. In `garment()` you already branch on `item.kind` — this is a handful of extra paths, not a rewrite. Then add a `headscarf` slot with 5–6 styles (draped, pinned, turban, under-cap) and long modest layers.

**Ask her first.** "Do you want more covered options, or do you want the fun stuff?" is itself a romantic question — it says you see her. And independently of that: the hair list is `box braids, soft curls, sleek bob, high ponytail, space buns, long waves, pixie, low bun`, with only *box braids* as a protective style. Add **knotless braids, twists, cornrows, Bantu knots, an afro, a headwrap, a bonnet** — and make sure the 4C textures get their own silhouettes instead of straight-hair shapes recoloured brown. Representation is the cheapest, highest-impact "romance" feature that exists.

---

### Tier 2 — Make it feel alive and hers

#### 6. A sixth world made for her: **"Kampala Muse"** **(L · high)**

The five existing worlds are global internet aesthetics (coquette, Y2K, downtown, angelcore, clean girl). Beautiful — and none of them are hers. A world built from *her* culture, done with love rather than as costume, is the thing she'll show her friends:

- **Gomesi** with its sash and pointed sleeves, a **kitenge/ankara** wrap dress with real print geometry (SVG triangles, dots, and diamond repeats — you already draw patterns procedurally, so this is genuinely in reach), a **kanzu-style** long layer, **gele/headwrap** silhouettes, **beaded waist beads and layered gold**, **beaded sandals**.
- Palette from a real Ugandan evening: hibiscus, laterite red, sun-bleached gold, deep green, Lake Victoria blue.
- Names in her register: *"Entebbe sunset"*, *"Auntie's gomesi"*, *"Sunday best"*, *"Kampala heat"*.

⚠️ One technical trap: `world === 5` is hardcoded as the **special/fave pseudo-world** in `score()`, `wear()`, `studio()`, and the `perfect` check, and `saved.worlds.length === 5` gates the unlock. If you insert a real 6th world at index 5, you'll collide with all of that. Refactor first:

```js
const FAVE_WORLD = 5;                       // rename, then append new worlds at 6+
if (item.world === FAVE_WORLD && !saved.unlocked) return;
```
Also update `x>=0&&x<5` in the `saved.worlds` filter and `saved.worlds.length === 5`.

#### 7. A note-a-day, a day counter, and a streak that never shames her **(M · high)**

Right now the notes are finite: 13 of them, then it's over. A gift that runs out is a gift that dies. Make it renewable:

```js
const dayNumber = Math.floor(Date.now() / 864e5);
const noteOfDay = dailyNotes[dayNumber % dailyNotes.length];   // new every day, no server
```

Write 30–60 short notes (2 lines max) and she gets a fresh one every single morning she opens it. Pair it with:
- **"Day N with you"** from `CONFIG.specialDate` (already coded — just needs the date).
- A **streak counter** (`saved.streak`, `saved.lastVisit`) with copy that can only ever be warm: *"4 days in a row. I like that you keep coming back."* Never "you lost your streak." Guilt has no place in a gift.
- **Scheduled unlocks**: a note that only appears on her birthday and your anniversary, matched client-side on `MM-DD`.

#### 8. Make the share card good — because she *will* share it **(M · high)**

`exportLook()` / `makePNG()` already produce a PNG. Upgrade it into something worth posting:
- Offer **two ratios**: 1080×1350 (feed) and 1080×1920 (WhatsApp Status / Stories).
- Put her name, the world name, the Glam Score, and a small *"made by Joshua, for Fatumah"* line on the card.
- Use the real share sheet when available, with a download fallback:

```js
if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text });
```
- Add **"Send this look to Joshua"** → `https://wa.me/256XXXXXXXXX?text=...` prefilled with the score and a line she can edit. She taps once and you get a message. That loop is what makes it a thing you two *do together* instead of a thing you gave her once.

#### 9. Fix the audio, and add touch **(M · high)**

The current sound is `tone()` playing sine beeps and a wandering 12-note arpeggio. It's charming for 20 seconds and thin after that. Keep the WebAudio fallback for offline, but add:
- **A soft, licensed instrumental loop per world** (find royalty-free/CC0 — credit it; don't rip an Afrobeats track, it's both illegal and embarrassing if she recognises the artist you didn't pay).
- **A volume slider + persisted mute**, and **never autoplay** (`musicOnByDefault` is currently `false` — leave it that way and let her choose).
- **Haptics**: `navigator.vibrate?.(8)` on each garment tap, a longer pattern on confetti. Tiny, and it makes the whole thing feel expensive on a cheap Android.
- Keep `prefers-reduced-motion` honored — you already do this well in `spark()`/`flash`; don't regress it.

#### 10. The "fate" mechanic you already have — make it a feature **(S–M · high polish)**

`score()` computes `sparkle = hash(canonical) % 7 - 3`: the exact same look always scores exactly the same, forever, on any phone. That's a lovely, hidden piece of design — it means **you and she can style the same outfit and get the same number**, like a shared secret. Lean into it:
- **"Joshua's pick"**: pre-save your favourite look, then show *"how close is she to your taste?"* — a warm percentage, never a grade.
- **"Perfect match"** celebration when her look is byte-identical to yours. Name it something only you two would get.
- Show `sparkle` as **"Fate +2"** instead of a nameless number in the breakdown. It's currently the most magical line in the code and it's labelled "Sparkle".

---

### Tier 3 — Depth, play, and a reason to come back in March

#### 11. Achievements and a sticker book **(M · high)**

`saved` already has `worlds`, `count`, `opened`, `book`. Add `badges: []` and check conditions in `serve()`: *all 5 worlds styled*, *first 100*, *10 looks*, *found the secret*, *rewore a saved look*, *played at 2am*. Unlock a note, a photo, or a hidden item with each. A sticker sheet is an excuse to keep opening the app, and it costs you almost nothing — the scoring data is already there.

#### 12. Dress-him-up / couple matching **(L · fun)**

A tiny second figure (or simply a "his look" preset you styled yourself), then a **couple score** for coordination: *"Your skirt and his jacket are the same terracotta. Obvious."* This is the feature she'll screenshot and send to her friends. It also turns the app from *a game about her* into *a game about you two*, which is the actual point.

#### 13. Let her write back **(S–M · high)**

Right now it's a one-way broadcast. Add a box: *"Leave me something."* No accounts, no backend:

```js
const msg = `A note from ${her}: ${text}`;
location.href = `https://wa.me/256XXXXXXXXX?text=${encodeURIComponent(msg)}`;
```

Or, if you want it to land in your inbox, **Netlify Forms** works on a static site for free (one `<form data-netlify="true">`, plus a hidden `form-name` field). Her words reaching you is worth more than any feature on this list — and it's a 15-line change.

#### 14. Secrets, done properly **(M · delight)**

You already have the mechanics: typing `JOSHUA` or `FATUMAH` fires `egg()`, 7 taps on the title fires one, 5 taps on the footer heart fires one. Extend that:
- A **date-code vault** — her birth date or your anniversary as a 4-digit keypad — opening an "only us" room with the rawest letter and the photo she hasn't seen.
- One hidden item in every world (tap the moon, the record sleeve, the cloud).
- A real **final screen** for 100% that says something you'd never post publicly.

The only rule: **give one hint.** A hidden thing nobody finds is just an unfinished feature. Put a line in the letter: *"There's a word you can type. You already know it."*

#### 15. Keep it alive without breaking it **(S · ongoing — and this is the real answer)**

The graveyard of romantic tech gifts is full of beautiful things that stopped changing on week two. The mechanism matters more than any feature:

- **A monthly ritual, 10 minutes:** add one note, one photo, one line to the letter. That's it. The app stays true because you keep touching it.
- **A `WHATS-NEW` chip** on the home screen so she *notices* something changed (otherwise: pointless).
- **Bump `CACHE` in `sw.js` every single time** you deploy, or she'll keep seeing the old version and think you stopped.
- **Test like it's her phone, not yours:** a cheap Android on 3G, iPhone Safari, and incognito with `localStorage` disabled (your `memory` fallback is a nice touch — verify it works). Keep the page under ~150 KB + lazily loaded images. Data costs money; a 12 MB gift is a small insult.
- **Don't break it on her birthday.** Deploy at least a week before any date that matters, then freeze it.

---

## Taste rules (what separates romantic from cringe)

1. **Specific beats poetic.** "I still think about you refusing to share your chips" hits harder than any sentence with "eternity" in it.
2. **Short.** Three lines she finishes beat three paragraphs she skips. The letter is currently ~5 lines — that length is right; the *words* are what need to change.
3. **Reveal slowly.** The app's best instinct is that things unlock. Never dump everything on day one.
4. **Score the outfit, never the love.** Glam Score is about clothes. The moment there's a "love score" or a "how much she cares" metric, it stops being a gift and starts being a test.
5. **No obligation mechanics.** No missed-day guilt, no streak loss, no "come back or else." She should feel wanted, not scheduled.
6. **Her taste over your fantasy.** More skin tones, more hair, more body silhouettes, more modest options — never fewer. If she says "add this," add it even if it's not your aesthetic.
7. **Celebrate her culture; don't costume it.** Gomesi and kitenge rendered with real care and real print geometry = love. A "tribal" print slapped on a mini skirt = a screenshot she sends to her group chat with a *different* kind of laugh. And if you use Luganda — *Nkwagala* (I love you), *Mukwano gwange* (my love), *Weebale* (thank you) — **have a fluent speaker check your spelling and tone**, ideally her or her family. Wrong Luganda in a love letter is worse than English.
8. **Privacy is romance.** A private letter is intimate. A Googleable one is a liability. See "broken #3."
9. **Don't make it homework.** If a feature needs a tutorial, cut it or hide it. Every screen should be playable by someone who's tired.
10. **The app's job isn't to show off your code — it's to make her feel seen.** The final question for every addition: *does this tell her something true about how you see her?* If not, it's decoration.

---

## Ship order (two weekends)

**Weekend 1 — "she can feel it" (≈4 hours)**
1. Fix the 7 missing icons/images + `og-image.png` (broken #1) — 30 min
2. `noindex` + privacy decision (broken #3) — 15 min
3. Fill every `CONFIG` field (item 1) — 20 min
4. Rewrite the letter in your own voice + "open when it's a heavy day" (item 3) — 90 min
5. Record and wire one voice note (item 2) — 30 min
6. WhatsApp share/"send to Joshua" link (item 8, quick version) — 45 min
7. Deploy, then test on an actual phone, in incognito, on mobile data

**Weekend 2 — "she can come back" (≈6 hours)**
8. Note-a-day + streak + day counter (item 7) — 2 h
9. Photo wall with 6 compressed images (item 4) — 2 h
10. Modest mode **or** hair expansion, whichever she asks for (item 5) — 2 h

**Then, monthly:** one note, one photo, bump `CACHE`, redeploy. **Every few months:** a new world (item 6) or the couple-matching mode (item 12).

---

## The delivery matters as much as the build

No one remembers a link. They remember the moment they got it.

- Don't drop it in a group chat. Send it when she's alone and can react properly.
- Pair it with a voice note: *"Don't open the link until you're somewhere comfortable."* Anticipation is most of romance.
- Tell her **one** secret exists, not what it is. *"Try typing a name."*
- Ask her what she wants in it, and then actually add it. The third version of this app — the one shaped by her requests — will be the one she loves, not the first one you were proud of.
- And put a date in the notes jar. The day counter is the only feature that gets more valuable every single day.

---

*Written after reading all 156 lines of `index.html`, `sw.js`, `manifest.webmanifest`, and `netlify.toml`. Everything above is grounded in what's actually in the file — including the three bugs.*
