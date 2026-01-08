<script setup>
import { ref, watch } from "vue";
import { useChaptersStore } from "../stores/chapitres";

const props = defineProps({
  campaign: { type: Object, default: null },
  mode: { type: String, default: "edit" }
});

const emit = defineEmits(["submit", "cancel"]);

const chaptersStore = useChaptersStore();

const form = ref({
  nom: "",
  etat: "brouillon",
  description: "",
  commentaireMj: "",
  chapitreId: null
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
        chapitreId: null
      };
      return;
    }
    form.value = {
      nom: campaign.nom ?? "",
      etat: campaign.etat ?? "brouillon",
      description: campaign.description ?? "",
      commentaireMj: campaign.commentaireMj ?? "",
      chapitreId: Array.isArray(campaign.chapitreIds) ? (campaign.chapitreIds[0] ?? null) : null
    };
  },
  { immediate: true }
);

function envoyer() {
  emit("submit", {
    nom: form.value.nom,
    etat: form.value.etat,
    description: form.value.description,
    commentaireMj: form.value.commentaireMj,
    chapitreIds: form.value.chapitreId ? [form.value.chapitreId] : []
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
        Chapitre
        <select v-model="form.chapitreId">
          <option :value="null">— aucun —</option>
          <option v-for="chap in chaptersStore.list" :key="chap.id" :value="chap.id">
            {{ chap.nom }}
          </option>
        </select>
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
