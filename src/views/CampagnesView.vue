<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import FormulaireCampagne from "../components/FormulaireCampagne.vue";
import TableCampagnes from "../components/TableCampagnes.vue";
import ControleMjPanel from "../components/ControleMjPanel.vue";
import { useCampaignsStore } from "../stores/campagnes";

const router = useRouter();
const campaignsStore = useCampaignsStore();
const editingCampaignId = ref(null);
const creating = ref(false);

const editingCampaign = computed(() =>
  editingCampaignId.value
    ? campaignsStore.trouverCampaign(editingCampaignId.value)
    : null
);

function creerCampagne() {
  creating.value = true;
  editingCampaignId.value = null;
}

function modifierCampagne(id) {
  editingCampaignId.value = id;
  creating.value = false;
}

function enregistrerCampagne(data) {
  if (!editingCampaignId.value) return;
  campaignsStore.modifierCampagne(editingCampaignId.value, data);
  if (data.etat === "active") {
    campaignsStore.setActiveCampaign(editingCampaignId.value);
  }
  editingCampaignId.value = null;
}

function ajouterCampagne(data) {
  const res = campaignsStore.ajouterCampagne(data);
  if (data.etat === "active" && res?.campagne?.id) {
    campaignsStore.setActiveCampaign(res.campagne.id);
  }
  creating.value = false;
}

function annulerEdition() {
  editingCampaignId.value = null;
  creating.value = false;
}

function supprimerCampagne(id) {
  if (!confirm("Supprimer cette campagne ?")) return;
  campaignsStore.supprimerCampagne(id);
  if (editingCampaignId.value === id) editingCampaignId.value = null;
}

function dupliquerCampagne(id) {
  campaignsStore.dupliquerCampagne(id);
}

function exporterCampagne(id) {
  campaignsStore.exporterCampagne(id);
}

async function importerCampagne(ev) {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  const res = await campaignsStore.importerCampagneDepuisFichier(file);
  ev.target.value = "";
  if (!res.success) alert("Import error: " + (res.error || "inconnu"));
}

function activerCampagne(id) {
  campaignsStore.setActiveCampaign(id);
  router.push({ name: "campagneactive" });
}
</script>

<template>
  <section>
    <h2>Gestion des campagnes</h2>

    <div class="toolbar">
      <button type="button" @click="creerCampagne">Ajouter une campagne</button>
      <label class="import-label">
        Importer (.cplc.json):
        <input
          type="file"
          accept=".json,.cplc.json"
          @change="importerCampagne"
        />
      </label>
    </div>

    <p v-if="campaignsStore.list.length === 0">Aucune campagne.</p>
    <TableCampagnes
      v-else
      :liste="campaignsStore.list"
      @modifier="modifierCampagne"
      @dupliquer="dupliquerCampagne"
      @supprimer="supprimerCampagne"
      @exporter="exporterCampagne"
      @activer="activerCampagne"
    />

    <FormulaireCampagne
      v-if="editingCampaign"
      mode="edit"
      :campaign="editingCampaign"
      @submit="enregistrerCampagne"
      @cancel="annulerEdition"
    />

    <FormulaireCampagne
      v-if="creating"
      mode="create"
      @submit="ajouterCampagne"
      @cancel="annulerEdition"
    />
  </section>
</template>

<style scoped>
section {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
}

h2 {
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #2774c8;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #1f5fa0;
}

.import-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.import-label input[type="file"] {
  font-size: 13px;
}
</style>
