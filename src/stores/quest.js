import { defineStore }      from 'pinia';
import { ref, watchEffect } from 'vue';

const allowedEtats      = ['inactive','active','terminee','abandonnée'];
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
        const etat = data.etat || 'inactive';

        if (!allowedEtats.includes(etat)) return { success: false, error: "État invalide" };

        const quest = {
            id:                     data.id ?? genId(),
            nom:                    data.nom || "Nouvelle quête",
            etat:                   data.etat || 'inactive',
            description:            data.description || 'Description par défaut',
            commentaireMj:          data.commentaireMj || '',
            lieu:                   data.lieu || '',
            activation_password:    data.activation_password || '',
            resolution_password:    data.resolution_password || ''
        };

        list.value.push(quest);
        return { success: true, quest: quest };
    };

    function modifierQuete(id, data = {}){
        const quest = findQuest(id);
        if(!quest) return { success: false, error: "Quête introuvable" };

        if (data.etat !== undefined) {
            const allowedEtats = ['inactive','active','terminee','abandonnée'];
            if (!allowedEtats.includes(data.etat)) return { success: false, error: 'etat invalide' };
            quest.etat = data.etat;
        }

        if (data.nom !== undefined) quest.nom = data.nom;
        if (data.description !== undefined) quest.description = data.description;
        if (data.commentaireMj !== undefined) quest.commentaireMj = data.commentaireMj;
        if (data.activation_password !== undefined) quest.activation_password = data.activation_password;
        if (data.resolution_password !== undefined) quest.resolution_password = data.resolution_password;

        return { success: true, quest };
    };

    function supprimerQuete(id){
        const index = findIndex(id);
        if(index === -1) return { success: false, error: "Quête introuvable" };
        list.value.splice(index, 1);
        return { success: true };
    };

    function dupliquerQuete(id){
        const original = findQuest(id);

        if (!original) return { success: false, error: "Quête introuvable" };

        const copie = {
            ...original,
            id: crypto.randomUUID(),
            nom: `${original.nom} (copie)`
        };
        list.value.push(copie);
        return { success: true, quest: copie };
    };

    return {
        list,
        ajouterQuete,
        modifierQuete,
        supprimerQuete,
        dupliquerQuete,
        findQuest
    };
});