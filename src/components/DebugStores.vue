<script setup>
import { useCampaignsStore } from "../stores/campagnes";
import { useChaptersStore } from "../stores/chapitres";
import { usePlayersStore } from "../stores/joueurs";
import { usePlacesStore } from "../stores/lieux";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";
import { useQuestsStore } from "../stores/quest";

const campaignsStore = useCampaignsStore();
const chaptersStore = useChaptersStore();
const playersStore = usePlayersStore();
const placesStore = usePlacesStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();
const questsStore = useQuestsStore();
</script>

<template>
  <section>
    <h3>Campagnes</h3>
    <pre>{{ JSON.stringify(campaignsStore.list, null, 2) }}</pre>

    <h3>Chapitres</h3>
    <pre>{{ JSON.stringify(chaptersStore.list, null, 2) }}</pre>

    <h3>Quetes</h3>
    <pre>{{ JSON.stringify(questsStore.list, null, 2) }}</pre>

    <h3>Joueurs</h3>
    <pre>{{ JSON.stringify(playersStore.list, null, 2) }}</pre>

    <h3>Lieux</h3>
    <pre>{{ JSON.stringify(placesStore.list, null, 2) }}</pre>

    <h3>Objets</h3>
    <pre>{{ JSON.stringify(itemsStore.list, null, 2) }}</pre>

    <h3>Indices</h3>
    <pre>{{ JSON.stringify(cluesStore.list, null, 2) }}</pre>
  </section>
</template>
