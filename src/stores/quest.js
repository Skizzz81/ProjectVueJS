import { defineStore }      from 'pinia';
import { ref, watchEffect } from 'vue';

export const useQuestStore = defineStore('quest', () => {
    // Helpers
    function findQuest(quest_id){return quest_state.value.find(({ id }) => (id === quest_id));};
    // States
    const quest_state = ref(JSON.parse(localStorage.getItem('quests') ?? '[]'));

    // Watchers
    watchEffect(() => {localStorage.setItem('quests', JSON.stringify(liste.value));});

    // Expose
    return {
        quest_state,
        findQuest
    };
});