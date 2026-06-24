# Product QR URL Converter

Static utility for turning a Glovo web product URL into a QR-friendly browser
landing URL and a branded downloadable QR PNG.

## What it does

- Validates Glovo product URLs that include `productId` and `externalProductId`.
- Generates a browser-preserving `open.html?u=...` landing URL for QR codes.
- Creates a branded QR PNG with company name, product or campaign label, SKU or
  batch note, center badge, custom colors, and selectable export size.
- Includes the QR generation library locally in `vendor/qrcode.min.js`, so the
  tool does not depend on a live CDN at runtime.

## Files

- `index.html` - paste a Glovo product URL, customize the brand kit, and export the QR.
- `app.js` - validates/parses the Glovo URL, builds converted URLs, renders the branded QR, and downloads PNG files.
- `open.html` - browser-preserving landing page for QR codes.
- `open.js` - validates the target URL, auto-navigates with `window.location.replace()`, and provides an HTML GET form fallback.
- `styles.css` - shared styling and responsive layout.
- `vendor/qrcode.min.js` - bundled browser build of `qrcode@1.5.3`.
- `vendor/qrcode.LICENSE.txt` - MIT license for the bundled QR library.

## Recommended QR Output

Use the generated `open.html?u=...` URL for QR codes. It keeps the first hop on
your own landing page, then navigates to the exact Glovo web product in the
browser and provides a one-tap form fallback.

Do not use normal anchors or HTTP redirects as the primary flow; emulator
testing showed those hand Android to the Glovo app store page.

## Brand Controls

Companies can use the brand kit fields to create unique QR codes for products,
brands, shelves, events, or campaigns. The QR payload stays the same converted
landing URL; the brand name, product text, badge, and colors only affect the
visual PNG that gets downloaded.
