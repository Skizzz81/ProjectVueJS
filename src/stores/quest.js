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
    function genId(){ return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2,9); }
 
    function findIndex(quest_id){ return list.value.findIndex(quete => quete.id === quest_id); }

    // States
    const list = ref(JSON.parse(localStorage.getItem('quests') ?? 'null') ?? default_quests);

    // Watchers
    watchEffect(() => {localStorage.setItem('quests', JSON.stringify(list.value));});

    // Expose
    function ajouterQuete(data = {}){
        const allowedEtats = ['inactive','active','terminée','abandonnée'];
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
            const allowedEtats = ['inactive','active','terminée','abandonnée'];
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
        findQuest,
        ajouterQuete,
        modifierQuete,
        supprimerQuete
    };
});
