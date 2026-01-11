<script setup>
import { ref, computed } from "vue";
import { usePlayersStore } from "../stores/joueurs";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";

const playersStore = usePlayersStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();

const props = defineProps({
  joueurId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['afficherDetail']);

const rechercheInventaire = ref('');

const joueur = computed(() => {
  return playersStore.trouverJoueur(props.joueurId);
});

// Objets du joueur
const objetsJoueur = computed(() => {
  if (!joueur.value || !joueur.value.inventaireObjetsIds) return [];
  return joueur.value.inventaireObjetsIds
    .map(id => itemsStore.trouverObjet(id))
    .filter(obj => obj);
});

// Indices du joueur
const indicesJoueur = computed(() => {
  if (!joueur.value || !joueur.value.inventaireIndicesIds) return [];
  return joueur.value.inventaireIndicesIds
    .map(id => cluesStore.trouverIndice(id))
    .filter(indice => indice);
});

// Filtrage par recherche
const objetsFiltres = computed(() => {
  if (!rechercheInventaire.value) return objetsJoueur.value;
  const recherche = rechercheInventaire.value.toLowerCase();
  return objetsJoueur.value.filter(obj => 
    obj.nom?.toLowerCase().includes(recherche) || 
    obj.description?.toLowerCase().includes(recherche)
  );
});

const indicesFiltres = computed(() => {
  if (!rechercheInventaire.value) return indicesJoueur.value;
  const recherche = rechercheInventaire.value.toLowerCase();
  return indicesJoueur.value.filter(indice => 
    indice.nom?.toLowerCase().includes(recherche) || 
    indice.description?.toLowerCase().includes(recherche)
  );
});

function afficherDetail(type, id) {
  emit('afficherDetail', type, id);
}
</script>

<template>
  <div>
    <h3>Inventaire du joueur</h3>

    <div v-if="!joueurId">
      <p>Sélectionnez un joueur pour voir son inventaire</p>
    </div>

    <div v-else>
      <div>
        <label>Rechercher dans l'inventaire :</label>
        <input 
          v-model="rechercheInventaire" 
          type="text" 
          placeholder="Nom ou description..."
        />
      </div>

      <div>
        <h4>Objets ({{ objetsFiltres.length }})</h4>
        <div v-if="objetsFiltres.length > 0">
          <div 
            v-for="obj in objetsFiltres" 
            :key="obj.id" 
            @click="afficherDetail('objet', obj.id)"
          >
            <strong>{{ obj.nom }}</strong>
            <p>{{ obj.description }}</p>
          </div>
        </div>
        <p v-else>Aucun objet{{ rechercheInventaire ? ' trouvé' : '' }}</p>
      </div>

      <div>
        <h4>Indices ({{ indicesFiltres.length }})</h4>
        <div v-if="indicesFiltres.length > 0">
          <div 
            v-for="indice in indicesFiltres" 
            :key="indice.id" 
            @click="afficherDetail('indice', indice.id)"
          >
            <strong>{{ indice.nom }}</strong>
            <p>{{ indice.description }}</p>
          </div>
        </div>
        <p v-else>Aucun indice{{ rechercheInventaire ? ' trouvé' : '' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h4 {
  color: #34495e;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #ecf0f1;
  border-radius: 5px;
}

input[type="text"] {
  margin-bottom: 20px;
}

.item {
  padding: 12px;
  margin-bottom: 10px;
  background-color: #e8f5e9;
  border-radius: 5px;
  border-left: 3px solid #27ae60;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item strong {
  color: #2c3e50;
}

.item p {
  margin-top: 5px;
  color: #666;
  font-size: 0.9rem;
}

p.empty {
  color: #95a5a6;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>
