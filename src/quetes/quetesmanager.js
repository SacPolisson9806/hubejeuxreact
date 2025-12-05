import { questsData } from "./quetesdata";

class QuestManager {
  constructor() {
    this.load();
  }

  load() {
    const saved = localStorage.getItem("questsProgress");
    this.data = saved ? JSON.parse(saved) : {};
    this.save();
  }

  save() {
    localStorage.setItem("questsProgress", JSON.stringify(this.data));
  }

  initQuestsForPlayer(playerName) {
    if (!this.data[playerName]) {
      this.data[playerName] = {};

      questsData.forEach(game => {
        game.categories.forEach(cat => {
          this.data[playerName][cat.key] = cat.niveaux.map((niv, idx) => ({
            id: niv.id,
            progression: 0,
            objectifValue: isNaN(parseInt(niv.objectif)) ? 1 : parseInt(niv.objectif), // objectif numérique si possible
            completed: false,
            active: idx === 0,
          }));
        });
      });

      this.save();
    }
  }

  // 🔹 Fonction générique pour ajouter de la progression
  addProgress(playerName, categoryKey, questId, amount = 1) {
    const playerData = this.data[playerName];
    if (!playerData) return;

    const category = playerData[categoryKey];
    if (!category) return;

    const quest = category.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    const questInfo = questsData
      .flatMap(g => g.categories)
      .find(c => c.key === categoryKey)
      .niveaux.find(n => n.id === questId);

    // 🔹 Incrément dynamique
    quest.progression += amount;

    // 🔹 Détection si la quête est accomplie
    const objectif = quest.objectifValue || 1;
    if (quest.progression >= objectif) {
      quest.progression = objectif;
      quest.completed = true;

      // activer la quête suivante automatiquement
      const index = category.indexOf(quest);
      if (category[index + 1]) category[index + 1].active = true;
    }

    this.save();
  }

  getPlayerProgress(playerName, categoryKey) {
    const playerData = this.data[playerName];
    if (!playerData) return [];
    return playerData[categoryKey] || [];
  }

  getPlayerXP(playerName) {
    const playerData = this.data[playerName];
    if (!playerData) return 0;

    let xp = 0;
    Object.keys(playerData).forEach(catKey => {
      const cat = playerData[catKey];
      cat.forEach(q => {
        if (q.completed) {
          const info = questsData
            .flatMap(g => g.categories)
            .find(c => c.key === catKey)
            ?.niveaux.find(n => n.id === q.id);

          if (info) {
            const recomp = parseInt(info.recompense) || 0;
            xp += recomp;
          }
        }
      });
    });

    return xp;
  }
}

export default new QuestManager();
