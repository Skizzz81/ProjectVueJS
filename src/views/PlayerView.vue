<script setup>
import { computed } from "vue";
import { useCampaignsStore } from "../stores/campagnes";

const campaignsStore = useCampaignsStore();

const campagneActive = computed(() => {
  const activeCampaignId = campaignsStore.activeCampaignId;
  if (!activeCampaignId) return null;
  return campaignsStore.trouverCampaign(activeCampaignId);
});
</script>

<template>
  <div>
    <h1>Interface Joueur</h1>
    
    <div v-if="!campagneActive">
      <p>Aucune campagne active</p>
    </div>

    <div v-else>
      <p><strong>Campagne active :</strong> {{ campagneActive.nom }}</p>
      
      <nav>
        <h2>Navigation</h2>
        <ul>
          <li><router-link to="/joueur/progression">Progression globale</router-link></li>
          <li><router-link to="/joueur/inventaire">Inventaire</router-link></li>
          <li><router-link to="/joueur/actions">Actions</router-link></li>
        </ul>
      </nav>

      <p>Sélectionnez une section ci-dessus pour commencer</p>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 30px;
}

p {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

p strong {
  color: #3498db;
}

nav {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

nav h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #2c3e50;
}

nav ul {
  list-style: none;
}

nav li {
  margin-bottom: 15px;
}

nav a {
  display: block;
  padding: 15px 20px;
  background-color: #e3f2fd;
  border-radius: 8px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 600;
  border-left: 4px solid #3498db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav a.router-link-active {
  background-color: #3498db;
  color: white;
  border-left-color: #2980b9;
}

.no-campaign {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
