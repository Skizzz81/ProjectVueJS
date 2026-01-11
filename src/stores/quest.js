import { defineStore }      from 'pinia';
import { ref, watchEffect } from 'vue';

const default_quests = [
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
    function genId(){ return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2,9); }
 
    function findIndex(quest_id){ return list.value.findIndex(quete => quete.id === quest_id); }

    // States
    const list = ref(JSON.parse(localStorage.getItem('quests') ?? 'null') ?? default_quests);

    // Watchers
    watchEffect(() => {localStorage.setItem('quests', JSON.stringify(list.value));});

    // Expose
    function ajouterQuete(data = {}){
        const allowedEtats = ['inactive','active','terminee','abandonnée'];
        const etat = data.etat || 'inactive';
        if (!allowedEtats.includes(etat)) return { success: false, error: 'etat invalide' };

        const quete = {
            id: data.id ?? genId(),
            nom: data.nom || "Nouvelle quête",
            etat,
            description: data.description || '',
            lieu: data.lieu || null,
            commentaire: data.commentaire || '',
            motDePasseResolution: data.motDePasseResolution || ''
        };

        list.value.push(quete);
        return { success: true, quete };
    }

    function modifierQuete(id, data = {}){
        const quete = findQuest(id);
        if(!quete) return { success: false, error: 'quête introuvable' };

        if (data.etat !== undefined) {
            const allowedEtats = ['inactive','active','terminee','abandonnée'];
            if (!allowedEtats.includes(data.etat)) return { success: false, error: 'etat invalide' };
            quete.etat = data.etat;
        }

        if (data.nom !== undefined) quete.nom = data.nom;
        if (data.description !== undefined) quete.description = data.description;
        if (data.lieu !== undefined) quete.lieu = data.lieu;
        if (data.commentaire !== undefined) quete.commentaire = data.commentaire;
        if (data.motDePasseResolution !== undefined) quete.motDePasseResolution = data.motDePasseResolution;

        return { success: true, quete };
    }

    function supprimerQuete(id){
        const index = findIndex(id);
        if(index === -1) return { success: false, error: 'quête introuvable' };
        list.value.splice(index, 1);
        return { success: true };
    }

    return {
        list,
        ajouterQuete,
        modifierQuete,
        supprimerQuete,
        findQuest
    };
});
