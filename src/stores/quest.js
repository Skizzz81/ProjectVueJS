import { defineStore }      from 'pinia';
import { ref, watchEffect } from 'vue';

const default_quests = [
    {
        id: 1,
        name: "L'hérétique",
        status: 'active',
        description: "Pour un tel échec, aucune punition n'est assez grande...",
        lieu: "Quelque part dans l'espace",
        commentary: "",
        activation_password: "WORT",
        resolution_password: "SHINY_ARMOR",
        rewards: []
    },
]

export const useQuestStore = defineStore('quest', () => {
    // Helpers
    function findQuest(quest_id){return quest_state.value.find(({ id }) => (id === quest_id));};

    // States
    const quest_state = ref(JSON.parse(localStorage.getItem('quests') ?? default_quests));

    // Watchers
    watchEffect(() => {localStorage.setItem('quests', JSON.stringify(liste.value));});

    // Expose
    return {
        quest_state,
        findQuest
    };
});