<script setup>
import { ref } from "vue";
import SelecteurJoueur from "../components/SelecteurJoueur.vue";
import ActionsJoueur from "../components/ActionsJoueur.vue";

const joueurSelectionneId = ref(null);
</script>

<template>
  <div>
    <h1>Actions du joueur</h1>

    <SelecteurJoueur v-model="joueurSelectionneId" />

    <div v-if="!joueurSelectionneId">
      <p>Veuillez sélectionner un joueur pour effectuer des actions</p>
    </div>

    <div v-else>
      <ActionsJoueur :joueurId="joueurSelectionneId" />
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 30px;
}

p {
  text-align: center;
  color: #95a5a6;
  padding: 40px;
  background: white;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
