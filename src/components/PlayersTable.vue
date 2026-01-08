<script setup>
import { useCluesStore } from "../stores/indices";
import { useItemsStore } from "../stores/objets";
import { usePlacesStore } from "../stores/lieux";

const { liste } = defineProps({
  liste: { type: Array, required: true }
});

const emit = defineEmits(["modifier", "supprimer", "dupliquer"]);

const lieuxStore = usePlacesStore();
const objetsStore = useItemsStore();
const indicesStore = useCluesStore();

function afficherListe(ids, trouverFn) {
  if (!Array.isArray(ids) || ids.length === 0) return "-";
  return ids.map((id) => {
    const item = trouverFn(id);
    return item?.nom ;
  }).join(", ");
}

function afficherLieu(id) {
  if (id === null || id === undefined || id === "") return "-";
  const lieu = lieuxStore.trouverLieu(id);
  return lieu?.nom ;
}
</script>

<template>
  <table border="1">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Etat</th>
        <th>Description</th>
        <th>Commentaire MJ</th>
        <th>Lieu</th>
        <th>Objets</th>
        <th>Indices</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="j in liste" :key="j.id">
        <td>{{ j.nom }}</td>
        <td>{{ j.etat }}</td>
        <td>{{ j.description || "-" }}</td>
        <td>{{ j.commentaireMj || "-" }}</td>
        <td>{{ afficherLieu(j.lieuId) }}</td>
        <td>{{ afficherListe(j.inventaireObjetsIds, objetsStore.trouverObjet, "Objet") }}</td>
        <td>{{ afficherListe(j.inventaireIndicesIds, indicesStore.trouverIndice, "Indice") }}</td>
        <td>
          <button type="button" @click="emit('modifier', j.id)">Modifier</button>
          <button type="button" @click="emit('dupliquer', j.id)">Dupliquer</button>
          <button type="button" @click="emit('supprimer', j.id)">Supprimer</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 8px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 6px 8px;
  text-align: left;
}

th {
  background: #f4f4f4;
}

button {
  margin-right: 6px;
}
</style>
