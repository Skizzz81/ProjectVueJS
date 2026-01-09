<script setup>
import { computed, ref } from "vue";
import ContentTable from "../components/ContentTable.vue";
import { useCluesStore } from "../stores/indices";
import { useItemsStore } from "../stores/objets";
import { usePlacesStore } from "../stores/lieux";

const lieuxStore = usePlacesStore();
const objetsStore = useItemsStore();
const indicesStore = useCluesStore();

const typeSelection = ref("objets");

const listeCourante = computed(() => {
  if (typeSelection.value === "objets") return objetsStore.list;
  if (typeSelection.value === "lieux") return lieuxStore.list;
  if (typeSelection.value === "indices")return indicesStore.list;
});
</script>

<template>
  <section>
    <h2>Controle des contenus (objets / lieux / indices)</h2>
    <select v-model="typeSelection">
      <option value="objets">Objets</option>
      <option value="lieux">Lieux</option>
      <option value="indices">Indices</option>
    </select>

    <ContentTable :liste="listeCourante" />
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
