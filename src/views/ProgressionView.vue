<script setup>
import { ref, computed } from "vue";
import { useChaptersStore } from "../stores/chapitres";
import { useQuestsStore } from "../stores/quest";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";
import ProgressionPanel from "../components/ProgressionPanel.vue";

const chaptersStore = useChaptersStore();
const questsStore = useQuestsStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();

const detailView = ref(null);

function afficherDetail(type, id) {
  detailView.value = { type, id };
}

function fermerDetail() {
  detailView.value = null;
}

function getRecompenses(chapitre) {
  const objets = (chapitre.recompenseObjetsIds || [])
    .map(id => itemsStore.trouverObjet(id))
    .filter(o => o)
    .map(o => o.nom || o.description);
  
  const indices = (chapitre.recompenseIndicesIds || [])
    .map(id => cluesStore.trouverIndice(id))
    .filter(i => i)
    .map(i => i.nom || i.description);
  
  return { objets, indices };
}

const detailElement = computed(() => {
  if (!detailView.value) return null;
  
  if (detailView.value.type === 'chapter') {
    const chap = chaptersStore.trouverChapitre(detailView.value.id);
    if (!chap) return null;
    const recompenses = getRecompenses(chap);
    return { ...chap, recompenses, type: 'chapter' };
  }
  
  if (detailView.value.type === 'quest') {
    const quest = questsStore.findQuest(detailView.value.id);
    return quest ? { ...quest, type: 'quest' } : null;
  }
  
  return null;
});
</script>

<template>
  <div>
    <h1>Progression globale</h1>
    
    <div>
      <div>
        <ProgressionPanel @afficherDetail="afficherDetail" />
      </div>

      <aside v-if="detailElement">
        <div>
          <h2>{{ detailElement.nom || detailElement.name }}</h2>
          <button @click="fermerDetail">✕</button>
        </div>

        <div v-if="detailElement.type === 'chapter'">
          <div>
            <strong>État :</strong>
            <span>{{ detailElement.etat }}</span>
          </div>

          <div>
            <strong>Description :</strong>
            <p>{{ detailElement.description || '-' }}</p>
          </div>

          <div v-if="detailElement.etat === 'termine'">
            <h3>Récompenses obtenues</h3>
            <div v-if="detailElement.recompenses.objets.length > 0">
              <strong>Objets :</strong>
              <ul>
                <li v-for="(obj, i) in detailElement.recompenses.objets" :key="i">{{ obj }}</li>
              </ul>
            </div>
            <div v-if="detailElement.recompenses.indices.length > 0">
              <strong>Indices :</strong>
              <ul>
                <li v-for="(ind, i) in detailElement.recompenses.indices" :key="i">{{ ind }}</li>
              </ul>
            </div>
            <p v-if="detailElement.recompenses.objets.length === 0 && detailElement.recompenses.indices.length === 0">
              Aucune récompense
            </p>
          </div>
        </div>

        <div v-if="detailElement.type === 'quest'">
          <div>
            <strong>État :</strong>
            <span>{{ detailElement.etat }}</span>
          </div>

          <div>
            <strong>Description :</strong>
            <p>{{ detailElement.description || '-' }}</p>
          </div>

          <div v-if="detailElement.lieu">
            <strong>Lieu :</strong>
            <span>{{ detailElement.lieu }}</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 30px;
}

aside {
  position: fixed;
  right: 20px;
  top: 80px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

aside h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

aside button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 35px;
  height: 35px;
  padding: 0;
  border-radius: 50%;
  background-color: #e74c3c;
  font-size: 18px;
}

aside ul {
  margin-top: 10px;
  margin-left: 20px;
}

aside li {
  margin-bottom: 5px;
}
</style>
