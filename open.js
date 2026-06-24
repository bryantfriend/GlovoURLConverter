(function () {
  const params = new URLSearchParams(window.location.search);
  const encodedTarget = params.get("u");
  const message = document.getElementById("message");
  const fallbackForm = document.getElementById("fallbackForm");

  function fail(text) {
    message.textContent = text;
    fallbackForm.hidden = true;
  }

  if (!encodedTarget) {
    fail("No product URL was provided.");
    return;
  }

  let target;
  try {
    target = new URL(encodedTarget);
  } catch (error) {
    fail("The product URL is invalid.");
    return;
  }

  const normalizedHost = target.hostname.replace(/\.$/, "").toLowerCase();
  if (target.protocol !== "https:" || normalizedHost !== "glovoapp.com") {
    fail("Only https://glovoapp.com product URLs are allowed.");
    return;
  }

  fallbackForm.action = target.origin + target.pathname;
  target.searchParams.forEach((value, key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    fallbackForm.appendChild(input);
  });

  message.textContent = "Opening the exact Glovo web product. Use the button if your browser blocks the automatic navigation.";

  window.setTimeout(() => {
    window.location.replace(target.href);
  }, 350);
})();
