// src/quests/questSystem.js
/**
 * questSystem.js
 * ----------------
 * Gestion des quêtes côté frontend (persistant par joueur via localStorage).
 * Fournit :
 *  - loadPlayer / savePlayer
 *  - initQuestsIfNeeded(ALL_QUESTS_CATALOG)
 *  - updateQuestProgress(questId, amount)
 *  - completeQuest(questId)
 *  - resetQuestForGame(questId), updateQuestForGame(questId), validateQuestForGame(questId)
 *  - addXP(amount)
 *
 * NOTE : Ce système stocke tout dans localStorage sous "playerData".
 * Pour la version production, tu peux remplacer la persistence par des appels backend.
 */

const STORAGE_KEY = "playerData_v1"; // change la clé si tu modifies le format

// --- PLAYER LOADING / SAVING ---
export function loadPlayer() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = {
      xp: 0,
      level: 1,
      quetes: {}, // { questId: {id, progression, progressionMax, statut, recompenseXP} }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    // si corrupted, reset proprement
    const initial = { xp: 0, level: 1, quetes: {} };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function savePlayer(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- INIT QUI POPULE LES QUÊTES À PARTIR DU CATALOGUE ---
export function initQuestsIfNeeded(ALL_QUESTS_CATALOG) {
  const player = loadPlayer();
  if (player && player.quetes && Object.keys(player.quetes).length > 0) {
    // déjà initialisé
    return;
  }

  const quetes = {};
  ALL_QUESTS_CATALOG.forEach((game) => {
    game.categories.forEach((cat) => {
      cat.niveaux.forEach((q) => {
        quetes[q.id] = {
          id: q.id,
          progression: q.progression || 0,
          progressionMax: q.progressionMax ?? (typeof q.progression === "number" ? 100 : (q.progressionMax || 100)),
          statut: q.progression >= (q.progressionMax ?? 100) ? "terminee" : "en_cours",
          recompenseXP: q.recompenseXP ?? parseXPString(q.recompense) ?? 0,
        };
      });
    });
  });

  player.quetes = quetes;
  savePlayer(player);
}

// helper to convert "5 XP" -> 5 (if user used old format)
function parseXPString(s) {
  if (!s) return null;
  if (typeof s === "number") return s;
  const m = String(s).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// --- XP / LEVEL MANAGEMENT ---
export function addXP(amount) {
  const player = loadPlayer();
  player.xp = (player.xp || 0) + amount;

  // système simple : leveling grows with level * 100
  while (player.xp >= player.level * 100) {
    player.xp -= player.level * 100;
    player.level = (player.level || 1) + 1;
  }

  savePlayer(player);
}

// --- PROGRESSION / COMPLETION ---
export function updateQuestProgress(questId, amount = 1) {
  const player = loadPlayer();
  const q = player.quetes?.[questId];
  if (!q || q.statut === "terminee") return false;

  q.progression = Math.min((q.progression || 0) + amount, q.progressionMax);
  if (q.progression >= q.progressionMax) {
    q.progression = q.progressionMax;
    q.statut = "terminee";
    addXP(q.recompenseXP || 0);
  }
  savePlayer(player);
  return true;
}

export function completeQuest(questId) {
  const player = loadPlayer();
  const q = player.quetes?.[questId];
  if (!q || q.statut === "terminee") return false;

  q.progression = q.progressionMax;
  q.statut = "terminee";
  addXP(q.recompenseXP || 0);
  savePlayer(player);
  return true;
}

// --- QUETES "PAR GAME" (usage : reset en début de partie, update pendant la partie, validate fin de partie) ---
export function resetQuestForGame(questId) {
  const player = loadPlayer();
  const q = player.quetes?.[questId];
  if (!q || q.statut === "terminee") return false;
  q.progression = 0;
  savePlayer(player);
  return true;
}

export function updateQuestForGame(questId, amount = 1) {
  // identique à updateQuestProgress sauf qu'on ne donne pas XP automatiquement ici
  const player = loadPlayer();
  const q = player.quetes?.[questId];
  if (!q || q.statut === "terminee") return false;
  q.progression = Math.min((q.progression || 0) + amount, q.progressionMax);
  savePlayer(player);
  return true;
}

export function validateQuestForGame(questId) {
  const player = loadPlayer();
  const q = player.quetes?.[questId];
  if (!q || q.statut === "terminee") return false;

  if (q.progression >= q.progressionMax) {
    q.statut = "terminee";
    q.progression = q.progressionMax;
    addXP(q.recompenseXP || 0);
  } else {
    // non complétée dans la partie -> reset (comportement choisi)
    q.progression = 0;
  }
  savePlayer(player);
  return true;
}

// --- UTILITAIRES DE LECTURE ---
export function getAllPlayerData() {
  return loadPlayer();
}

export function getQuest(questId) {
  const player = loadPlayer();
  return player.quetes?.[questId] ?? null;
}

export function getPlayerXP() {
  const player = loadPlayer();
  return { xp: player.xp || 0, level: player.level || 1 };
}
