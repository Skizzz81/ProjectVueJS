<script setup>
import { useChaptersStore } from "../stores/chapitres";

defineProps({
  liste: { type: Array, required: true }
});

const emit = defineEmits(["modifier", "dupliquer", "supprimer", "exporter", "activer"]);

const chaptersStore = useChaptersStore();

function getChapterNames(campagne) {
  if (!campagne.chapitreIds || !Array.isArray(campagne.chapitreIds)) return '';
  return campagne.chapitreIds
    .map(id => chaptersStore.trouverChapitre(id)?.nom ?? id)
    .join(', ');
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Nom</th>
        <th>État</th>
        <th>Description</th>
        <th>Chapitres</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="campagne in liste" :key="campagne.id">
        <td>{{ campagne.nom }}</td>
        <td>{{ campagne.etat }}</td>
        <td>{{ campagne.description }}</td>
        <td>{{ getChapterNames(campagne) }}</td>
        <td class="actions">
          <button 
            v-if="campagne.etat === 'active'" 
            @click="emit('activer', campagne.id)"
            class="activate"
          >
            Gérer
          </button>
          <button @click="emit('modifier', campagne.id)">Éditer</button>
          <button @click="emit('dupliquer', campagne.id)">Dupliquer</button>
          <button @click="emit('exporter', campagne.id)">Exporter</button>
          <button class="danger" @click="emit('supprimer', campagne.id)">Supprimer</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

th {
  background: #f7f7f7;
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 600;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

button:hover {
  background: #f4f4f4;
}

button.danger {
  color: #c82727;
  border-color: #c82727;
}

button.danger:hover {
  background: #fff0f0;
}

button.activate {
  background: #42b983;
  color: white;
  border-color: #42b983;
  font-weight: 600;
}

button.activate:hover {
  background: #359268;
}
</style>
