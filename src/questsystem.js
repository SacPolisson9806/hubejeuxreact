// QuestSystem.js

class QuestSystem {
  constructor() {
    this.load();
  }

  // =======================
  // 👉 CHARGEMENT & SAVE
  // =======================
  load() {
    const saved = localStorage.getItem("quest_progress");

    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = {};
      this.save();
    }
  }

  save() {
    localStorage.setItem("quest_progress", JSON.stringify(this.data));
  }

  // =======================
  // 👉 INITIALISATION D'UNE CATÉGORIE
  // =======================
  initCategory(categoryKey, niveaux) {
    if (!this.data[categoryKey]) {
      this.data[categoryKey] = niveaux.map((niv, index) => ({
        id: niv.id,
        progression: 0,
        completed: false,
        active: index === 0, // seule la première quête est active
      }));
      this.save();
    }
  }

  // =======================
  // 👉 AJOUT DE PROGRESSION
  // =======================
  addProgress(categoryKey, questId, amount) {
    const list = this.data[categoryKey];
    if (!list) return;

    const quest = list.find(q => q.id === questId);

    if (!quest || quest.completed || !quest.active) return;

    // Ajouter de la progression
    quest.progression += amount;

    // Atteint l'objectif ?
    const fullQuest = window.ALL_QUESTS[categoryKey].find(q => q.id === questId);

    if (quest.progression >= fullQuest.progressionMax) {
      quest.completed = true;
      quest.progression = fullQuest.progressionMax;

      // Active la quête suivante
      const index = list.indexOf(quest);
      if (list[index + 1]) {
        list[index + 1].active = true;
      }
    }

    this.save();
  }

  // =======================
  // 👉 OBTENIR LA PROGRESSION POUR L’UI
  // =======================
  getCategoryProgress(categoryKey) {
    return this.data[categoryKey] || [];
  }
}

export default new QuestSystem();
