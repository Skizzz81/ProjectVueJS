<script setup>
import { ref, computed } from "vue";
import { usePlayersStore } from "../stores/joueurs";
import { useChaptersStore } from "../stores/chapitres";
import { useQuestsStore } from "../stores/quest";
import { usePlacesStore } from "../stores/lieux";

const playersStore = usePlayersStore();
const chaptersStore = useChaptersStore();
const questsStore = useQuestsStore();
const lieuxStore = usePlacesStore();

const props = defineProps({
  joueurId: {
    type: [String, Number],
    required: true
  }
});

const joueur = computed(() => {
  return playersStore.trouverJoueur(props.joueurId);
});

// Données pour les actions
const lieuSelectionne = ref('');
const chapitreIdAction = ref('');
const motDePasseChapitre = ref('');
const queteIdAction = ref('');
const motDePasseQuete = ref('');
const typeActionChapitre = ref('activer'); // 'activer' ou 'completer'
const typeActionQuete = ref('activer'); // 'activer' ou 'completer'

const messageRetour = ref('');

const lieux = computed(() => lieuxStore.list);

const chapitres = computed(() => chaptersStore.list);

// Quêtes dans le lieu actuel du joueur
const quetesDansLieu = computed(() => {
  if (!joueur.value || !joueur.value.lieuId) return [];
  return questsStore.list.filter(q => q.lieu === joueur.value.lieuId);
});

// Actions
function deplacerJoueur() {
  if (!lieuSelectionne.value) {
    messageRetour.value = 'Veuillez sélectionner un lieu';
    return;
  }

  playersStore.modifierJoueur(props.joueurId, {
    ...joueur.value,
    lieuId: lieuSelectionne.value
  });

  messageRetour.value = `Joueur déplacé vers : ${lieuSelectionne.value}`;
  lieuSelectionne.value = '';
  
  setTimeout(() => {
    messageRetour.value = '';
  }, 3000);
}

function actionChapitre() {
  if (!chapitreIdAction.value) {
    messageRetour.value = 'Veuillez sélectionner un chapitre';
    return;
  }

  const chapitre = chaptersStore.trouverChapitre(chapitreIdAction.value);
  if (!chapitre) {
    messageRetour.value = 'Chapitre non trouvé';
    return;
  }

  // Vérification du mot de passe
  const motDePasseAttendu = typeActionChapitre.value === 'activer' 
    ? chapitre.motDePasseActivation 
    : chapitre.motDePasseCompletion;

  if (motDePasseChapitre.value !== motDePasseAttendu) {
    messageRetour.value = 'Mot de passe incorrect';
    return;
  }

  // Mise à jour de l'état du chapitre
  const nouvelEtat = typeActionChapitre.value === 'activer' ? 'actif' : 'terminé';
  chaptersStore.updateChapter(chapitreIdAction.value, {
    ...chapitre,
    etat: nouvelEtat
  });

  messageRetour.value = `Chapitre ${typeActionChapitre.value === 'activer' ? 'activé' : 'complété'} avec succès`;
  chapitreIdAction.value = '';
  motDePasseChapitre.value = '';
  
  setTimeout(() => {
    messageRetour.value = '';
  }, 3000);
}

function actionQuete() {
  if (!queteIdAction.value) {
    messageRetour.value = 'Veuillez sélectionner une quête';
    return;
  }

  const quete = questsStore.findQuest(queteIdAction.value);
  if (!quete) {
    messageRetour.value = 'Quête non trouvée';
    return;
  }

  // Vérifier que la quête est dans le lieu actuel
  if (quete.lieu !== joueur.value.lieuId) {
    messageRetour.value = 'Cette quête n\'est pas disponible dans votre lieu actuel';
    return;
  }

  // Vérification du mot de passe
  const motDePasseAttendu = typeActionQuete.value === 'activer' 
    ? quete.motDePasseActivation 
    : quete.motDePasseCompletion;

  if (motDePasseQuete.value !== motDePasseAttendu) {
    messageRetour.value = 'Mot de passe incorrect';
    return;
  }

  // Mise à jour de l'état de la quête
  const nouvelEtat = typeActionQuete.value === 'activer' ? 'active' : 'terminée';
  questsStore.updateQuest(queteIdAction.value, {
    ...quete,
    etat: nouvelEtat
  });

  messageRetour.value = `Quête ${typeActionQuete.value === 'activer' ? 'activée' : 'complétée'} avec succès`;
  queteIdAction.value = '';
  motDePasseQuete.value = '';
  
  setTimeout(() => {
    messageRetour.value = '';
  }, 3000);
}
</script>

<template>
  <div>
    <h3>Actions du joueur</h3>

    <div v-if="!joueurId">
      <p>Sélectionnez un joueur pour effectuer des actions</p>
    </div>

    <div v-else>
      <div v-if="messageRetour">
        <p><strong>{{ messageRetour }}</strong></p>
      </div>

      <div>
        <h4>Se déplacer</h4>
        <p>Lieu actuel : <strong>{{ joueur?.lieuId || 'Non défini' }}</strong></p>
        <div>
          <label>Nouveau lieu :</label>
          <select v-model="lieuSelectionne">
            <option value="">-- Sélectionner un lieu --</option>
            <option v-for="lieu in lieux" :key="lieu.id" :value="lieu.nom">
              {{ lieu.nom }}
            </option>
          </select>
          <button @click="deplacerJoueur">Se déplacer</button>
        </div>
      </div>

      <div>
        <h4>Action sur un chapitre</h4>
        <div>
          <label>Type d'action :</label>
          <select v-model="typeActionChapitre">
            <option value="activer">Activer</option>
            <option value="completer">Compléter</option>
          </select>
        </div>
        <div>
          <label>Chapitre :</label>
          <select v-model="chapitreIdAction">
            <option value="">-- Sélectionner un chapitre --</option>
            <option v-for="chap in chapitres" :key="chap.id" :value="chap.id">
              {{ chap.nom }} ({{ chap.etat }})
            </option>
          </select>
        </div>
        <div>
          <label>Mot de passe :</label>
          <input v-model="motDePasseChapitre" type="password" placeholder="Mot de passe" />
        </div>
        <button @click="actionChapitre">
          {{ typeActionChapitre === 'activer' ? 'Activer' : 'Compléter' }} le chapitre
        </button>
      </div>

      <div>
        <h4>Action sur une quête (dans le lieu actuel)</h4>
        <p v-if="!joueur?.lieuId">Vous devez d'abord vous déplacer dans un lieu</p>
        <div v-else>
          <p>Quêtes disponibles dans <strong>{{ joueur.lieuId }}</strong> :</p>
          <div>
            <label>Type d'action :</label>
            <select v-model="typeActionQuete">
              <option value="activer">Activer</option>
              <option value="completer">Compléter</option>
            </select>
          </div>
          <div>
            <label>Quête :</label>
            <select v-model="queteIdAction">
              <option value="">-- Sélectionner une quête --</option>
              <option v-for="q in quetesDansLieu" :key="q.id" :value="q.id">
                {{ q.nom || q.name }} ({{ q.etat }})
              </option>
            </select>
          </div>
          <div>
            <label>Mot de passe :</label>
            <input v-model="motDePasseQuete" type="password" placeholder="Mot de passe" />
          </div>
          <button @click="actionQuete" :disabled="!joueur?.lieuId">
            {{ typeActionQuete === 'activer' ? 'Activer' : 'Compléter' }} la quête
          </button>
        </div>
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
  background-color: #ecf0f1;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  margin-bottom: 15px;
}

.action-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.message-retour {
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  font-weight: 600;
}

label {
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

select,
input {
  width: 100%;
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
  width: 100%;
}

p {
  margin: 10px 0;
}

p strong {
  color: #2c3e50;
}
</style>
