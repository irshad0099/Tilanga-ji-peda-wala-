// Flies a small round copy of the product photo from `fromEl` (the button
// that was pressed) into the cart icon in the navbar, then bumps the icon.
// The navbar renders one cart link per layout (desktop / phone); whichever
// is on screen carries `data-cart-target` and is visible.
export function flyToCart(fromEl, imageSrc) {
  if (typeof window === "undefined" || !fromEl) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = [...document.querySelectorAll("[data-cart-target]")].find((el) => el.offsetParent !== null);
  if (!target) return;

  const from = fromEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const size = 56;
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const dx = to.left + to.width / 2 - size / 2 - startX;
  const dy = to.top + to.height / 2 - size / 2 - startY;

  const dot = document.createElement("img");
  dot.src = imageSrc;
  dot.alt = "";
  dot.setAttribute("aria-hidden", "true");
  Object.assign(dot.style, {
    position: "fixed",
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "9999px",
    objectFit: "cover",
    border: "3px solid #FFFCEF",
    boxShadow: "0 10px 24px rgba(47,74,29,0.45)",
    zIndex: "200",
    pointerEvents: "none",
  });
  document.body.appendChild(dot);

  // An arc: up first, then down into the cart.
  const lift = Math.min(-80, dy * 0.4 - 80);
  const flight = dot.animate(
    [
      { transform: "translate(0, 0) scale(0.6)", opacity: 0 },
      { transform: "translate(0, -12px) scale(1.1)", opacity: 1, offset: 0.12 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 + lift}px) scale(0.9)`, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.6 },
    ],
    { duration: 850, easing: "cubic-bezier(0.45, 0, 0.3, 1)" }
  );
  flight.onfinish = () => {
    dot.remove();
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.22) rotate(-6deg)" }, { transform: "scale(0.95)" }, { transform: "scale(1)" }],
      { duration: 450, easing: "ease-out" }
    );
  };
  flight.oncancel = () => dot.remove();
}
