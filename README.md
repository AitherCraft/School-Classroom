# School Hub

`index.html` is the full-screen Continue page. It opens `hub.html` (the game layout) in an about:blank tab.

## Adding a game

1. Make a folder in `games/` with the game's files, with its entry page named `index.html`:
   `games/my-game/index.html`
2. Optionally add a cover image: `games/my-game/thumb.png`
3. Add an entry to `games.json`:

```json
[
  {
    "title": "My Game",
    "path": "games/my-game/index.html",
    "thumb": "games/my-game/thumb.png"
  }
]
```

`thumb` is optional. Without it the card shows the game's first letter. Games must be self-contained HTML5 files (HTML/JS/CSS/assets) and use relative paths.
