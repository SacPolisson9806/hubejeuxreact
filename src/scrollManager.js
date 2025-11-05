// src/scrollManager.js
export function disableScroll() {
  document.body.style.overflow = 'hidden';
}

export function enableScroll() {
  document.body.style.overflow = 'auto';
}

// Active le scroll bloqué automatiquement
disableScroll();
