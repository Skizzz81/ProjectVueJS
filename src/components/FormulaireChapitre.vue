<script setup>
import { ref, watch, computed } from "vue";
import { useQuestsStore } from "../stores/quest";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";
import { useChaptersStore } from "../stores/chapitres";

const props = defineProps({
  chapter: { type: Object, default: null },
  mode: { type: String, default: "edit" }
});

const emit = defineEmits(["submit", "cancel"]);

const questsStore = useQuestsStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();
const chaptersStore = useChaptersStore();

const form = ref({
  nom: "",
  etat: "inactif",
  description: "",
  commentaireMj: "",
  motPasseActivation: "",
  motPasseResolution: "",
  queteIds: [],
  recompenseObjetsIds: [],
  recompenseIndicesIds: [],
  objetsRequisIds: []
});

watch(
  () => props.chapter,
  (chapter) => {
    if (!chapter) {
      form.value = {
        nom: "",
        etat: "inactif",
        description: "",
        commentaireMj: "",
        motPasseActivation: "",
        motPasseResolution: "",
        queteIds: [],
        recompenseObjetsIds: [],
        recompenseIndicesIds: [],
        objetsRequisIds: []
      };
      return;
    }
    form.value = {
      nom: chapter.nom ?? "",
      etat: chapter.etat ?? "inactif",
      description: chapter.description ?? "",
      commentaireMj: chapter.commentaireMj ?? "",
      motPasseActivation: chapter.motPasseActivation ?? "",
      motPasseResolution: chapter.motPasseResolution ?? "",
      queteIds: Array.isArray(chapter.queteIds) ? [...chapter.queteIds] : [],
      recompenseObjetsIds: Array.isArray(chapter.recompenseObjetsIds) ? [...chapter.recompenseObjetsIds] : [],
      recompenseIndicesIds: Array.isArray(chapter.recompenseIndicesIds) ? [...chapter.recompenseIndicesIds] : [],
      objetsRequisIds: Array.isArray(chapter.objetsRequisIds) ? [...chapter.objetsRequisIds] : []
    };
  },
  { immediate: true }
);

const quetesDisponibles = computed(() => {
  const quetesUtilisees = new Set();
  chaptersStore.list.forEach((chap) => {
    if (props.chapter && chap.id === props.chapter.id) return;
    if (Array.isArray(chap.queteIds)) {
      chap.queteIds.forEach(id => quetesUtilisees.add(id));
    }
  });
  return questsStore.list.filter(q => !quetesUtilisees.has(q.id));
});

function toggleItem(array, id) {
  const index = array.indexOf(id);
  if (index === -1) {
    array.push(id);
  } else {
    array.splice(index, 1);
  }
}

function envoyer() {
  emit("submit", { ...form.value });
}
</script>

<template>
  <form @submit.prevent="envoyer">
    <fieldset>
      <legend>{{ mode === "edit" ? "Modifier le chapitre" : "Nouveau chapitre" }}</legend>

      <label>
        Nom
        <input v-model="form.nom" type="text" required />
      </label>

      <label>
        État
        <select v-model="form.etat">
          <option value="inactif">inactif</option>
          <option value="actif">actif</option>
          <option value="terminé">terminé</option>
        </select>
      </label>

      <label>
        Description
        <textarea v-model="form.description" rows="3"></textarea>
      </label>

      <label>
        Commentaire MJ
        <textarea v-model="form.commentaireMj" rows="2"></textarea>
      </label>

      <label>
        Mot de passe activation
        <input v-model="form.motPasseActivation" type="text" />
      </label>

      <label>
        Mot de passe résolution
        <input v-model="form.motPasseResolution" type="text" />
      </label>

      <label>
        Quêtes
        <div class="selection-box">
          <div v-for="q in quetesDisponibles" :key="q.id" class="checkbox-item">
            <label>
              <input 
                type="checkbox" 
                :checked="form.queteIds.includes(q.id)"
                @change="toggleItem(form.queteIds, q.id)"
              />
              {{ q.nom || q.name }}
            </label>
          </div>
          <p v-if="quetesDisponibles.length === 0" class="empty">Aucune quête disponible</p>
        </div>
      </label>

      <label>
        Récompense - Objets
        <div class="selection-box">
          <div v-for="item in itemsStore.list" :key="item.id" class="checkbox-item">
            <label>
              <input 
                type="checkbox" 
                :checked="form.recompenseObjetsIds.includes(item.id)"
                @change="toggleItem(form.recompenseObjetsIds, item.id)"
              />
              {{ item.nom || item.description }}
            </label>
          </div>
          <p v-if="itemsStore.list.length === 0" class="empty">Aucun objet</p>
        </div>
      </label>

      <label>
        Récompense - Indices
        <div class="selection-box">
          <div v-for="clue in cluesStore.list" :key="clue.id" class="checkbox-item">
            <label>
              <input 
                type="checkbox" 
                :checked="form.recompenseIndicesIds.includes(clue.id)"
                @change="toggleItem(form.recompenseIndicesIds, clue.id)"
              />
              {{ clue.nom || clue.description }}
            </label>
          </div>
          <p v-if="cluesStore.list.length === 0" class="empty">Aucun indice</p>
        </div>
      </label>

      <label>
        Objets requis
        <div class="selection-box">
          <div v-for="item in itemsStore.list" :key="item.id" class="checkbox-item">
            <label>
              <input 
                type="checkbox" 
                :checked="form.objetsRequisIds.includes(item.id)"
                @change="toggleItem(form.objetsRequisIds, item.id)"
              />
              {{ item.nom || item.description }}
            </label>
          </div>
          <p v-if="itemsStore.list.length === 0" class="empty">Aucun objet</p>
        </div>
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
  max-width: 700px;
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

.selection-box {
  margin-top: 8px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fafafa;
  max-height: 150px;
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

.empty {
  color: #999;
  font-style: italic;
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

button[type="submit"] {
  background: #2774c8;
  color: #fff;
  border-color: #2774c8;
}

button[type="submit"]:hover {
  background: #1f5fa0;
}

button:hover {
  background: #f4f4f4;
}
</style>
