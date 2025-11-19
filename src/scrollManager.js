// src/scrollManager.js
export function disableScroll() {
  document.body.style.overflow = 'hidden';
}

export function enableScroll() {
  document.body.style.overflow = 'auto';
}

// 🔹 Activer le scroll uniquement sur HubJeux
if (window.location.pathname === '/hubjeux','/quete') {
  enableScroll(); // scroll activé
} else {
  disableScroll(); // scroll bloqué
}
