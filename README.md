# OAKO Glovo QR URL Converter

Static utility for turning a Glovo web product URL into a QR-friendly OAKO
landing URL.

## Files

- `index.html` - paste a Glovo product URL and generate QR-ready output.
- `app.js` - validates/parses the Glovo URL, builds converted URLs, renders the QR preview, and downloads QR PNG files.
- `open.html` - browser-preserving landing page for QR codes.
- `open.js` - validates the target URL, auto-navigates with
  `window.location.replace()`, and provides an HTML GET form fallback.
- `styles.css` - shared styling.

QR generation uses the browser-side `qrcode` library from jsDelivr.

## Recommended QR Output

Use the generated `open.html?u=...` URL for QR codes. It keeps the first hop on
OAKO, then navigates to the exact Glovo web product in the browser and provides
a one-tap form fallback.

The converter also renders a QR preview and downloads it as a PNG.

Do not use normal anchors or HTTP redirects as the primary flow; emulator
testing showed those hand Android to the Glovo app store page.
