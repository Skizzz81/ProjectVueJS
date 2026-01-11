import { defineStore }      from 'pinia';
import { ref, watchEffect } from 'vue';

const allowed_statuses  = ['inactive', 'active', 'achieved', 'cancelled'];
const default_quests    = [
    {
        id: 1,
        nom: "Retrouver le symbole",
        etat: 'active',
        description: "Explorer le lieu pour trouver le symbole.",
        lieu: "Temple",
        commentaire: "",
        motDePasseResolution: "SYMBOLE"
    },
    {
        id: 2,
        nom: "Delivrer l'ombre",
        etat: 'inactive',
        description: "Liberer l'esprit prisonnier.",
        lieu: "Crypte",
        commentaire: "",
        motDePasseResolution: "LIBRE"
    },
    {
        id: 3,
        nom: "Message secret",
        etat: 'inactive',
        description: "Trouver l'indice cache.",
        lieu: "Bibliotheque",
        commentaire: "",
        motDePasseResolution: "CODE"
    }
];

export const useQuestsStore = defineStore('quest', () => {
    // Helpers
    function findQuest(quest_id){return list.value.find(({ id }) => (id === quest_id));};
    function genId(){ return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2,9); };
 
    function findIndex(quest_id){ return list.value.findIndex(quest => quest.id === quest_id); };

    // States
    const list = ref(JSON.parse(localStorage.getItem('quests') ?? 'null') ?? default_quests);

    // Watchers
    watchEffect(() => {localStorage.setItem('quests', JSON.stringify(list.value));});

    // Expose
    function ajouterQuete(data = {}){
        const allowedEtats = ['inactive','active','terminee','abandonnée'];
        const etat = data.etat || 'inactive';
        if (!allowedEtats.includes(etat)) return { success: false, error: 'etat invalide' };

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

        if (data.etat !== undefined) {
            const allowedEtats = ['inactive','active','terminee','abandonnée'];
            if (!allowedEtats.includes(data.etat)) return { success: false, error: 'etat invalide' };
            quete.etat = data.etat;
        }

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
        ajouterQuete,
        modifierQuete,
        supprimerQuete,
        findQuest
    };
});