<script setup>
import { ref, watch } from "vue";
import { useCluesStore } from "../stores/indices";
import { useItemsStore } from "../stores/objets";
import { usePlacesStore } from "../stores/lieux";

const props = defineProps({
  player: { type: Object, default: null },
  mode: { type: String, default: "edit" }
});

const emit = defineEmits(["submit", "cancel"]);

const lieuxStore = usePlacesStore();
const objetsStore = useItemsStore();
const indicesStore = useCluesStore();

const form = ref({
  nom: "",
  etat: "vivant",
  description: "",
  commentaireMj: "",
  lieuId: "",
  inventaireObjetsIds: [],
  inventaireIndicesIds: []
});

watch(
  () => props.player,
  (player) => {
    if (!player) {
      form.value = {
        nom: "",
        etat: "vivant",
        description: "",
        commentaireMj: "",
        lieuId: "",
        inventaireObjetsIds: [],
        inventaireIndicesIds: []
      };
      return;
    }
    form.value = {
      nom: player.nom ?? "",
      etat: player.etat ?? "vivant",
      description: player.description ?? "",
      commentaireMj: player.commentaireMj ?? "",
      lieuId: player.lieuId ?? "",
      inventaireObjetsIds: Array.isArray(player.inventaireObjetsIds)
        ? [...player.inventaireObjetsIds]
        : [],
      inventaireIndicesIds: Array.isArray(player.inventaireIndicesIds)
        ? [...player.inventaireIndicesIds]
        : []
    };
  },
  { immediate: true }
);

function envoyer() {
  let lieuId = form.value.lieuId;
  if (lieuId === "" || lieuId === null) {
    lieuId = null;
  } else if (!isNaN(lieuId) && !isNaN(parseFloat(lieuId))) {
    lieuId = Number(lieuId);
  }
  
  const convertirId = (id) => {
    if (!isNaN(id) && !isNaN(parseFloat(id))) {
      return Number(id);
    }
    return id;
  };
  
  emit("submit", {
    nom: form.value.nom,
    etat: form.value.etat,
    description: form.value.description,
    commentaireMj: form.value.commentaireMj,
    lieuId: lieuId,
    inventaireObjetsIds: form.value.inventaireObjetsIds.map(convertirId),
    inventaireIndicesIds: form.value.inventaireIndicesIds.map(convertirId)
  });
}
</script>

<template>
  <form @submit.prevent="envoyer">
    <fieldset>
      <legend>{{ mode === "edit" ? "Modifier le joueur" : "Nouveau joueur" }}</legend>

      <label>
        Nom
        <input v-model="form.nom" type="text" required />
      </label>

      <label>
        Etat
        <select v-model="form.etat">
          <option value="vivant">vivant</option>
          <option value="mort">mort</option>
        </select>
      </label>

      <label>
        Description
        <textarea v-model="form.description"></textarea>
      </label>

      <label>
        Commentaire MJ
        <textarea v-model="form.commentaireMj"></textarea>
      </label>

      <label>
        Lieu ID
        <select v-model="form.lieuId">
          <option value="">Aucun</option>
          <option v-if="lieuxStore.list.length === 0" disabled value="">
            Aucun lieu disponible
          </option>
          <option v-for="l in lieuxStore.list" :key="l.id" :value="l.id">
            {{ l.nom }}
          </option>
        </select>
      </label>

      <label>
        Inventaire objets
        <select v-model="form.inventaireObjetsIds" multiple>
          <option v-if="objetsStore.list.length === 0" disabled value="">
            Aucun objet disponible
          </option>
          <option v-for="o in objetsStore.list" :key="o.id" :value="o.id">
            {{ o.nom }}
          </option>
        </select>
      </label>

      <label>
        Inventaire indices
        <select v-model="form.inventaireIndicesIds" multiple>
          <option v-if="indicesStore.list.length === 0" disabled value="">
            Aucun indice disponible
          </option>
          <option v-for="i in indicesStore.list" :key="i.id" :value="i.id">
            {{ i.nom }}
          </option>
        </select>
      </label>

      <div>
        <button type="submit">Enregistrer</button>
        <button type="button" @click="emit('cancel')">Annuler</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
}

fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

label {
  display: grid;
  gap: 4px;
}

input,
select,
textarea {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  min-height: 60px;
}

button {
  margin-right: 8px;
}
</style>
