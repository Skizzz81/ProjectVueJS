<script setup>
const { liste } = defineProps({
  liste: { type: Array, required: true }
});

const emit = defineEmits(["modifier", "supprimer", "dupliquer"]);
</script>

<template>
  <table border="1">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Description</th>
        <th>Commentaire MJ</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="c in liste" :key="c.id">
        <td>{{ c.nom }}</td>
        <td>{{ c.description || "-" }}</td>
        <td>{{ c.commentaireMj || "-" }}</td>
        <td>
          <button type="button" @click="emit('modifier', c.id)">Modifier</button>
          <button type="button" @click="emit('dupliquer', c.id)">Dupliquer</button>
          <button type="button" @click="emit('supprimer', c.id)">Supprimer</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 8px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 6px 8px;
  text-align: left;
}

th {
  background: #f4f4f4;
}

button {
  margin-right: 6px;
}
</style>
