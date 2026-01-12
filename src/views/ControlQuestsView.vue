<script setup>
import QuestForm from '../components/QuestForm.vue';
import { useQuestsStore } from '../stores/quest'
import { ref, computed } from 'vue'

const questsStore = useQuestsStore();
const editingQuestId = ref(null);
const editingQuest = computed(() => (
  editingQuestId.value ? questsStore.findQuest(editingQuestId.value) : null
));

function enregistrerQuete(data) {
  if(!editingQuestId.value){return;};
  questsStore.modifierQuete(editingQuestId.value, data);
  editingQuestId.value = null;
}
function modifierQuete(id){editingQuestId.value = id;}
function annulerEdition(){editingQuestId.value = null;}
</script>

<template>
    <h2>Contrôle des quêtes</h2>
    <button type="button" @click="questsStore.ajouterQuete()">Ajouter une quête</button>
    <p v-if="questsStore.list.length === 0">Aucune quête.</p>
    <table>
        <thead>
            <tr>
                <th>Nom</th>
                <th>État</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="quest in questsStore.list" :key="quest.id">
                <td>{{ quest.nom }}</td>
                <td>{{ quest.etat }}</td>
                <td>{{ quest.description }}</td>
                <td class="actions">
                    <button @click="modifierQuete(quest.id)">Éditer</button>
                    <button @click="questsStore.dupliquerQuete(quest.id)">Dupliquer</button>
                    <button class="danger" @click="questsStore.supprimerQuete(quest.id)">Supprimer</button>
                </td>
            </tr>
        </tbody>
    </table>

    <QuestForm
      v-if="editingQuest"
      mode="edit"
      :quest="editingQuest"
      @submit="enregistrerQuete"
      @cancel="annulerEdition"
    />
</template>

<style scoped>
table{
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
}

th{
    background: #f7f7f7;
    text-align: left;
    padding: 12px;
    border-bottom: 2px solid #e0e0e0;
    font-weight: 600;
}

td{
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
}

.actions{
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

button{
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  color: #888;
}

button:hover{
  background: #f4f4f4;
}

button.danger{
  color: #c82727;
  border-color: #c82727;
}

button.danger:hover{
  background: #fff0f0;
}
</style>