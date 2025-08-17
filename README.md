# NOCTIS ARACHNID

**English** · [繁體中文](./README.zh-TW.md)

> An interactive **Victorian Gothic clockwork-spider exhibit** — procedural Three.js geometry on a parchment engineering manuscript UI

<p align="center">
  <a href="https://github.com/ReiKama414/noctis-arachnid">Star</a>
  ·
  <a href="https://reikama414.github.io/noctis-arachnid/">Live demo</a>
  ·
  <a href="https://reikama414.vercel.app/">Portfolio</a>
  ·
  <a href="#quick-start">Quick start</a>
  ·
  <a href="#license">License (MIT)</a>
</p>

---

## Why

Engineering drawings usually sit still on a page. This exhibit keeps the blueprint alive: orbit the automaton, open the carapace, explode the assemblies, and export what you see

---

## Highlights

- **Procedural arachnid** — eight 4-DOF legs, observation spire, hinged carapace petals, and a 14-gear clockwork core
- **Manuscript stage** — parchment layout with specs, actuators, live ortho elevations, and callout pins
- **Gait and state** — Idle, Walk, Threat, Clockwork, and Inspection modes
- **Material palettes** — Default Black & Gold, Blood Glass, Obsidian, Ivory
- **Exploded view** — continuous 0–100% disassembly of petals, optics, limbs, and armor
- **Archive export** — High-Res PNG, Transparent PNG, binary `.glb`, and material `.json`
- **Two launch paths** — Vite React app, or open the standalone HTML with no build step

---

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 18 · TypeScript · Vite |
| 3D | Three.js · OrbitControls · GLTFExporter |
| Motion | GSAP |
| Theme | Custom CSS (Victorian engineering manuscript) |

---

## Quick start

Use Node.js 20 or newer and a browser with WebGL.

### Option A — Standalone (no server)

Open [`standalone/noctis_arachnid_exhibit.html`](./standalone/noctis_arachnid_exhibit.html) in Chrome, Edge, Firefox, or Safari

### Option B — Dev server

```bash
npm install
npm run dev
```

Open the URL Vite prints (default [http://localhost:5173](http://localhost:5173/)).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck and production bundle into `dist/` |
| `npm run preview` | Serve the production build |

---

## Controls

| Area | What you can do |
| --- | --- |
| Camera elevations | Reset, Isometric, Front, Side, Rear, Top |
| Automaton gait | Idle · Walk · Threat · Clockwork · Inspection |
| Mechanical actuators | Abdomen armor, gears, optics, mandibles, blades, crimson light, pistons, venom pulse |
| Material variations | Four selectable palettes |
| Detail presets | Optics, clockwork, leg joint, hidden weapon, carapace |
| Exploded view | Slider plus 0% / 45% / 100% presets |
| Component inspector | Click a callout pin → read metadata → isolate the mesh |
| Ortho panel | Live Front / Side / Top / Rear elevations |

---

## Project structure

```text
noctis-arachnid/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE
├── standalone/
│   └── noctis_arachnid_exhibit.html
├── public/
│   ├── favicon.ico
│   └── favicon.png
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/spider.ts
    ├── materials/materialSystem.ts
    ├── geometry/
    │   ├── proceduralGenerators.ts
    │   └── buildNoctisArachnid.ts
    ├── animations/spiderAnimator.ts
    ├── components/
    │   ├── SpiderViewport.tsx
    │   ├── LeftControlPanel.tsx
    │   ├── TechnicalDrawingsPanel.tsx
    │   ├── BottomExhibitBar.tsx
    │   └── ComponentInspectorModal.tsx
    ├── exporters/exportUtils.ts
    └── styles/exhibit.css
```

---

## Third-party notices

Runtime libraries (React, Three.js, GSAP, Vite, and related packages) keep their own licenses under `node_modules/`. This repository’s own source is MIT as stated below

Google Fonts loaded by the exhibit CSS (`Tenor Sans`, `Source Sans 3`, `JetBrains Mono`) are subject to their respective font licenses

---

## Links

| | |
| --- | --- |
| Repository | [ReiKama414/noctis-arachnid](https://github.com/ReiKama414/noctis-arachnid) |
| Live demo | [reikama414.github.io/noctis-arachnid](https://reikama414.github.io/noctis-arachnid/) |
| Portfolio | [reikama414.vercel.app](https://reikama414.vercel.app/) |
| Author | [ReiKama414](https://github.com/ReiKama414) (Myers) |

---

## License

**This project is released under the [MIT License](./LICENSE).**

Copyright (c) 2025 ReiKama414

You may use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the Software, subject to the conditions in the license file

- [GitHub](https://github.com/ReiKama414/noctis-arachnid)
- [Portfolio](https://reikama414.vercel.app/)
- [Full license text](./LICENSE)

---

<sub>NOCTIS ARACHNID · ReiKama414 · MIT</sub>
