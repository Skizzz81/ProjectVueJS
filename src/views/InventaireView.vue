<script setup>
import { ref, computed } from "vue";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";
import SelecteurJoueur from "../components/SelecteurJoueur.vue";
import InventaireJoueur from "../components/InventaireJoueur.vue";

const itemsStore = useItemsStore();
const cluesStore = useCluesStore();

const joueurSelectionneId = ref(null);
const detailView = ref(null);

function afficherDetail(type, id) {
  detailView.value = { type, id };
}

function fermerDetail() {
  detailView.value = null;
}

const detailElement = computed(() => {
  if (!detailView.value) return null;

  if (detailView.value.type === 'objet') {
    const objet = itemsStore.trouverObjet(detailView.value.id);
    return objet ? { ...objet, type: 'objet' } : null;
  }

  if (detailView.value.type === 'indice') {
    const indice = cluesStore.trouverIndice(detailView.value.id);
    return indice ? { ...indice, type: 'indice' } : null;
  }
  
  return null;
});
</script>

<template>
  <div>
    <h1>Inventaire du joueur</h1>

    <SelecteurJoueur v-model="joueurSelectionneId" />

    <div v-if="!joueurSelectionneId">
      <p>Veuillez sélectionner un joueur pour voir son inventaire</p>
    </div>

    <div v-else>
      <div>
        <InventaireJoueur 
          :joueurId="joueurSelectionneId"
          @afficherDetail="afficherDetail"
        />
      </div>

      <aside v-if="detailElement">
        <div>
          <h2>{{ detailElement.nom || detailElement.name }}</h2>
          <button @click="fermerDetail">✕</button>
        </div>

        <div v-if="detailElement.type === 'objet'">
          <div>
            <strong>Description :</strong>
            <p>{{ detailElement.description || '-' }}</p>
          </div>
        </div>

        <div v-if="detailElement.type === 'indice'">
          <div>
            <strong>Texte :</strong>
            <p>{{ detailElement.description || '-' }}</p>
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

p {
  text-align: center;
  color: #95a5a6;
  padding: 40px;
  background: white;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
