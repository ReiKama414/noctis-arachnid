# NOCTIS ARACHNID

[English](./README.md) · **繁體中文**

> 互動式 **維多利亞哥德時鐘蜘蛛展演** — 程序化 Three.js 幾何，搭配羊皮紙工程手稿介面

<p align="center">
  <a href="https://github.com/ReiKama414/noctis-arachnid">Star</a>
  ·
  <a href="https://reikama414.github.io/noctis-arachnid/">線上展示</a>
  ·
  <a href="https://reikama414.vercel.app/">個人網站</a>
  ·
  <a href="#快速開始">快速開始</a>
  ·
  <a href="#license--授權">授權（MIT）</a>
</p>

---

## 為什麼做

工程圖通常停在紙上。這個展演讓藍圖動起來：環繞自動機、打開甲殼、爆炸拆解，並匯出你看到的畫面

---

## 亮點

- **程序化蜘蛛** — 八隻四軸關節腿、觀測尖塔、鉸接甲殼瓣，以及十四齒輪時鐘核心
- **手稿舞台** — 羊皮紙版面：規格、致動器、即時正投影與標註針腳
- **步態與狀態** — Idle、Walk、Threat、Clockwork、Inspection
- **材質色盤** — Default Black & Gold、Blood Glass、Obsidian、Ivory
- **爆炸視圖** — 0–100% 連續拆解甲殼、光學、肢體與裝甲
- **封存匯出** — 高解析 PNG、透明 PNG、二進位 `.glb`、材質 `.json`
- **兩種啟動** — Vite React 專案，或直接開啟 standalone HTML（免建置）

---

## 技術棧

| 層級 | 選用 |
| --- | --- |
| UI | React 18 · TypeScript · Vite |
| 3D | Three.js · OrbitControls · GLTFExporter |
| 動態 | GSAP |
| 主題 | 自訂 CSS（維多利亞工程手稿） |

---

## 快速開始

需要 Node.js 20 或更新，以及支援 WebGL 的瀏覽器

### 方式 A — Standalone（不需伺服器）

用 Chrome、Edge、Firefox 或 Safari 開啟 [`standalone/noctis_arachnid_exhibit.html`](./standalone/noctis_arachnid_exhibit.html)

### 方式 B — 開發伺服器

```bash
npm install
npm run dev
```

開啟 Vite 印出的網址（預設 [http://localhost:5173](http://localhost:5173/)）

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 開發伺服器（HMR） |
| `npm run build` | 型別檢查並輸出正式包到 `dist/` |
| `npm run preview` | 預覽正式建置 |

---

## 操作

| 區塊 | 可做的事 |
| --- | --- |
| 相機仰角 | Reset、Isometric、Front、Side、Rear、Top |
| 自動機步態 | Idle · Walk · Threat · Clockwork · Inspection |
| 機械致動 | 甲殼、齒輪、光學、顎、刀刃、緋紅照明、活塞、毒液脈衝 |
| 材質變體 | 四組可選色盤 |
| 細節預設 | 光學、時鐘、腿關節、隱藏武器、甲殼 |
| 爆炸視圖 | 滑桿，以及 0% / 45% / 100% 預設 |
| 元件檢查器 | 點標註針腳 → 讀說明 → 隔離網格 |
| 正投影面板 | 即時 Front / Side / Top / Rear |

---

## 專案結構

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

## 第三方說明

執行期函式庫（React、Three.js、GSAP、Vite 與相關套件）各自保留 `node_modules/` 內的授權。本倉庫自有原始碼依下方 MIT 授權

展演 CSS 載入的 Google Fonts（`Tenor Sans`、`Source Sans 3`、`JetBrains Mono`）適用各字型自身授權

---

## 連結

| | |
| --- | --- |
| 倉庫 | [ReiKama414/noctis-arachnid](https://github.com/ReiKama414/noctis-arachnid) |
| 線上展示 | [reikama414.github.io/noctis-arachnid](https://reikama414.github.io/noctis-arachnid/) |
| 個人網站 | [reikama414.vercel.app](https://reikama414.vercel.app/) |
| 作者 | [ReiKama414](https://github.com/ReiKama414)（Myers） |

---

## License / 授權

**本專案以 [MIT License](./LICENSE) 釋出。**

Copyright (c) 2025 ReiKama414

在遵守授權條款的前提下，你可以自由使用、複製、修改、合併、發布、散布、再授權與販售本軟體

- [GitHub](https://github.com/ReiKama414/noctis-arachnid)
- [個人網站](https://reikama414.vercel.app/)
- [授權全文](./LICENSE)

---

<sub>NOCTIS ARACHNID · ReiKama414 · MIT</sub>
