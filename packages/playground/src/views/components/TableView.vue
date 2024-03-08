<script setup lang="ts">
import { shallowRef } from 'vue';
import type { ColumnSortFn } from 'manatsu/src/index.ts';

interface Row {
  age: number;
  email: { address: string };
  id: number;
  name: [symbol, string[]];
}

const rows = shallowRef(generateRows(100));

function generateRows(amount: number) {
  const newRows: Row[] = [];
  const hiragana = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'];
  const random = () => Math.floor(Math.random() * hiragana.length);

  for (let i = 0; i < amount; i++) {
    const name = [hiragana[random()], hiragana[random()], hiragana[random()]];
    const address = `${crypto.randomUUID().slice(0, 8)}@example.com`;
    newRows.push({
      id: i + 1,
      name: [Symbol(), name],
      age: amount - i,
      email: { address }
    });
  }

  return newRows;
}

const sortName: ColumnSortFn = (a: Row, b: Row, compare) => {
  return compare(a.name[1].join(''), b.name[1].join(''));
};
</script>

<template>
  <m-table
    v-model="rows"
    :row-key="(row) => row.id"
    sort-field="email.address"
    @row-click="console.log('row-click', $event)"
    @row-dblclick="console.log('row-dbclick', $event)"
  >
    <m-table-column field="id" name="ID" />
    <m-table-column field="name" name="Name" :sort-fn="sortName">
      <template #header="{ column }">
        <span>{{ column.name }}</span>
      </template>

      <template #body="{ row }: { row: Row }">
        <span>{{ row.name[1].join('') }}</span>
      </template>
    </m-table-column>
    <m-table-column field="age" name="Age" />
    <m-table-column field="email.address" name="Email" />
  </m-table>
</template>
