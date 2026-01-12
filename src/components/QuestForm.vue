<script setup>
import { ref, watch } from 'vue';
import { usePlacesStore } from '../stores/lieux';

const props = defineProps({
  quest: { type: Object, default: null },
  mode: { type: String, default: 'edit' }
});
const emit        = defineEmits(['submit', 'cancel']);
const lieuxStore  = usePlacesStore();
const form        = ref({
  id: 0,
  nom: "",
  etat: 'active',
  description: "",
  commentaireMj: "",
  activation_password: "",
  resolution_password: "",
  rewards: [],
  chapter_id: 0,
  lieu: ""
});

watch(
  () => props.quest,
  (quest) => {
    if (!quest) {
      form.value = { nom: "", etat: 'active' };
      return;
    }
    form.value = {
      nom: quest.nom ?? "",
      etat: quest.etat ?? 'active',
      description: quest.description ?? "",
      commentaireMj: quest.commentaireMj ?? "",
      activation_password: quest.activation_password ?? "",
      resolution_password: quest.resolution_password ?? "",
      chapter_id: quest.chapter_id ?? 0,
      lieu: quest.lieu ?? "",
      rewards: Array.isArray(quest.rewards)
        ? [...quest.rewards]
        : [],
    };
  },
  { immediate: true }
);

function envoyer(){
  emit('submit', {
    nom: form.value.nom,
    etat: form.value.etat,
    description: form.value.description,
    commentaireMj: form.value.commentaireMj,
    activation_password: form.value.activation_password,
    resolution_password: form.value.resolution_password,
    chapter_id: form.value.chapter_id,
    lieu: form.value.lieu,
    rewards: form.value.rewards
  });
}
</script>

<template>
  <form @submit.prevent="envoyer">
    <fieldset>
      <legend>{{ mode === 'edit' ? "Modifier la quête" : "Nouvelle quête" }}</legend>

      <label>
        Nom
        <input v-model="form.nom" type="text" required />
      </label>

      <label>
        État
        <select v-model="form.etat">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="achieved">Terminée</option>
          <option value="cancelled">Abandonnée</option>
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
        Lieu
        <select v-model="form.lieu">
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
        Mot de passe d'activation
        <textarea v-model="form.activation_password"></textarea>
      </label>

      <label>
        Mot de passe de résolution
        <textarea v-model="form.resolution_password"></textarea>
      </label>

      <div>
        <button type="submit">Enregistrer</button>
        <button type="button" @click="emit('cancel')">Annuler</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
form{
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
}

fieldset{
  border: 0;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

label{
  display: grid;
  gap: 4px;
}

input,
select,
textarea{
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
textarea{min-height: 60px;}

button{margin-right: 8px;}
</style>