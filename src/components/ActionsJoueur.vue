<script setup>
import { ref, computed } from "vue";
import { usePlayersStore } from "../stores/joueurs";
import { useChaptersStore } from "../stores/chapitres";
import { useQuestsStore } from "../stores/quest";
import { usePlacesStore } from "../stores/lieux";
import { useCampaignsStore } from "../stores/campagnes";

const playersStore = usePlayersStore();
const chaptersStore = useChaptersStore();
const questsStore = useQuestsStore();
const lieuxStore = usePlacesStore();
const campaignsStore = useCampaignsStore();

const props = defineProps({
  joueurId: {
    type: [String, Number],
    required: true
  }
});

const joueur = computed(() => playersStore.trouverJoueur(props.joueurId));

const lieuSelectionne = ref("");
const chapitreIdAction = ref("");
const motDePasseChapitre = ref("");
const queteIdAction = ref("");
const motDePasseQuete = ref("");
const typeActionChapitre = ref("activer");
const typeActionQuete = ref("activer");

const messageRetour = ref("");

const campagneActive = computed(() => {
  const id = campaignsStore.activeCampaignId?.value ?? campaignsStore.activeCampaignId;
  return campaignsStore.list.find((campagne) => String(campagne.id) === String(id));
});

const joueurDansCampagne = computed(() => {
  if (!campagneActive.value) return false;
  return (campagneActive.value.joueurIds || []).some(
    (id) => String(id) === String(props.joueurId)
  );
});

const lieux = computed(() => lieuxStore.list);

const chapitres = computed(() => {
  if (!campagneActive.value) return [];
  const ids = (campagneActive.value.chapitreIds || []).map((id) => String(id));
  return chaptersStore.list.filter((chap) => ids.includes(String(chap.id)));
});

const queteIdsCampagne = computed(() => {
  const ids = new Set();
  chapitres.value.forEach((chap) => {
    (chap.queteIds || []).forEach((id) => ids.add(String(id)));
  });
  return ids;
});

const lieuActuel = computed(() => {
  if (!joueur.value || !joueur.value.lieuId) return null;
  return lieuxStore.trouverLieu(joueur.value.lieuId);
});

const quetesDansLieu = computed(() => {
  if (!campagneActive.value || !joueur.value || !joueur.value.lieuId) return [];
  const lieuNom = lieuActuel.value?.nom;
  return questsStore.list.filter((quete) => {
    if (!queteIdsCampagne.value.has(String(quete.id))) return false;
    return (
      quete.lieu === joueur.value.lieuId ||
      String(quete.lieu) === String(joueur.value.lieuId) ||
      (lieuNom && quete.lieu === lieuNom)
    );
  });
});

function deplacerJoueur() {
  if (!lieuSelectionne.value) {
    messageRetour.value = 'Veuillez sélectionner un lieu';
    return;
  }

  let lieuId = lieuSelectionne.value;
  if (!isNaN(lieuId) && !isNaN(parseFloat(lieuId))) {
    lieuId = Number(lieuId);
  }

  const lieu = lieuxStore.trouverLieu(lieuId);

  playersStore.modifierJoueur(props.joueurId, {
    lieuId: lieuId
  });

  messageRetour.value = `Joueur déplacé vers : ${lieu?.nom || lieuId}`;
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

  const motDePasseAttendu = typeActionChapitre.value === "activer"
    ? chapitre.motPasseActivation
    : chapitre.motPasseResolution;

  if (motDePasseChapitre.value !== motDePasseAttendu) {
    messageRetour.value = "Mot de passe incorrect";
    return;
  }

  const nouvelEtat = typeActionChapitre.value === "activer" ? "actif" : "termine";
  chaptersStore.modifierChapitre(chapitreIdAction.value, { etat: nouvelEtat });

  messageRetour.value = `Chapitre ${typeActionChapitre.value === "activer" ? "active" : "complete"} avec succes`;
  chapitreIdAction.value = "";
  motDePasseChapitre.value = "";

  setTimeout(() => {
    messageRetour.value = "";
  }, 3000);
}

function actionQuete() {
  if (!queteIdAction.value) {
    messageRetour.value = "Veuillez selectionner une quete";
    return;
  }

  const quete = questsStore.findQuest(queteIdAction.value);
  if (!quete) {
    messageRetour.value = "Quete non trouvee";
    return;
  }

  const lieuNom = lieuActuel.value?.nom;
  const queteDansLieu =
    quete.lieu === joueur.value.lieuId ||
    String(quete.lieu) === String(joueur.value.lieuId) ||
    (lieuNom && quete.lieu === lieuNom);
  if (!queteDansLieu) {
    messageRetour.value = "Cette quete n'est pas disponible dans le lieu actuel";
    return;
  }

  if (typeActionQuete.value === "completer" && quete.motDePasseResolution) {
    if (motDePasseQuete.value !== quete.motDePasseResolution) {
      messageRetour.value = "Mot de passe incorrect";
      return;
    }
  }

  const nouvelEtat = typeActionQuete.value === "activer" ? "active" : "termine";
  const resultat = questsStore.modifierQuete(queteIdAction.value, { etat: nouvelEtat });
  if (!resultat?.success) {
    messageRetour.value = "Etat invalide pour la quete";
    return;
  }

  messageRetour.value = `Quete ${typeActionQuete.value === "activer" ? "activee" : "completee"} avec succes`;
  queteIdAction.value = "";
  motDePasseQuete.value = "";

  setTimeout(() => {
    messageRetour.value = "";
  }, 3000);
}
</script>

<template>
  <div>
    <h3>Actions du joueur</h3>

    <div v-if="!joueurId">
      <p>Selectionnez un joueur pour effectuer des actions</p>
    </div>

    <div v-else-if="!campagneActive">
      <p>Aucune campagne active.</p>
    </div>

    <div v-else-if="!joueurDansCampagne">

      <p>Ce joueur n'appartient pas a la campagne active.</p>
    </div>

    <div v-else>
      <div v-if="messageRetour">
        <p><strong>{{ messageRetour }}</strong></p>
      </div>

      <div>
        <h4>Se déplacer</h4>
        <p>Lieu actuel : <strong>{{ lieuActuel?.nom || 'Non défini' }}</strong></p>
        <div>
          <label>Nouveau lieu :</label>
          <select v-model="lieuSelectionne">



            <option value="">-- Selectionner un lieu --</option>
            <option v-for="lieu in lieux" :key="lieu.id" :value="lieu.id">
              {{ lieu.nom }}
            </option>
          </select>

          <button @click="deplacerJoueur">Se deplacer</button>
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
            <option value="">-- Selectionner un chapitre --</option>
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
          {{ typeActionChapitre === "activer" ? "Activer" : "Completer" }} le chapitre
        </button>
      </div>

      <div>
        <h4>Action sur une quete (dans le lieu actuel)</h4>
        <p v-if="!joueur?.lieuId">Vous devez d'abord vous deplacer dans un lieu</p>
        <div v-else>
          <p>Quetes disponibles dans <strong>{{ lieuActuel?.nom || joueur.lieuId }}</strong> :</p>
          <div>
            <label>Type d'action :</label>
            <select v-model="typeActionQuete">
              <option value="activer">Activer</option>
              <option value="completer">Completer</option>
            </select>
          </div>
          <div>
            <label>Quete :</label>
            <select v-model="queteIdAction">
              <option value="">-- Selectionner une quete --</option>
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
            {{ typeActionQuete === "activer" ? "Activer" : "Completer" }} la quete
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

