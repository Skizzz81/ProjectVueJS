<script setup>
import { ref, computed } from 'vue';
import { useCampaignsStore } from '../stores/campagnes';
import { useChaptersStore } from '../stores/chapitres';
import { usePlayersStore } from '../stores/joueurs';
import { useQuestsStore } from '../stores/quest';
import { usePlacesStore } from '../stores/lieux';
import { useItemsStore } from '../stores/objets';
import { useCluesStore } from '../stores/indices';

const store = useCampaignsStore();
const chaptersStore = useChaptersStore();
const playersStore = usePlayersStore();
const questsStore = useQuestsStore();
const placesStore = usePlacesStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();

const getChapterNames = (campagne) => {
  if (!campagne.chapitreIds || !Array.isArray(campagne.chapitreIds)) return '';
  return campagne.chapitreIds
    .map(id => chaptersStore.trouverChapitre(id)?.nom ?? id)
    .join(', ');
};

const form = ref({ nom: '', description: '', commentaireMj: '', etat: 'brouillon', chapitreId: null });
const editing = ref({});

// Contrôle campagne active
const controle = {
  chapitreId: ref(null),
  chapitreEtat: ref('inactif'),

  queteId: ref(null),
  queteEtat: ref('inactive'),

  joueurId: ref(null),
  joueurEtat: ref('vivant'),

  joueurDeplacementId: ref(null),
  joueurDestinationLieuId: ref(null),

  objetJoueurId: ref(null),
  objetId: ref(null),

  indiceId: ref(null)
};

function changerEtatChapitre(){
  const id = controle.chapitreId.value;
  if (!id) return alert('Choisir un chapitre');
  chaptersStore.modifierChapitre(id, { etat: controle.chapitreEtat.value });
}

function changerEtatQuete(){
  const id = controle.queteId.value;
  if (!id) return alert('Choisir une quête');
  questsStore.modifierQuete(id, { etat: controle.queteEtat.value });
}

function changerEtatJoueur(){
  const id = controle.joueurId.value;
  if (!id) return alert('Choisir un joueur');
  playersStore.modifierJoueur(id, { etat: controle.joueurEtat.value });
}

function deplacerJoueur(){
  const joueurId = controle.joueurDeplacementId.value;
  const destId = controle.joueurDestinationLieuId.value;
  if (!joueurId) return alert('Choisir un joueur');
  // récupérer joueur
  const joueur = playersStore.trouverJoueur(joueurId);
  if (!joueur) return alert('Joueur introuvable');
  const prevLieu = joueur.lieuId;
  // modifier joueur
  playersStore.modifierJoueur(joueurId, { lieuId: destId });
  // mettre à jour lieux joueurIds
  function updateLieu(lieuId, add){
    if (!lieuId) return;
    const lieu = placesStore.trouverLieu(lieuId);
    if (!lieu) return;
    const ids = Array.isArray(lieu.joueurIds) ? [...lieu.joueurIds] : [];
    const idx = ids.indexOf(joueurId);
    if (add) { if (idx === -1) ids.push(joueurId); }
    else { if (idx !== -1) ids.splice(idx,1); }
    placesStore.modifierLieu(lieuId, { joueurIds: ids });
  }
  updateLieu(prevLieu, false);
  updateLieu(destId, true);
}

function donnerObjetAJoueur(){
  const joueurId = controle.objetJoueurId.value;
  const objetId = controle.objetId.value;
  if (!joueurId || !objetId) return alert('Choisir joueur et objet');
  const joueur = playersStore.trouverJoueur(joueurId);
  if (!joueur) return alert('Joueur introuvable');
  const inv = Array.isArray(joueur.inventaireObjetsIds) ? [...joueur.inventaireObjetsIds] : [];
  if (!inv.includes(objetId)) inv.push(objetId);
  playersStore.modifierJoueur(joueurId, { inventaireObjetsIds: inv });
}

function reprendreObjetAJoueur(){
  const joueurId = controle.objetJoueurId.value;
  const objetId = controle.objetId.value;
  if (!joueurId || !objetId) return alert('Choisir joueur et objet');
  const joueur = playersStore.trouverJoueur(joueurId);
  if (!joueur) return alert('Joueur introuvable');
  const inv = Array.isArray(joueur.inventaireObjetsIds) ? [...joueur.inventaireObjetsIds] : [];
  const idx = inv.indexOf(objetId);
  if (idx !== -1) inv.splice(idx,1);
  playersStore.modifierJoueur(joueurId, { inventaireObjetsIds: inv });
}

function donnerIndiceATous(){
  const indiceId = controle.indiceId.value;
  if (!indiceId) return alert('Choisir un indice');
  playersStore.list.forEach(p => {
    const inv = Array.isArray(p.inventaireIndicesIds) ? [...p.inventaireIndicesIds] : [];
    if (!inv.includes(indiceId)) inv.push(indiceId);
    playersStore.modifierJoueur(p.id, { inventaireIndicesIds: inv });
  });
}

function reprendreIndiceATous(){
  const indiceId = controle.indiceId.value;
  if (!indiceId) return alert('Choisir un indice');
  playersStore.list.forEach(p => {
    const inv = Array.isArray(p.inventaireIndicesIds) ? [...p.inventaireIndicesIds] : [];
    const idx = inv.indexOf(indiceId);
    if (idx !== -1) inv.splice(idx,1);
    playersStore.modifierJoueur(p.id, { inventaireIndicesIds: inv });
  });
}

function ajouter(){
  const res = store.ajouterCampagne({ nom: form.value.nom, description: form.value.description, commentaireMj: form.value.commentaireMj, etat: form.value.etat, chapitreIds: form.value.chapitreId ? [form.value.chapitreId] : [] });
  if (res.success) {
    form.value.nom = '';
    form.value.description = '';
    form.value.commentaireMj = '';
    form.value.etat = 'brouillon';
    form.value.chapitreId = null;
  }
}

function commencerEdition(campagne){
  editing.value[campagne.id] = {
    ...campagne,
    chapitreId: Array.isArray(campagne.chapitreIds) ? (campagne.chapitreIds[0] ?? null) : null
  };
}

function annulerEdition(id){
  delete editing.value[id];
}

function enregistrerEdition(id){
  const data = editing.value[id];
  if (!data) return;
  store.modifierCampagne(id, { nom: data.nom, description: data.description, commentaireMj: data.commentaireMj, etat: data.etat, chapitreIds: data.chapitreId ? [data.chapitreId] : [] });
  delete editing.value[id];
}

function supprimer(id){
  store.supprimerCampagne(id);
}

function dupliquer(id){
  store.dupliquerCampagne(id);
}

function exporter(id){
  store.exporterCampagne(id);
}

async function importer(ev){
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  const res = await store.importerCampagneDepuisFichier(file);
  ev.target.value = '';
  if (!res.success) alert('Import error: ' + (res.error || 'inconnu'));
}
</script>

<template>
  <section>
    <h2>Gestion des campagnes</h2>
    <form @submit.prevent="ajouter" style="margin-bottom:16px">
      <input v-model="form.nom" placeholder="Nom" required />
      <select v-model="form.etat">
        <option value="brouillon">brouillon</option>
        <option value="disponible">disponible</option>
        <option value="active">active</option>
      </select>
      <select v-model="form.chapitreId" style="min-width:200px;">
        <option :value="null">aucun</option>
        <option v-for="chap in chaptersStore.list" :key="chap.id" :value="chap.id">{{ chap.nom }}</option>
      </select>
      <input v-model="form.description" placeholder="Description" />
      <input v-model="form.commentaireMj" placeholder="Commentaire MJ" />
      <button type="submit">Ajouter</button>
    </form>

    <div style="margin-bottom:12px">
      <label>Importer (.cplc.json): <input type="file" accept=".json,.cplc.json" @change="importer" /></label>
    </div>

    <table border="1" cellspacing="0" cellpadding="6">
      <thead>
        <tr>
          <th>id</th>
          <th>Nom</th>
          <th>Etat</th>
          <th>Description</th>
          <th>Chapitres</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="campagne in store.list" :key="campagne.id">
          <td>{{ campagne.id }}</td>
          <td v-if="!editing[campagne.id]">{{ campagne.nom }}</td>
          <td v-else><input v-model="editing[campagne.id].nom" /></td>

          <td v-if="!editing[campagne.id]">{{ campagne.etat }}</td>
          <td v-else>
            <select v-model="editing[campagne.id].etat">
              <option value="brouillon">brouillon</option>
              <option value="disponible">disponible</option>
              <option value="active">active</option>
            </select>
          </td>

          <td v-if="!editing[campagne.id]">{{ campagne.description }}</td>
          <td v-else><input v-model="editing[campagne.id].description" /></td>

          <td v-if="!editing[campagne.id]">{{ getChapterNames(campagne) }}</td>
          <td v-else>
            <select v-model="editing[campagne.id].chapitreId" style="min-width:200px;">
              <option :value="null">— aucun —</option>
              <option v-for="chap in chaptersStore.list" :key="chap.id" :value="chap.id">{{ chap.nom }}</option>
            </select>
          </td>

          <td>
            <template v-if="!editing[campagne.id]">
              <button @click="commencerEdition(campagne)">Edit</button>
              <button @click="supprimer(campagne.id)">Suppr</button>
              <button @click="dupliquer(campagne.id)">Dupliquer</button>
              <button @click="exporter(campagne.id)">Exporter</button>
            </template>
            <template v-else>
              <button @click="enregistrerEdition(campagne.id)">Save</button>
              <button @click="annulerEdition(campagne.id)">Cancel</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <section style="margin-top:12px;">
      <h3>Contrôle de la campagne active</h3>
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        <div style="min-width:280px;">
          <h4>Chapitre — changer état</h4>
          <select v-model="controle.chapitreId">
            <option :value="null">— choisir —</option>
            <option v-for="chap in chaptersStore.list" :key="chap.id" :value="chap.id">{{ chap.nom }}</option>
          </select>
          <select v-model="controle.chapitreEtat">
            <option value="inactif">inactif</option>
            <option value="actif">actif</option>
            <option value="terminé">terminé</option>
          </select>
          <button @click="changerEtatChapitre">Appliquer</button>
        </div>

        <div style="min-width:280px;">
          <h4>Quête — changer état</h4>
          <select v-model="controle.queteId">
            <option :value="null">— choisir —</option>
            <option v-for="q in questsStore.quest_list" :key="q.id" :value="q.id">{{ q.nom || q.name || q.id }}</option>
          </select>
          <select v-model="controle.queteEtat">
            <option value="inactive">inactive</option>
            <option value="active">active</option>
            <option value="terminée">terminée</option>
            <option value="abandonnée">abandonnée</option>
          </select>
          <button @click="changerEtatQuete">Appliquer</button>
        </div>

        <div style="min-width:280px;">
          <h4>Joueur — état / déplacement</h4>
          <select v-model="controle.joueurId">
            <option :value="null">— choisir —</option>
            <option v-for="p in playersStore.list" :key="p.id" :value="p.id">{{ p.nom }}</option>
          </select>
          <select v-model="controle.joueurEtat">
            <option value="vivant">vivant</option>
            <option value="inconscient">inconscient</option>
            <option value="mort">mort</option>
          </select>
          <button @click="changerEtatJoueur">Appliquer</button>

          <div style="margin-top:8px">
            <label>Déplacer: </label>
            <select v-model="controle.joueurDeplacementId">
              <option :value="null">— choisir joueur —</option>
              <option v-for="p in playersStore.list" :key="p.id" :value="p.id">{{ p.nom }}</option>
            </select>
            <select v-model="controle.joueurDestinationLieuId">
              <option :value="null">— aucun —</option>
              <option v-for="l in placesStore.list" :key="l.id" :value="l.id">{{ l.description || l.id }}</option>
            </select>
            <button @click="deplacerJoueur">Déplacer</button>
          </div>
        </div>

        <div style="min-width:280px;">
          <h4>Objets — donner / reprendre</h4>
          <select v-model="controle.objetJoueurId">
            <option :value="null">— choisir joueur —</option>
            <option v-for="p in playersStore.list" :key="p.id" :value="p.id">{{ p.nom }}</option>
          </select>
          <select v-model="controle.objetId">
            <option :value="null">— choisir objet —</option>
            <option v-for="it in itemsStore.list" :key="it.id" :value="it.id">{{ it.description || it.id }}</option>
          </select>
          <div style="display:flex;gap:6px;margin-top:6px">
            <button @click="donnerObjetAJoueur">Donner</button>
            <button @click="reprendreObjetAJoueur">Reprendre</button>
          </div>
        </div>

        <div style="min-width:280px;">
          <h4>Indices — donner / reprendre à tous</h4>
          <select v-model="controle.indiceId">
            <option :value="null">— choisir indice —</option>
            <option v-for="i in cluesStore.list" :key="i.id" :value="i.id">{{ i.description || i.id }}</option>
          </select>
          <div style="display:flex;gap:6px;margin-top:6px">
            <button @click="donnerIndiceATous">Donner à tous</button>
            <button @click="reprendreIndiceATous">Reprendre à tous</button>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
h3{ margin-top:0; }
select{ display:block; margin:6px 0; padding:6px; border-radius:4px; }
button{ padding:6px 8px; border-radius:4px; }
</style>
