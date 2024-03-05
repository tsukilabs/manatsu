<script setup lang="ts">
import { ref } from 'vue';

interface Row {
  age: number;
  email: string;
  id: number;
  name: string;
}

const rows = ref(generateRows(100));

function generateRows(amount: number) {
  const newRows: Row[] = [];
  for (let i = 0; i < amount; i++) {
    const name = `name${Math.floor(Math.random() * 100) + 1}`;
    newRows.push({
      id: i + 1,
      name,
      age: amount - i,
      email: `${name}@example.com`
    });
  }

  return newRows;
}
</script>

<template>
  <m-table v-model="rows" :row-key="(row) => row.id" sort-field="age">
    <m-table-column field="id" name="ID" />
    <m-table-column field="name" name="Name" />
    <m-table-column field="age" name="Age" />

    <m-table-column field="email" name="Email">
      <template #header="{ column }">
        <span>{{ column.name }}</span>
      </template>

      <template #body="{ row }: { row: Row }">
        <a href="example.com">{{ row.email }}</a>
      </template>
    </m-table-column>
  </m-table>
</template>
