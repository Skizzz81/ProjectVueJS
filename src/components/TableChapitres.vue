<script setup>
import { useQuestsStore } from "../stores/quest";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";

const { liste } = defineProps({
  liste: { type: Array, required: true }
});

const emit = defineEmits(["modifier", "supprimer", "dupliquer"]);

const questsStore = useQuestsStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();

function afficherListe(ids, trouverFn, propNom = "nom") {
  if (!Array.isArray(ids) || ids.length === 0) return "-";
  return ids.map((id) => {
    const item = trouverFn(id);
    return item?.[propNom] || item?.description || id;
  }).join(", ");
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Nom</th>
        <th>État</th>
        <th>Description</th>
        <th>Commentaire MJ</th>
        <th>Quêtes</th>
        <th>Récompenses Objets</th>
        <th>Récompenses Indices</th>
        <th>Objets Requis</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="chap in liste" :key="chap.id">
        <td>{{ chap.nom }}</td>
        <td>{{ chap.etat }}</td>
        <td>{{ chap.description || "-" }}</td>
        <td>{{ chap.commentaireMj || "-" }}</td>
        <td>{{ afficherListe(chap.queteIds, questsStore.findQuest, "nom") }}</td>
        <td>{{ afficherListe(chap.recompenseObjetsIds, itemsStore.trouverObjet, "nom") }}</td>
        <td>{{ afficherListe(chap.recompenseIndicesIds, cluesStore.trouverIndice, "nom") }}</td>
        <td>{{ afficherListe(chap.objetsRequisIds, itemsStore.trouverObjet, "nom") }}</td>
        <td class="actions">
          <button @click="emit('modifier', chap.id)">Éditer</button>
          <button @click="emit('dupliquer', chap.id)">Dupliquer</button>
          <button class="danger" @click="emit('supprimer', chap.id)">Supprimer</button>
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
</style>
