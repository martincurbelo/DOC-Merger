# DOC Merger

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Web-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Premium Document Merger for PDFs and Images**

Combine multiple PDFs and images (JPG, PNG) into a single, beautifully formatted PDF document.

</div>

---

## ✨ Features

- 📄 **PDF Support** - Merge multiple PDF files while preserving their original pages
- 🖼️ **Image Support** - Convert JPG and PNG images to PDF pages automatically
- 📐 **Smart Sizing** - Images are centered on A4 pages with proper aspect ratio
- 🔀 **Drag & Drop** - Easily add files by dragging them into the app
- ↕️ **Reorder Files** - Drag items to reorder them before merging
- 💾 **Save Anywhere** - Choose your save location with the native file picker
- 🎨 **Premium UI** - Beautiful glassmorphism design with smooth animations

## 🖥️ Screenshots

The app features a modern, minimalist interface with a glass-effect card design.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/martincurbelo/DOC-Merger.git
cd DOC-Merger
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
# Start the web version
npm run dev

# In another terminal, start Electron
npx electron .
```

### Build for Production

#### Windows Installer
```bash
npm run build
npx electron-builder --win
```
The installer will be created in the `release/` folder.

#### Web Version
```bash
npm run build
```
Static files will be in the `dist/` folder.

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Desktop**: Electron
- **PDF Processing**: pdf-lib
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: Lucide React
- **Styling**: Custom CSS with Glassmorphism

## 📁 Project Structure

```
DOC-Merger/
├── electron/           # Electron main process
│   └── main.js
├── src/
│   ├── components/     # React components
│   │   ├── DropZone.jsx
│   │   └── FileList.jsx
│   ├── utils/          # Utility functions
│   │   └── pdfHelpers.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── package.json
└── vite.config.mjs
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Made with ❤️ by [Antigravity](https://github.com/martincurbelo)
