import { defineStore }      from 'pinia';
import { ref, watchEffect } from 'vue';

const allowed_statuses  = ['inactive', 'active', 'achieved', 'cancelled'];
const default_quests    = [
    {
        id:                     1,
        name:                   "L'hérétique",
        status:                 'active',
        description:            "Pour un tel échec, aucune punition n'est assez grande...",
        commentary:             "",
        activation_password:    "WORT_WORT_WORT",
        resolution_password:    "SHINY_ARMOR",
        rewards:                [],
        chapter_id:             1,
        place_id:               1
    },
]

export const useQuestsStore = defineStore('quest', () => {
    // Helpers
    function findQuest(quest_id){return list.value.find(({ id }) => (id === quest_id));};
    function genId(){ return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2,9); };
 
    function findIndex(quest_id){ return list.value.findIndex(quest => quest.id === quest_id); };

    // States
    const list = ref(JSON.parse(localStorage.getItem('quests') ?? 'null') ?? default_quests);

    // Watchers
    watchEffect(() => {localStorage.setItem('quests', JSON.stringify(list.value));});

    // CRUD Actions
    function addQuest(data = {}){
        const status = data.status || 'inactive';

        if (!allowed_statuses.includes(status)) return { success: false, error: "État invalide" };

        const quest = {
            id:                     data.id ?? genId(),
            name:                   data.nom || "Nouvelle quête",
            status:                 data.status,
            description:            data.description || '',
            commentary:             data.commentary || '',
            activation_password:    data.activation_password || '',
            resolution_password:    data.resolution_password || ''
        };

        list.value.push(quest);
        return { success: true, quest: quest };
    };

    function modifyQuest(id, data = {}){
        const quest = findQuest(id);
        if(!quest) return { success: false, error: "Quête introuvable" };

        if(data.status !== undefined){
            if (!allowed_statuses.includes(data.status)) return { success: false, error: "État invalide" };
            quest.status = data.status;
        };

        if (data.nom !== undefined) quest.nom = data.nom;
        if (data.description !== undefined) quest.description = data.description;
        if (data.commentary !== undefined) quest.commentary = data.commentary;
        if (data.activation_password !== undefined) quest.activation_password = data.activation_password;
        if (data.resolution_password !== undefined) quest.resolution_password = data.resolution_password;

        return { success: true, quest };
    };

    function deleteQuest(id){
        const index = findIndex(id);
        if(index === -1) return { success: false, error: "Quête introuvable" };
        list.value.splice(index, 1);
        return { success: true };
    };

    return {
        list,
        findQuest,
        addQuest,
        modifyQuest,
        deleteQuest
    };
});