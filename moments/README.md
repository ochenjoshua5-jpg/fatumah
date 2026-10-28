# Put your photos here

Each photo should be **WebP or JPG, ~1000px wide, under 150 KB** — she may be on mobile data.

```
moments/01.webp
moments/02.webp
...
```

Then edit the `moments` array in `index.html`:

```js
moments:[
  {src:'./moments/01.webp', caption:'the day this started',     date:'Mar 2025'},
  {src:'./moments/02.webp', caption:'that walk that took too long', date:'Jun 2025'},
  ...
]
```

Leave `src:''` and the app draws a soft illustration instead, using the `art` key
(`first-hello`, `walk`, `food`, `call`, `laugh`, `future`, `heart`).

**Ask her before you put her face on a website.** That is the whole rule.
