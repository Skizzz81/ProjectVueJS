<script setup>
import { computed, ref } from "vue";
import PlayerForm from "../components/PlayerForm.vue";
import PlayersTable from "../components/PlayersTable.vue";
import { usePlayersStore } from "../stores/joueurs";

const playersStore = usePlayersStore();
const editingPlayerId = ref(null);
const creating = ref(false);

const editingPlayer = computed(() => (
  editingPlayerId.value ? playersStore.trouverJoueur(editingPlayerId.value) : null
));

function creerJoueur() {
  creating.value = true;
  editingPlayerId.value = null;
}

function modifierJoueur(id) {
  editingPlayerId.value = id;
  creating.value = false;
}

function enregistrerJoueur(data) {
  if (!editingPlayerId.value) return;
  playersStore.modifierJoueur(editingPlayerId.value, data);
  editingPlayerId.value = null;
}

function ajouterJoueur(data) {
  playersStore.ajouterJoueur(data);
  creating.value = false;
}

function annulerEdition() {
  editingPlayerId.value = null;
  creating.value = false;
}

function supprimerJoueur(id) {
  if (!confirm("Supprimer ce joueur ?")) return;
  playersStore.supprimerJoueur(id);
  if (editingPlayerId.value === id) editingPlayerId.value = null;
}

function dupliquerJoueur(id) {
  playersStore.dupliquerJoueur(id);
}
</script>

<template>
  <section>
    <h2>Contrôle des joueurs</h2>

    <button type="button" @click="creerJoueur">Ajouter un joueur</button>
    <p v-if="playersStore.list.length === 0">Aucun joueur.</p>
    <PlayersTable
      v-else
      :liste="playersStore.list"
      @modifier="modifierJoueur"
      @dupliquer="dupliquerJoueur"
      @supprimer="supprimerJoueur"
    />

    <PlayerForm
      v-if="editingPlayer"
      mode="edit"
      :player="editingPlayer"
      @submit="enregistrerJoueur"
      @cancel="annulerEdition"
    />

    <PlayerForm
      v-if="creating"
      mode="create"
      @submit="ajouterJoueur"
      @cancel="annulerEdition"
    />
  </section>
</template>

<style scoped>
section {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
}

h2 {
  margin-bottom: 8px;
}

button {
  margin-top: 6px;
}
</style>
