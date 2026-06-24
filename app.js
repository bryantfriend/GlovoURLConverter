(function () {
  const sampleUrl = "https://glovoapp.com/en/kg/bishkek/stores/glovo-express-bsk?content=hleb-vypechka-sc.42969216%2Fsvezhiy-hleb-c.42969150&productId=4611686018602341182&externalProductId=470010";

  const sourceUrl = document.getElementById("sourceUrl");
  const convertButton = document.getElementById("convertButton");
  const sampleButton = document.getElementById("sampleButton");
  const clearButton = document.getElementById("clearButton");
  const results = document.getElementById("results");
  const landingUrl = document.getElementById("landingUrl");
  const trailingDotUrl = document.getElementById("trailingDotUrl");
  const statusCard = document.getElementById("statusCard");
  const statusText = document.getElementById("statusText");
  const qrCanvas = document.getElementById("qrCanvas");
  const qrWarning = document.getElementById("qrWarning");
  const downloadQrButton = document.getElementById("downloadQrButton");
  const copyQrUrlButton = document.getElementById("copyQrUrlButton");

  const fields = {
    storeSlug: document.getElementById("storeSlug"),
    productId: document.getElementById("productId"),
    externalProductId: document.getElementById("externalProductId"),
    contentPath: document.getElementById("contentPath"),
  };

  function setStatus(message, isError) {
    statusText.textContent = message;
    statusCard.classList.toggle("error", Boolean(isError));
  }

  function parseGlovoUrl(rawValue) {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      throw new Error("Paste a Glovo product URL first.");
    }

    let url;
    try {
      url = new URL(trimmed);
    } catch (error) {
      throw new Error("That does not look like a valid URL.");
    }

    const normalizedHost = url.hostname.replace(/\.$/, "").toLowerCase();
    if (normalizedHost !== "glovoapp.com" && normalizedHost !== "www.glovoapp.com") {
      throw new Error("This converter expects a glovoapp.com product URL.");
    }

    const productId = url.searchParams.get("productId");
    const externalProductId = url.searchParams.get("externalProductId");
    if (!productId || !externalProductId) {
      throw new Error("The URL needs productId and externalProductId parameters.");
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    const storesIndex = pathParts.indexOf("stores");
    const storeSlug = storesIndex >= 0 ? pathParts[storesIndex + 1] : "";
    if (!storeSlug) {
      throw new Error("Could not find the store slug in this Glovo URL.");
    }

    return {
      url,
      canonical: canonicalizeGlovoUrl(url),
      storeSlug,
      productId,
      externalProductId,
      content: url.searchParams.get("content") || "",
    };
  }

  function canonicalizeGlovoUrl(url) {
    const canonical = new URL(url.href);
    canonical.protocol = "https:";
    canonical.hostname = "glovoapp.com";
    return canonical.href;
  }

  function buildTrailingDotUrl(canonicalUrl) {
    const url = new URL(canonicalUrl);
    url.hostname = "glovoapp.com.";
    return url.href;
  }

  function buildLandingUrl(canonicalUrl) {
    const openUrl = new URL("open.html", window.location.href);
    openUrl.searchParams.set("u", canonicalUrl);
    return openUrl.href;
  }

  function drawQrCode(value) {
    const context = qrCanvas.getContext("2d");
    context.clearRect(0, 0, qrCanvas.width, qrCanvas.height);

    if (!window.QRCode || typeof window.QRCode.toCanvas !== "function") {
      qrWarning.hidden = false;
      context.fillStyle = "#fff";
      context.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
      context.fillStyle = "#1f2a24";
      context.font = "16px sans-serif";
      context.textAlign = "center";
      context.fillText("QR library not loaded", qrCanvas.width / 2, qrCanvas.height / 2);
      return;
    }

    qrWarning.hidden = true;
    window.QRCode.toCanvas(qrCanvas, value, {
      width: 260,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#1f2a24",
        light: "#ffffff",
      },
    }, (error) => {
      if (error) {
        qrWarning.hidden = false;
        setStatus("Could not generate QR", true);
      }
    });
  }

  function downloadQrCode() {
    if (!landingUrl.value) {
      return;
    }

    const productId = fields.productId.textContent && fields.productId.textContent !== "-"
      ? fields.productId.textContent
      : "glovo-product";
    const link = document.createElement("a");
    link.download = `oako-glovo-qr-${productId}.png`;
    link.href = qrCanvas.toDataURL("image/png");
    link.click();
    setStatus("QR downloaded", false);
  }

  function convert() {
    try {
      const parsed = parseGlovoUrl(sourceUrl.value);
      landingUrl.value = buildLandingUrl(parsed.canonical);
      trailingDotUrl.value = buildTrailingDotUrl(parsed.canonical);

      fields.storeSlug.textContent = parsed.storeSlug;
      fields.productId.textContent = parsed.productId;
      fields.externalProductId.textContent = parsed.externalProductId;
      fields.contentPath.textContent = parsed.content || "-";

      results.hidden = false;
      drawQrCode(landingUrl.value);
      setStatus("Converted", false);
    } catch (error) {
      results.hidden = true;
      setStatus(error.message, true);
    }
  }

  async function copyValue(targetId) {
    const target = document.getElementById(targetId);
    if (!target || !target.value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(target.value);
      setStatus("Copied", false);
    } catch (error) {
      target.select();
      document.execCommand("copy");
      setStatus("Copied", false);
    }
  }

  convertButton.addEventListener("click", convert);
  sampleButton.addEventListener("click", () => {
    sourceUrl.value = sampleUrl;
    convert();
  });
  clearButton.addEventListener("click", () => {
    sourceUrl.value = "";
    results.hidden = true;
    setStatus("Ready", false);
    sourceUrl.focus();
  });
  downloadQrButton.addEventListener("click", downloadQrCode);
  copyQrUrlButton.addEventListener("click", () => copyValue("landingUrl"));

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => copyValue(button.dataset.copyTarget));
  });

  sourceUrl.addEventListener("input", () => {
    if (sourceUrl.value.trim()) {
      setStatus("Ready to convert", false);
    } else {
      setStatus("Ready", false);
    }
  });

  window.addEventListener("load", () => {
    if (!results.hidden && landingUrl.value) {
      drawQrCode(landingUrl.value);
    }
  });
})();

