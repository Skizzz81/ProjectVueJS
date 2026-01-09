<script setup>
</script>

<template>
  <section>
    <h2>Mode MJ</h2>
    <p>Bienvenue dans notre application de gestion de campagne de jeu de role !</p>

    <div class="cards">
      <RouterLink class="card" :to="{ name: 'campagnes' }">
        <h3>Gestion des campagnes</h3>
        <p>Creer, modifier, importer/exporter et controler les campagnes.</p>
      </RouterLink>
      <RouterLink class="card" :to="{ name: 'players' }">
        <h3>Controle des joueurs</h3>
        <p>Creer, modifier, dupliquer et supprimer les joueurs.</p>
      </RouterLink>
    </div>

    <div class="cards">
      <RouterLink class="card" :to="{ name: 'chapitres' }">
        <h3>Controle des chapitres</h3>
        <p>Creer, modifier, dupliquer et supprimer les chapitres.</p>
      </RouterLink>

      <RouterLink class="card" :to="{ name: 'quetes' }">
        <h3>Controle des quetes</h3>
        <p>Creer, modifier, dupliquer et supprimer les quetes.</p>
      </RouterLink>

      <RouterLink class="card" :to="{ name: 'content' }">
        <h3>Controle des contenus</h3>
        <p>Creer, modifier, dupliquer et supprimer un contenu (objets, indices, lieux).</p>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
section {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
}

h2,
h3 {
  margin-bottom: 8px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.card {
  display: block;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  text-decoration: none;
  color: inherit;
  background: #fafafa;
}

.card:hover {
  background: #f2f2f2;
}
</style>
