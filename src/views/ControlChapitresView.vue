<script setup>
import { computed, ref } from "vue";
import FormulaireChapitre from "../components/FormulaireChapitre.vue";
import TableChapitres from "../components/TableChapitres.vue";
import { useChaptersStore } from "../stores/chapitres";

const chaptersStore = useChaptersStore();
const editingChapterId = ref(null);
const creating = ref(false);

const editingChapter = computed(() => (
  editingChapterId.value ? chaptersStore.trouverChapitre(editingChapterId.value) : null
));

function creerChapitre() {
  creating.value = true;
  editingChapterId.value = null;
}

function modifierChapitre(id) {
  editingChapterId.value = id;
  creating.value = false;
}

function enregistrerChapitre(data) {
  if (!editingChapterId.value) return;
  chaptersStore.modifierChapitre(editingChapterId.value, data);
  editingChapterId.value = null;
}

function ajouterChapitre(data) {
  chaptersStore.ajouterChapitre(data);
  creating.value = false;
}

function annulerEdition() {
  editingChapterId.value = null;
  creating.value = false;
}

function supprimerChapitre(id) {
  if (!confirm("Supprimer ce chapitre ?")) return;
  chaptersStore.supprimerChapitre(id);
  if (editingChapterId.value === id) editingChapterId.value = null;
}

function dupliquerChapitre(id) {
  chaptersStore.dupliquerChapitre(id);
}
</script>

<template>
  <section>
    <h2>Gestion des chapitres</h2>

    <button type="button" @click="creerChapitre">Ajouter un chapitre</button>
    
    <p v-if="chaptersStore.list.length === 0">Aucun chapitre.</p>
    <TableChapitres
      v-else
      :liste="chaptersStore.list"
      @modifier="modifierChapitre"
      @dupliquer="dupliquerChapitre"
      @supprimer="supprimerChapitre"
    />

    <FormulaireChapitre
      v-if="editingChapter"
      mode="edit"
      :chapter="editingChapter"
      @submit="enregistrerChapitre"
      @cancel="annulerEdition"
    />

    <FormulaireChapitre
      v-if="creating"
      mode="create"
      @submit="ajouterChapitre"
      @cancel="annulerEdition"
    />
  </section>
</template>

<style scoped>
section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

h2 {
  margin-bottom: 16px;
}

button[type="button"] {
  margin-bottom: 12px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #2774c8;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

button[type="button"]:hover {
  background: #1f5fa0;
}
</style>
