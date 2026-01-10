<script setup>
import { ref, computed } from "vue";
import { useChaptersStore } from "../stores/chapitres";
import { useQuestsStore } from "../stores/quest";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";

const chaptersStore = useChaptersStore();
const questsStore = useQuestsStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();

const emit = defineEmits(['afficherDetail']);

const rechercheTexte = ref('');
const filtreStatut = ref('tous'); // 'tous', 'actif', 'terminé', 'inactif'

// Données filtrées
const chapitresActifs = computed(() => {
  return chaptersStore.list.filter(c => c.etat === 'actif');
});

const chapitresTermines = computed(() => {
  return chaptersStore.list.filter(c => c.etat === 'terminé');
});

const quetesActives = computed(() => {
  return questsStore.list.filter(q => q.etat === 'active');
});

const quetesTerminees = computed(() => {
  return questsStore.list.filter(q => q.etat === 'terminée');
});

// Fonction de recherche et filtrage
const elementsFiltres = computed(() => {
  let chapitres = [...chaptersStore.list];
  let quetes = [...questsStore.list];

  // Filtre par statut
  if (filtreStatut.value !== 'tous') {
    if (filtreStatut.value === 'actif') {
      chapitres = chapitres.filter(c => c.etat === 'actif');
      quetes = quetes.filter(q => q.etat === 'active');
    } else if (filtreStatut.value === 'terminé') {
      chapitres = chapitres.filter(c => c.etat === 'terminé');
      quetes = quetes.filter(q => q.etat === 'terminée');
    } else if (filtreStatut.value === 'inactif') {
      chapitres = chapitres.filter(c => c.etat === 'inactif');
      quetes = quetes.filter(q => q.etat === 'inactive');
    }
  }

  // Filtre par recherche texte
  if (rechercheTexte.value) {
    const recherche = rechercheTexte.value.toLowerCase();
    chapitres = chapitres.filter(c => 
      c.nom?.toLowerCase().includes(recherche) || 
      c.description?.toLowerCase().includes(recherche)
    );
    quetes = quetes.filter(q => 
      (q.nom || q.name)?.toLowerCase().includes(recherche) || 
      q.description?.toLowerCase().includes(recherche)
    );
  }

  return { chapitres, quetes };
});

function afficherDetail(type, id) {
  emit('afficherDetail', type, id);
}
</script>

<template>
  <div>
    <h2>Progression globale</h2>

    <div>
      <label>Rechercher :</label>
      <input 
        v-model="rechercheTexte" 
        type="text" 
        placeholder="Rechercher un chapitre ou une quête..."
      />
    </div>

    <div>
      <label>Filtrer par statut :</label>
      <select v-model="filtreStatut">
        <option value="tous">Tous</option>
        <option value="actif">Actifs</option>
        <option value="inactif">Inactifs</option>
        <option value="terminé">Terminés</option>
      </select>
    </div>

    <div v-if="rechercheTexte || filtreStatut !== 'tous'">
      <h3>Résultats de la recherche</h3>
      
      <div v-if="elementsFiltres.chapitres.length > 0">
        <h4>Chapitres</h4>
        <div 
          v-for="chap in elementsFiltres.chapitres" 
          :key="'chap-' + chap.id" 
          @click="afficherDetail('chapter', chap.id)"
        >
          <strong>{{ chap.nom }}</strong> - {{ chap.etat }}
          <p>{{ chap.description }}</p>
        </div>
      </div>

      <div v-if="elementsFiltres.quetes.length > 0">
        <h4>Quêtes</h4>
        <div 
          v-for="q in elementsFiltres.quetes" 
          :key="'quest-' + q.id" 
          @click="afficherDetail('quest', q.id)"
        >
          <strong>{{ q.nom || q.name }}</strong> - {{ q.etat }}
          <p>{{ q.description }}</p>
        </div>
      </div>

      <p v-if="elementsFiltres.chapitres.length === 0 && elementsFiltres.quetes.length === 0">
        Aucun résultat trouvé
      </p>
    </div>

    <div v-else>
      <div>
        <h3>Chapitres actifs</h3>
        <div v-if="chapitresActifs.length > 0">
          <div 
            v-for="chap in chapitresActifs" 
            :key="chap.id" 
            @click="afficherDetail('chapter', chap.id)"
          >
            <strong>{{ chap.nom }}</strong>
            <p>{{ chap.description }}</p>
          </div>
        </div>
        <p v-else>Aucun chapitre actif</p>
      </div>

      <div>
        <h3>Quêtes actives</h3>
        <div v-if="quetesActives.length > 0">
          <div 
            v-for="q in quetesActives" 
            :key="q.id" 
            @click="afficherDetail('quest', q.id)"
          >
            <strong>{{ q.nom || q.name }}</strong>
            <p>{{ q.description }}</p>
          </div>
        </div>
        <p v-else>Aucune quête active</p>
      </div>

      <div>
        <h3>Chapitres terminés</h3>
        <div v-if="chapitresTermines.length > 0">
          <div 
            v-for="chap in chapitresTermines" 
            :key="chap.id" 
            @click="afficherDetail('chapter', chap.id)"
          >
            <strong>{{ chap.nom }}</strong>
            <p>{{ chap.description }}</p>
          </div>
        </div>
        <p v-else>Aucun chapitre terminé</p>
      </div>

      <div>
        <h3>Quêtes terminées</h3>
        <div v-if="quetesTerminees.length > 0">
          <div 
            v-for="q in quetesTerminees" 
            :key="q.id" 
            @click="afficherDetail('quest', q.id)"
          >
            <strong>{{ q.nom || q.name }}</strong>
            <p>{{ q.description }}</p>
          </div>
        </div>
        <p v-else>Aucune quête terminée</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.section:last-child {
  border-bottom: none;
}

.item {
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  border-left: 4px solid #3498db;
  background-color: #e3f2fd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

.item p {
  margin-top: 5px;
  color: #666;
  font-size: 0.9rem;
}

.empty {
  color: #95a5a6;
  font-style: italic;
  padding: 10px;
  text-align: center;
}

input[type="text"],
select {
  margin-bottom: 15px;
}

h3 {
  color: #34495e;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 2px solid #ecf0f1;
}

h4 {
  color: #555;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
