<script setup>
import { useItemsStore } from '../stores/objets';

const { liste } = defineProps({
  liste: { type: Array, required: true }
});

const emit = defineEmits(['modifier', 'supprimer', 'dupliquer']);

const objetsStore = useItemsStore();

function afficherListe(ids, trouverFn) {
  if (!Array.isArray(ids) || ids.length === 0) return "-";
  return ids.map((id) => {
    const item = trouverFn(id);
    return item?.name ;
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
        <th>État</th>
        <th>Description</th>
        <th>Commentaire MJ</th>
        <th>Lieu</th>
        <th>Objets</th>
        <th>Indices</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="q in liste" :key="q.id">
        <td>{{ q.name }}</td>
        <td>{{ q.status }}</td>
        <td>{{ q.description || "-" }}</td>
        <td>{{ q.commentaireMj || "-" }}</td>
        <td>{{ afficherLieu(q.lieuId) }}</td>
        <td>
          <button type="button" @click="emit('modifier', q.id)">Modifier</button>
          <button type="button" @click="emit('dupliquer', q.id)">Dupliquer</button>
          <button type="button" @click="emit('supprimer', q.id)">Supprimer</button>
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
