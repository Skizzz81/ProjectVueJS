<script setup>
import { computed, ref } from "vue";
import { useCampaignsStore } from "../stores/campagnes";
import { useChaptersStore } from "../stores/chapitres";
import { usePlayersStore } from "../stores/joueurs";
import { useQuestsStore } from "../stores/quest";
import { usePlacesStore } from "../stores/lieux";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";

const chaptersStore = useChaptersStore();
const playersStore = usePlayersStore();
const questsStore = useQuestsStore();
const placesStore = usePlacesStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();
const campaignsStore = useCampaignsStore();

const campagneActive = computed(() =>
  campaignsStore.trouverCampaign(campaignsStore.activeCampaignId)
);

const chapitresActifs = computed(() => {
  const id = campagneActive.value?.id;
  if (!id) return [];
  return chaptersStore.list.filter((c) => c.campagneId === id);
});

const joueursActifs = computed(() => {
  const ids = campagneActive.value?.joueurIds;
  if (!Array.isArray(ids)) return [];
  return playersStore.list.filter((j) => ids.includes(j.id));
});

const lieuxActifs = computed(() => {
  return placesStore.list;
});

const objetsActifs = computed(() => {
  return itemsStore.list;
});

const indicesActifs = computed(() => {
  return cluesStore.list;
});

const chapitreId = ref(null);
const chapitreEtat = ref("inactif");

const queteId = ref(null);
const queteEtat = ref("inactive");

const joueurId = ref(null);
const joueurEtat = ref("vivant");

const joueurDeplacementId = ref(null);
const joueurDestinationLieuId = ref(null);

const objetJoueurId = ref(null);
const objetId = ref(null);

const indiceId = ref(null);

function changerEtatChapitre() {
  const id = chapitreId.value;
  if (!id) return alert("Choisir un chapitre");
  chaptersStore.modifierChapitre(id, { etat: chapitreEtat.value });
}

function changerEtatQuete() {
  const id = queteId.value;
  if (!id) return alert("Choisir une quête");
  questsStore.modifierQuete(id, { etat: queteEtat.value });
}

function changerEtatJoueur() {
  const id = joueurId.value;
  if (!id) return alert("Choisir un joueur");
  playersStore.modifierJoueur(id, { etat: joueurEtat.value });
}

function deplacerJoueur() {
  const jId = joueurDeplacementId.value;
  const destId = joueurDestinationLieuId.value;
  if (!jId) return alert("Choisir un joueur");

  const joueur = playersStore.trouverJoueur(jId);
  if (!joueur) return alert("Joueur introuvable");
  const prevLieu = joueur.lieuId;
  playersStore.modifierJoueur(jId, { lieuId: destId });

  function updateLieu(lieuId, add) {
    if (!lieuId) return;
    const lieu = placesStore.trouverLieu(lieuId);
    if (!lieu) return;
    const ids = Array.isArray(lieu.joueurIds) ? [...lieu.joueurIds] : [];
    const idx = ids.indexOf(jId);
    if (add) {
      if (idx === -1) ids.push(jId);
    } else {
      if (idx !== -1) ids.splice(idx, 1);
    }
    placesStore.modifierLieu(lieuId, { joueurIds: ids });
  }

  updateLieu(prevLieu, false);
  updateLieu(destId, true);
}

function donnerObjetAJoueur() {
  const jId = objetJoueurId.value;
  const oId = objetId.value;
  if (!jId || !oId) return alert("Choisir joueur et objet");
  const joueur = playersStore.trouverJoueur(jId);
  if (!joueur) return alert("Joueur introuvable");
  const inv = Array.isArray(joueur.inventaireObjetsIds)
    ? [...joueur.inventaireObjetsIds]
    : [];
  if (!inv.includes(oId)) inv.push(oId);
  playersStore.modifierJoueur(jId, { inventaireObjetsIds: inv });
}

function reprendreObjetAJoueur() {
  const jId = objetJoueurId.value;
  const oId = objetId.value;
  if (!jId || !oId) return alert("Choisir joueur et objet");
  const joueur = playersStore.trouverJoueur(jId);
  if (!joueur) return alert("Joueur introuvable");
  const inv = Array.isArray(joueur.inventaireObjetsIds)
    ? [...joueur.inventaireObjetsIds]
    : [];
  const idx = inv.indexOf(oId);
  if (idx !== -1) inv.splice(idx, 1);
  playersStore.modifierJoueur(jId, { inventaireObjetsIds: inv });
}

function donnerIndiceATous() {
  const iId = indiceId.value;
  if (!iId) return alert("Choisir un indice");
  playersStore.list.forEach((p) => {
    const inv = Array.isArray(p.inventaireIndicesIds)
      ? [...p.inventaireIndicesIds]
      : [];
    if (!inv.includes(iId)) inv.push(iId);
    playersStore.modifierJoueur(p.id, { inventaireIndicesIds: inv });
  });
}

function reprendreIndiceATous() {
  const iId = indiceId.value;
  if (!iId) return alert("Choisir un indice");
  playersStore.list.forEach((p) => {
    const inv = Array.isArray(p.inventaireIndicesIds)
      ? [...p.inventaireIndicesIds]
      : [];
    const idx = inv.indexOf(iId);
    if (idx !== -1) inv.splice(idx, 1);
    playersStore.modifierJoueur(p.id, { inventaireIndicesIds: inv });
  });
}
</script>

<template>
  <section class="controle-mj">
    <h3>Contrôle de la campagne active</h3>
    <div class="panels">
      <div class="panel">
        <h4>Chapitre — changer état</h4>
        <select v-model="chapitreId">
          <option :value="null">— choisir —</option>
          <option
            v-for="chap in chapitresActifs"
            :key="chap.id"
            :value="chap.id"
          >
            {{ chap.nom }}
          </option>
        </select>
        <select v-model="chapitreEtat">
          <option value="inactif">inactif</option>
          <option value="actif">actif</option>
          <option value="terminé">terminé</option>
        </select>
        <button @click="changerEtatChapitre">Appliquer</button>
      </div>

      <div class="panel">
        <h4>Quête — changer état</h4>
        <select v-model="queteId">
          <option :value="null">— choisir —</option>
          <option
            v-for="q in questsStore.list"
            :key="q.id"
            :value="q.id"
          >
            {{ q.nom || q.name || q.id }}
          </option>
        </select>
        <select v-model="queteEtat">
          <option value="inactive">inactive</option>
          <option value="active">active</option>
          <option value="terminée">terminée</option>
          <option value="abandonnée">abandonnée</option>
        </select>
        <button @click="changerEtatQuete">Appliquer</button>
      </div>

      <div class="panel">
        <h4>Joueur — état / déplacement</h4>
        <select v-model="joueurId">
          <option :value="null">— choisir —</option>
          <option
            v-for="p in joueursActifs"
            :key="p.id"
            :value="p.id"
          >
            {{ p.nom }}
          </option>
        </select>
        <select v-model="joueurEtat">
          <option value="vivant">vivant</option>
          <option value="inconscient">inconscient</option>
          <option value="mort">mort</option>
        </select>
        <button @click="changerEtatJoueur">Appliquer</button>

        <div class="sub-panel">
          <label>Déplacer: </label>
          <select v-model="joueurDeplacementId">
            <option :value="null">— choisir joueur —</option>
            <option
              v-for="p in joueursActifs"
              :key="p.id"
              :value="p.id"
            >
              {{ p.nom }}
            </option>
          </select>
          <select v-model="joueurDestinationLieuId">
            <option :value="null">— aucun —</option>
            <option
              v-for="l in lieuxActifs"
              :key="l.id"
              :value="l.id"
            >
              {{ l.nom }}
            </option>
          </select>
          <button @click="deplacerJoueur">Déplacer</button>
        </div>
      </div>

      <div class="panel">
        <h4>Objets — donner / reprendre</h4>
        <select v-model="objetJoueurId">
          <option :value="null">— choisir joueur —</option>
          <option
            v-for="p in joueursActifs"
            :key="p.id"
            :value="p.id"
          >
            {{ p.nom }}
          </option>
        </select>
        <select v-model="objetId">
          <option :value="null">— choisir objet —</option>
          <option
            v-for="it in objetsActifs"
            :key="it.id"
            :value="it.id"
          >
            {{ it.description || it.id }}
          </option>
        </select>
        <div class="button-group">
          <button @click="donnerObjetAJoueur">Donner</button>
          <button @click="reprendreObjetAJoueur">Reprendre</button>
        </div>
      </div>

      <div class="panel">
        <h4>Indices — donner / reprendre à tous</h4>
        <select v-model="indiceId">
          <option :value="null">— choisir indice —</option>
          <option
            v-for="i in indicesActifs"
            :key="i.id"
            :value="i.id"
          >
            {{ i.description || i.id }}
          </option>
        </select>
        <div class="button-group">
          <button @click="donnerIndiceATous">Donner à tous</button>
          <button @click="reprendreIndiceATous">Reprendre à tous</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.controle-mj {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

h3 {
  margin-top: 0;
  margin-bottom: 16px;
}

.panels {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.panel {
  min-width: 280px;
  flex: 1;
  padding: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h4 {
  margin: 0 0 8px;
  font-size: 14px;
}

select {
  display: block;
  width: 100%;
  margin: 6px 0;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background: #3498db;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.sub-panel {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.sub-panel label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
}
</style>

