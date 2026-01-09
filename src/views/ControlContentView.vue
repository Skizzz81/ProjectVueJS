<script setup>
import { computed, ref } from "vue";
import ContentTable from "../components/ContentTable.vue";
import ContentForm from "../components/ContentForm.vue";
import { useCluesStore } from "../stores/indices";
import { useItemsStore } from "../stores/objets";
import { usePlacesStore } from "../stores/lieux";

const lieuxStore = usePlacesStore();
const objetsStore = useItemsStore();
const indicesStore = useCluesStore();

const creating = ref(false);
const editingContentId = ref(null);
const typeSelection = ref("objets");

const  editingContent = computed(() => {
  if (!editingContentId.value) return null;
  if (typeSelection.value === "objets") {
    return objetsStore.trouverObjet(editingContentId.value);
  } else if (typeSelection.value === "lieux") {
    return lieuxStore.trouverLieu(editingContentId.value);
  } else if (typeSelection.value === "indices") {
    return indicesStore.trouverIndice(editingContentId.value);
  }
  return null;
});

const listeCourante = computed(() => {
  if (typeSelection.value === "objets") return objetsStore.list;
  if (typeSelection.value === "lieux") return lieuxStore.list;
  if (typeSelection.value === "indices")return indicesStore.list;
});

function creerContenu() {
  creating.value = true;
  editingContentId.value = null;
}


function ajouterContenu(data) {
  if (typeSelection.value === "objets") {
    objetsStore.ajouterObjet(data);
  } else if (typeSelection.value === "lieux") {
    lieuxStore.ajouterLieu(data);
  } else if (typeSelection.value === "indices") {
    indicesStore.ajouterIndice(data);
  }
  creating.value = false;
}




function enregistrerContenu(data) {
  if (!editingContentId.value) return;
  if (typeSelection.value === "objets") {
    objetsStore.modifierObjet(editingContentId.value, data);
  } else if (typeSelection.value === "lieux") {
    lieuxStore.modifierLieu(editingContentId.value, data);
  } else if (typeSelection.value === "indices") {
    indicesStore.modifierIndice(editingContentId.value, data);
  }
  editingContentId.value = null;
}


function modifierContenu(id) {
  editingContentId.value = id;
  creating.value = false;
}

function supprimerContenu(id) {
  if (!confirm("Supprimer ce contenu ?")) return;
  if (typeSelection.value === "objets") {
    objetsStore.supprimerObjet(id);
  } else if (typeSelection.value === "lieux") {
    lieuxStore.supprimerLieu(id);
  } else if (typeSelection.value === "indices") {
    indicesStore.supprimerIndice(id);
  }
  if (editingContentId.value === id) editingContentId.value = null;
}

function dupliquerContenu(id) {
  if (typeSelection.value === "objets") {
    objetsStore.dupliquerObjet(id);
  } else if (typeSelection.value === "lieux") {
    lieuxStore.dupliquerLieu(id);
  } else if (typeSelection.value === "indices") {
    indicesStore.dupliquerIndice(id);
  }
}

function annulerEdition() {
  editingContentId.value = null;
  creating.value = false;
}

</script>

<template>
  <section>
    <h2>Controle des contenus (objets / lieux / indices)</h2>


    <select v-model="typeSelection">
      <option value="objets">Objets</option>
      <option value="lieux">Lieux</option>
      <option value="indices">Indices</option>
    </select>
     <button type="button" @click="creerContenu">Ajouter un contenu</button>

     <p v-if="listeCourante.length === 0">Aucun contenu.</p>
     <ContentTable 
        v-else
       :liste="listeCourante" 
       @modifier="modifierContenu"
       @supprimer="supprimerContenu"
       @dupliquer="dupliquerContenu"
     />

     <ContentForm 
       v-if="creating"
       mode="create"
       @submit="ajouterContenu"
       @cancel="annulerEdition"/>

       <ContentForm 
       v-if="editingContent"
        mode="edit"
        :contenu="editingContent"
        @submit="enregistrerContenu"
        @cancel="annulerEdition"/>

  </section>
</template>

<style scoped>
section {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
}

h2 {
  margin-bottom: 8px;
}

button {
  margin-top: 6px;
}
</style>
