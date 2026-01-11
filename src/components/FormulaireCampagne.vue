<script setup>
import { computed, ref, watch } from "vue";
import { useChaptersStore } from "../stores/chapitres";
import { usePlayersStore } from "../stores/joueurs";
import { useCampaignsStore } from "../stores/campagnes";

const props = defineProps({
  campaign: { type: Object, default: null },
  mode: { type: String, default: "edit" }
});

const emit = defineEmits(["submit", "cancel"]);

const chaptersStore = useChaptersStore();
const playersStore = usePlayersStore();
const campaignsStore = useCampaignsStore();

const chapitresDisponibles = computed(() => {
  const currentId = props.campaign?.id ?? null;
  return chaptersStore.list.filter((chap) => (
    chap.campagneId === null || chap.campagneId === undefined || chap.campagneId === currentId
  ));
});

const joueursDisponibles = computed(() => {
  const currentId = props.campaign?.id ?? null;
  const idsUtilises = new Set();
  campaignsStore.list.forEach((campagne) => {
    if (campagne.id === currentId) return;
    if (Array.isArray(campagne.joueurIds)) {
      campagne.joueurIds.forEach((id) => idsUtilises.add(id));
    }
  });
  return playersStore.list.filter((j) => !idsUtilises.has(j.id));
});

const form = ref({
  nom: "",
  etat: "brouillon",
  description: "",
  commentaireMj: "",
  chapitreIds: [],
  joueurIds: []
});

watch(
  () => props.campaign,
  (campaign) => {
    if (!campaign) {
    form.value = {
      nom: "",
      etat: "brouillon",
      description: "",
      commentaireMj: "",
      chapitreIds: [],
      joueurIds: []
    };
      return;
    }
    form.value = {
      nom: campaign.nom ?? "",
      etat: campaign.etat ?? "brouillon",
      description: campaign.description ?? "",
      commentaireMj: campaign.commentaireMj ?? "",
      chapitreIds: Array.isArray(campaign.chapitreIds) ? [...campaign.chapitreIds] : [],
      joueurIds: Array.isArray(campaign.joueurIds) ? [...campaign.joueurIds] : []
    };
  },
  { immediate: true }
);

function toggleChapter(chapitreId) {
  const index = form.value.chapitreIds.indexOf(chapitreId);
  if (index === -1) {
    form.value.chapitreIds.push(chapitreId);
  } else {
    form.value.chapitreIds.splice(index, 1);
  }
}

function togglePlayer(joueurId) {
  const index = form.value.joueurIds.indexOf(joueurId);
  if (index === -1) {
    form.value.joueurIds.push(joueurId);
  } else {
    form.value.joueurIds.splice(index, 1);
  }
}

function envoyer() {
  emit("submit", {
    nom: form.value.nom,
    etat: form.value.etat,
    description: form.value.description,
    commentaireMj: form.value.commentaireMj,
    chapitreIds: form.value.chapitreIds,
    joueurIds: form.value.joueurIds
  });
}
</script>

<template>
  <form @submit.prevent="envoyer">
    <fieldset>
      <legend>{{ mode === "edit" ? "Modifier la campagne" : "Nouvelle campagne" }}</legend>

      <label>
        Nom
        <input v-model="form.nom" type="text" required />
      </label>

      <label>
        État
        <select v-model="form.etat">
          <option value="brouillon">brouillon</option>
          <option value="disponible">disponible</option>
          <option value="active">active</option>
        </select>
      </label>

      <label>
        Chapitres
        <div class="chapters-selection">
          <div v-for="chap in chapitresDisponibles" :key="chap.id" class="checkbox-item">
            <label>
              <input 
                type="checkbox" 
                :value="chap.id" 
                :checked="form.chapitreIds.includes(chap.id)"
                @change="toggleChapter(chap.id)"
              />
              {{ chap.nom }}
            </label>
          </div>
          <p v-if="chapitresDisponibles.length === 0" class="no-chapters">
            Aucun chapitre disponible
          </p>
        </div>
      </label>

      <label>
        Joueurs
        <div class="chapters-selection">
          <div v-for="j in joueursDisponibles" :key="j.id" class="checkbox-item">
            <label>
              <input 
                type="checkbox" 
                :value="j.id" 
                :checked="form.joueurIds.includes(j.id)"
                @change="togglePlayer(j.id)"
              />
              {{ j.nom }}
            </label>
          </div>
          <p v-if="joueursDisponibles.length === 0" class="no-chapters">
            Aucun joueur disponible
          </p>
        </div>
      </label>

      <label>
        Description
        <textarea v-model="form.description" rows="3"></textarea>
      </label>

      <label>
        Commentaire MJ
        <textarea v-model="form.commentaireMj" rows="3"></textarea>
      </label>

      <div class="actions">
        <button type="submit">{{ mode === "edit" ? "Enregistrer" : "Créer" }}</button>
        <button type="button" @click="emit('cancel')">Annuler</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  margin: 16px 0;
  max-width: 600px;
}

fieldset {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
}

legend {
  font-weight: bold;
  padding: 0 8px;
}

label {
  display: block;
  margin: 12px 0;
  font-weight: 500;
}

input,
select,
textarea {
  display: block;
  width: 100%;
  margin-top: 4px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

button {
  padding: 10px 20px;
  border: 2px solid #95a5a6;
  border-radius: 5px;
  background: #95a5a6;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button[type="submit"] {
  background: #3498db;
  color: #fff;
  border-color: #3498db;
}

.chapters-selection {
  margin-top: 8px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fafafa;
  max-height: 200px;
  overflow-y: auto;
}

.checkbox-item {
  margin: 6px 0;
}

.checkbox-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
  cursor: pointer;
  margin: 0;
}

.checkbox-item input[type="checkbox"] {
  width: auto;
  margin: 0;
  cursor: pointer;
}

.no-chapters {
  color: #999;
  font-style: italic;
  margin: 0;
}
</style>
