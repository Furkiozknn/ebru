# Credits

## Assets

- `assets/mascot/kedi-uyuyor.png`, `assets/mascot/kedi-kutlama.png` and `assets/mascot/kedi-dusunuyor.png`: the white
  Turkish Van kitten mascot of the Claude Game Arena, downscaled to 256 px (ffmpeg, lanczos) from the author's own
  copies in the video studio (`kedi-uyuyor.png`, `kedi-kutlama.png`, `kedi-dusunuyor.png`). The sleeping kitten is a
  billboard sprite on the workshop table; the cheering and thinking poses appear on the lesson result card. All three
  are skipped with `?noassets` (and on `file://`, where WebGL cannot read a local image).

### stil-3d (23.11.2026): chibi 3D look of the song video

The game now uses the stylized 3D chibi characters and workshop of the Ebru song video. All images were made with the
Gemini app (Nano Banana image model, free quota in the author's account), with the video's key frame
(`genis.jpg`, our own FLUX render) uploaded as the style and character reference. Backgrounds were removed locally
(PIL + SciPy, border flood fill on the white ground) and saved as WebP.

- `assets/3d/usta-kagit.webp`, `kedi-uyuyor.webp`, `kedi-kutlama.webp`: Gemini, 2x2 character sheet 1.
- `assets/3d/kedi-dusunuyor.webp`, `usta-selam.webp`, `kedi-bakiyor.webp`: Gemini, 2x2 sheet 2.
- `assets/3d/usta-yuz.webp`, `kedi-yuz.webp`: round face crops of `usta-selam` and `kedi-bakiyor`.
- `assets/3d/arka.webp`: Gemini, the workshop back wall (window, shelves of paint pots, drying sheets), 1792x1000.

The sleeping kitten on the table, the painted back wall, the title / ending card figures, the HUD faces, the master's
note avatar and the result-card kitten use these files. The v2 mascot PNGs in `assets/mascot/` are kept for the README
but no longer loaded by the game. The marbling itself (paint on the water) is still drawn by the simulation.

## Facts

- The "Did you know?" cards quote the UNESCO Representative List entry for ebru:
  https://ich.unesco.org/en/RL/ebru-turkish-art-of-marbling-00644 and the inscription decision
  https://ich.unesco.org/en/decisions/9.COM/10.44.

## Code and libraries

- Three.js r170, loaded from cdn.jsdelivr.net (MIT licence, https://threejs.org/).
- Everything else (the marbling simulation, lessons, workshop models, textures, icons and sounds) is generated in
  `index.html`.
