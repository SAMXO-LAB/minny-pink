# Minny's Birthday World 💗

An interactive, romantic birthday website — Next.js 14 · React 18 · TypeScript · Tailwind CSS · Framer Motion.
Minny is an illustrated, fully animated SVG avatar with curly hair (no image files needed).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
# production:
npm run build && npm start
```

Needs Node 18.17+ (tested on Node 22).

## Make it hers — 3 places

| What | Where |
| --- | --- |
| Birthday + anniversary dates, the two album/romance passwords, optional own song | `src/lib/config.ts` |
| All the words: letter, cards, surprise boxes, truth/dare, wheels, and the photo/clip list | `src/lib/content.ts` |
| Photos, clips, songs | `public/photos`, `public/videos`, `public/audio` |

The site plays `/audio/perfect.mp3` as its music (and in "Play Our Movie"); `love-note.mp3` is the little audio card in the album.
The photos and clips here were rotated upright from the originals (they were saved sideways).

## Letters From Everyone (guestbook)
Anyone can write a letter; reading them needs the password (server-checked, default `120403`).
Letters are stored in **Upstash Redis**:

1. On Vercel: Storage → add *Upstash for Redis* (injects `KV_REST_API_URL` / `KV_REST_API_TOKEN`).
   Elsewhere: create a free Upstash database and copy `.env.example` → `.env.local`.
2. Optional: set `GUESTBOOK_READ_PASSWORD` to change the reading password.

Without Redis the site works; sending/reading letters just shows a friendly "not connected" message.

> The album and romance-wheel passwords in `config.ts` are checked in the browser — they keep casual visitors out, not determined ones.

### Own music
Put an mp3 in `public/audio/` and set `musicSrc` in `config.ts` (empty = generated dreamy music box).
Music never autoplays — she taps the 🎵 button.

## Test links
- `/?preview=birthday` → shows the "It's Minny's Birthday!" celebration
- `/?date=2026-10-08` → pretend her birthday is that date

## Structure
```
src/
  app/                 layout, page, global styles
  lib/                 config.ts, content.ts, music engine, helpers
  components/
    MinnyAvatar.tsx     animated avatar + mood system (idle/happy/shy/excited/surprised/love/celebrate)
    AvatarProvider.tsx shared mood + "night" scene state (useAvatar().react("happy"))
    Landing, BirthdayHero, Countdown, BirthdayCake, MemoryCards, SurpriseBoxes,
    WhyTimeline, Games (HeartGame, MemoryGame, SpinWheel, PromptWheel, TruthOrDare), SecretMessage,
    MemoriesAlbum (lock, lightbox, movie), Guestbook (+ app/api/letters), FinalSurprise, Navigation, MusicPlayer, CursorFX,
    ParticleBackground, FloatingHearts, FxLayer (confetti/hearts/petals canvas)
```

## Performance & accessibility
Canvas particles with pre-rendered sprites, GPU transforms, lazy images, fewer particles on phones/low-end
devices, `prefers-reduced-motion` respected (static background, no bounce/typing animation), keyboard-friendly
modals, custom cursor only on desktop mice.
