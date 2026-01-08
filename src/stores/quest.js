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

export const useQuestsStore = defineStore('quest', () => {
    // Helpers
    function findQuest(quest_id){return list.value.find(({ id }) => (id === quest_id));};

    // States
    const list = ref(JSON.parse(localStorage.getItem('quests') ?? "null") ?? default_quests);

    // Watchers
    watchEffect(() => {localStorage.setItem('quests', JSON.stringify(list.value));});

    // Expose
    return {
        quest_list: list,
        findQuest
    };
});