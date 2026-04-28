# QuickQR

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-darkgreen?style=flat-square&logo=vue.js&color=4FC08D" alt="Vue">
  <img src="https://img.shields.io/badge/Vite-7-purple?style=flat-square&logo=vite&color=646CFF" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript&color=3178C6" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.2-blue?style=flat-square&logo=tailwindcss&color=06B6D4" alt="Tailwind">
</p>

<p align="center">
  <strong>Modern QR Code Generator with Custom Styling</strong>
</p>

<p align="center">
  Create beautiful, customized QR codes with advanced styling options including dot patterns, colors, gradients, and logo overlays.
</p>

---

## Features

### QR Code Customization
- **Dot Styles** — Square, rounded, dots, classy, and classy rounded patterns
- **Custom Colors** — Set dot color and background color
- **Gradients** — Support for gradient fills on dots
- **Logo Overlays** — Add images or logos to the center of QR codes
- **Error Correction** — Four levels (L, M, Q, H) for different use cases
- **Size Control** — Adjustable width, height, and margin

### Export Options
- **PNG Download** — Raster export for general use
- **SVG Download** — Vector export for print and scaling

### Tech Stack
| Category | Technology |
|----------|------------|
| **Framework** | [Vue 3](https://vuejs.org) with Composition API |
| **Build Tool** | [Vite](https://vitejs.dev) — Fast dev server and optimized builds |
| **Language** | [TypeScript](https://typescriptlang.org) — Type safety |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) — Utility-first CSS |
| **QR Generation** | `qr-code-styling` — Advanced QR customization |
| **Testing** | [Vitest](https://vitest.dev) — Unit testing |
| **Icons** | `lucide-vue-next` — Consistent icon set |

---

## Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/mintychochip/quickqr.git
cd quickqr

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Project Structure

```
quickqr/
├── src/
│   ├── components/         # Vue components
│   │   ├── QRCodeMetaBuilder.vue    # Main QR builder UI
│   │   ├── NavigationBar.vue        # App navigation
│   │   └── QuickQRFooter.vue        # App footer
│   ├── container/          # Business logic containers
│   │   └── qrcode/         # QR code configuration
│   │       ├── color_type.ts
│   │       ├── dot_style_type.ts
│   │       ├── gradient.ts
│   │       └── options.ts
│   ├── repository/         # Data layer
│   │   ├── models.ts       # Data models
│   │   └── userRepository.ts
│   ├── router/             # Vue Router configuration
│   ├── __tests__/          # Unit tests
│   ├── App.vue             # Root component
│   └── main.ts             # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

---

## QR Code Configuration

### Dot Styles
| Style | Description |
|-------|-------------|
| `square` | Classic square dots |
| `rounded` | Rounded corners on squares |
| `dots` | Circular dots |
| `classy` | Elegant diamond-like shape |
| `classy-rounded` | Rounded elegant shape |

### Error Correction Levels
| Level | Recovery Capacity | Use Case |
|-------|-------------------|----------|
| **L (Low)** | ~7% | Clean environments, maximum data |
| **M (Medium)** | ~15% | General purpose |
| **Q (Quartile)** | ~25% | Some logo overlap, dirty environments |
| **H (High)** | ~30% | Heavy logo overlap, rough environments |

### Image Overlay Tips
- Use error correction level **Q** or **H** when adding logos
- Keep logo size under 30% of QR code for reliable scanning
- Use transparent PNG images for best results
- Ensure sufficient contrast between logo and QR code

---

## Testing

The project uses Vitest for unit testing. Tests cover:
- QR code generation logic
- Color handling and validation
- Configuration options

```bash
# Run all tests once
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run with coverage
npm run test -- --coverage
```

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

## Related Projects

- [quickqr-frontend](https://github.com/mintychochip/quickqr-frontend) — Full-featured Astro/React version with cloud storage, analytics, and advanced features

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  Built with <a href="https://vuejs.org">Vue</a> by mintychochip
</p>
