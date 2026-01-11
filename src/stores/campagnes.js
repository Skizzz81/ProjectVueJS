import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_campaigns = [
  {
    id: 1,
    nom: "Campagne alpha",
    etat: "active",
    description: "Campagne de test.",
    commentaireMj: "Notes MJ pour la campagne alpha.",
    joueurIds: [1, 2],
    chapitreIds: [1, 2]
  },
  {
    id: 2,
    nom: "Campagne beta",
    etat: "disponible",
    description: "Deuxieme campagne de test.",
    commentaireMj: "Notes MJ pour la campagne beta.",
    joueurIds: [3],
    chapitreIds: [3]
  }
];

export const useCampaignsStore = defineStore("campaigns", () => {
  const list = ref(
    JSON.parse(localStorage.getItem("campaigns") ?? "null") ?? default_campaigns
  );
  const activeCampaignId = ref(
    JSON.parse(localStorage.getItem("activeCampaignId") ?? "null") ?? 1
  );

  watchEffect(() => {
    localStorage.setItem("campaigns", JSON.stringify(list.value));
    localStorage.setItem("activeCampaignId", JSON.stringify(activeCampaignId.value));
  });

  // Helpers
  function genId() {
    return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2,9);
  }

  function trouverCampaign(id) {
    return list.value.find((campagne) => campagne.id === id);
  }

  function trouverIndexCampaign(id) {
    return list.value.findIndex((campagne) => campagne.id === id);
  }

  // CRUD
  function ajouterCampagne(data = {}) {
    const campagne = {
      id: data.id ?? genId(),
      nom: data.nom || 'Nouvelle campagne',
      etat: data.etat || 'brouillon',
      description: data.description || '',
      commentaireMj: data.commentaireMj || '',
      joueurIds: data.joueurIds || [],
      chapitreIds: data.chapitreIds || []
    };
    list.value.push(campagne);
    return { success: true, campagne };
  }

  function modifierCampagne(id, data = {}) {
    const campagne = trouverCampaign(id);
    if (!campagne) return { success: false, error: 'campagne introuvable' };
    Object.assign(campagne, data);
    return { success: true, campagne };
  }

  function supprimerCampagne(id) {
    const index = trouverIndexCampaign(id);
    if (index === -1) return { success: false, error: 'campagne introuvable' };
    list.value.splice(index, 1);
    if (activeCampaignId.value === id) activeCampaignId.value = list.value[0]?.id ?? null;
    return { success: true };
  }

  function dupliquerCampagne(id) {
    const original = trouverCampaign(id);
    if (!original) return { success: false, error: 'campagne introuvable' };

    const copie = {
      id: genId(),
      nom: `Copie de ${original.nom}`,
      etat: original.etat,
      description: original.description,
      commentaireMj: original.commentaireMj,
      joueurIds: Array.isArray(original.joueurIds) ? [...original.joueurIds] : [],
      chapitreIds: Array.isArray(original.chapitreIds) ? [...original.chapitreIds] : []
    };

    list.value.push(copie);
    return { success: true, campagne: copie };
  }

  function exporterCampagne(id) {
    const campagne = trouverCampaign(id);
    if (!campagne) return { success: false, error: 'campagne introuvable' };

    // Préparer le contenu JSON
    const contenu = JSON.stringify(campagne, null, 2);

    // Nom de fichier sécurisé
    const safeName = (campagne.nom || 'campagne').replace(/[^a-z0-9_\-]/gi, '_');
    const filename = `${safeName}-${id}.cplc.json`;

    const blob = new Blob([contenu], { type: 'application/json' });

    // Support IE/Edge
    if (typeof window !== 'undefined' && window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    return { success: true, filename, contenu };
  }

  function importerCampagneDepuisObjet(obj) {
    if (!obj || typeof obj !== 'object') return { success: false, error: 'format invalide' };

    // Accepter plusieurs noms de clés possibles (compatibilité)
    const nom = obj.nom ?? obj.name ?? 'Campagne importée';
    const etat = obj.etat ?? obj.status ?? 'brouillon';
    const description = obj.description ?? '';
    const commentaireMj = obj.commentaireMj ?? obj.commentary ?? '';
    const joueurIds = Array.isArray(obj.joueurIds) ? obj.joueurIds : (Array.isArray(obj.joueurIds) ? obj.joueurIds : (Array.isArray(obj.playerIds) ? obj.playerIds : []));
    const chapitreIds = Array.isArray(obj.chapitreIds) ? obj.chapitreIds : (Array.isArray(obj.chapterIds) ? obj.chapterIds : []);

    let id = obj.id ?? genId();
    // Si conflit d'ID, générer un nouvel id
    if (trouverCampaign(id)) {
      id = genId();
    }

    const campagne = {
      id,
      nom,
      etat,
      description,
      commentaireMj,
      joueurIds: [...joueurIds],
      chapitreIds: [...chapitreIds]
    };

    list.value.push(campagne);
    return { success: true, campagne };
  }

  function importerCampagneDepuisFichier(file) {
    return new Promise((resolve, reject) => {
      if (!file || typeof file.text === 'function') {
        // navigateur moderne : File.text() disponible
        if (typeof file.text === 'function') {
          file.text().then((text) => {
            try {
              const parsed = JSON.parse(text);
              resolve(importerCampagneDepuisObjet(parsed));
            } catch (e) {
              resolve({ success: false, error: 'JSON invalide' });
            }
          }).catch(() => resolve({ success: false, error: 'lecture fichier impossible' }));
          return;
        }
      }

      // Fallback FileReader
      try {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result));
            resolve(importerCampagneDepuisObjet(parsed));
          } catch (e) {
            resolve({ success: false, error: 'JSON invalide' });
          }
        };
        reader.onerror = () => resolve({ success: false, error: 'lecture fichier impossible' });
        reader.readAsText(file);
      } catch (e) {
        resolve({ success: false, error: 'lecture fichier non supportée' });
      }
    });
  }

  function setActiveCampaign(id) {
    const campagne = trouverCampaign(id);
    if (!campagne) return { success: false, error: "campagne introuvable" };

    const ancienne = list.value.find((c) => c.id === activeCampaignId.value);
    if (ancienne && ancienne.id !== id) {
      ancienne.etat = "disponible";
    }

    campagne.etat = "active";
    activeCampaignId.value = id;
    return { success: true, campagne };
  }

  return {
    list,
    activeCampaignId,
    trouverCampaign,
    trouverIndexCampaign,
    ajouterCampagne,
    modifierCampagne,
    supprimerCampagne,
    dupliquerCampagne,
    exporterCampagne,
    importerCampagneDepuisObjet,
    importerCampagneDepuisFichier,
    setActiveCampaign
  };
});
