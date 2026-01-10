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
  gap: 8px;
  flex-wrap: wrap;
}

button {
  padding: 10px 16px;
  border: 2px solid #3498db;
  border-radius: 5px;
  background: #3498db;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button.danger {
  background: #e74c3c;
  border-color: #e74c3c;
  color: white;
}

button.activate {
  background: #27ae60;
  color: white;
  border-color: #27ae60;
  font-weight: 600;
}
</style>
