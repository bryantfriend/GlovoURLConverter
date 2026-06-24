(function () {
  function getEndpoint() {
    return String(window.QR_ANALYTICS_CONFIG?.endpoint || "").trim();
  }

  function compactPayload(payload) {
    return {
      linkId: payload.linkId || "",
      companyId: payload.companyId || "",
      brand: payload.brand || "",
      label: payload.label || "",
      code: payload.code || "",
      targetUrl: payload.targetUrl || "",
      productId: payload.productId || "",
      externalProductId: payload.externalProductId || "",
      landingPath: payload.landingPath || window.location.pathname,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent || "",
      timestamp: new Date().toISOString(),
    };
  }

  function trackClick(payload) {
    const endpoint = getEndpoint();
    if (!endpoint) {
      return Promise.resolve(false);
    }

    const body = JSON.stringify(compactPayload(payload || {}));

    try {
      if (navigator.sendBeacon) {
        const sent = navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
        if (sent) return Promise.resolve(true);
      }
    } catch (error) {
      // Fall through to fetch.
    }

    return fetch(endpoint, {
      method: "POST",
      mode: "cors",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body,
    }).then(() => true).catch(() => false);
  }

  window.QRAnalytics = { trackClick };
})();
