<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  contenu: { type: Object, default: null },
  mode: { type: String, default: "edit" },
  type: { type: String, default: "objets" }
});

const emit = defineEmits(["submit", "cancel"]);

const form = ref({
  nom: "",
  description: "",
  commentaireMj: ""
});

watch(
  () => props.contenu,
  (contenu) => {
    if (!contenu) {
      form.value = { nom: "", description: "", commentaireMj: "" };
      return;
    }
    form.value = {
      nom: contenu.nom ?? "",
      description: contenu.description ?? "",
      commentaireMj: contenu.commentaireMj ?? ""
    };
  },
  { immediate: true }
);

function envoyer() {
  emit("submit", { ...form.value });
}
</script>

<template>
  <form @submit.prevent="envoyer">
    <fieldset>
      <legend>
        {{ mode === "edit" ? "Modifier" : "Nouveau" }}
        {{ type === "lieux" ? "lieu" : type === "objets" ? "objet" : "indice" }}
      </legend>

      <label>
        Nom
        <input v-model="form.nom" type="text" required />
      </label>

      <label>
        {{ type === "indices" ? "Texte" : "Description" }}
        <textarea v-model="form.description"></textarea>
      </label>

      <label>
        Commentaire MJ
        <textarea v-model="form.commentaireMj"></textarea>
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
