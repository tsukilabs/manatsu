import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import MTable from './MTable.vue';
import MTableColumn from './MTableColumn.vue';
import MScaffold from '../scaffold/MScaffold.vue';

enableAutoUnmount(afterEach);

describe('table', () => {
  const columns = [
    { field: 'name', name: 'Name' },
    { field: 'age', name: 'Age' },
    { field: 'email', name: 'Email' }
  ];

  const rows = [
    { name: 'John', age: 30, email: 'john@example.com' },
    { name: 'Jane', age: 25, email: 'jane@example.com' },
    { name: 'Joe', age: 35, email: 'joe@example.com' }
  ];

  it('should render table headers', async () => {
    const wrapper = mount({
      components: { MScaffold, MTable, MTableColumn },
      template: `
        <m-scaffold>
          <m-table v-model="rows" :row-key="(row) => row.name">
            <m-table-column v-for="c in columns" :key="c.field" :field="c.field" :name="c.name" />
          </m-table>
        </m-scaffold>
      `,
      data() {
        return { columns, rows };
      }
    });

    expect(wrapper.findComponent(MTable).exists()).toBe(true);
    expect(wrapper.findAllComponents(MTableColumn)).toHaveLength(columns.length);

    await nextTick();

    const thElements = wrapper.findAll('th');
    expect(thElements).toHaveLength(columns.length);

    for (const [index, column] of columns.entries()) {
      expect(thElements[index].text()).toBe(column.name);
    }
  });

  it('should render table headers with custom slots', async () => {
    const wrapper = mount({
      components: { MScaffold, MTable, MTableColumn },
      template: `
        <m-scaffold>
          <m-table v-model="rows" :row-key="(row) => row.name">
            <m-table-column v-for="c in columns" :key="c.field" :field="c.field" :name="c.name">
              <template #header="{ column }">
                <span class="custom-header">{{ column.name }}</span>
              </template>
            </m-table-column>
          </m-table>
        </m-scaffold>
      `,
      data() {
        return { columns, rows };
      }
    });

    await nextTick();

    const thElements = wrapper.findAll('th');
    expect(thElements).toHaveLength(columns.length);

    for (const [index, column] of columns.entries()) {
      expect(thElements[index].find('.custom-header').text()).toBe(column.name);
    }
  });

  it('should render table rows', async () => {
    const wrapper = mount({
      components: { MScaffold, MTable, MTableColumn },
      template: `
        <m-scaffold>
          <m-table v-model="rows" :row-key="(row) => row.name">
            <m-table-column v-for="c in columns" :key="c.field" :field="c.field" :name="c.name" />
          </m-table>
        </m-scaffold>
      `,
      data() {
        return { columns, rows };
      }
    });

    await nextTick();

    const tdElements = wrapper.findAll('td');
    expect(tdElements).toHaveLength(columns.length * rows.length);

    for (const [rowIndex, row] of rows.entries()) {
      for (const [columnIndex, column] of columns.entries()) {
        const cellIndex = rowIndex * columns.length + columnIndex;
        expect(tdElements[cellIndex].text()).toBe(String((row as any)[column.field]));
      }
    }
  });

  it('should render table rows with custom slots', async () => {
    const wrapper = mount({
      components: { MScaffold, MTable, MTableColumn },
      template: `
        <m-scaffold>
          <m-table v-model="rows" :row-key="(row) => row.name">
            <m-table-column v-for="c in columns" :key="c.field" :field="c.field" :name="c.name">
              <template #body="{ row }">
                <span class="custom-cell">{{ row[c.field] }}</span>
              </template>
            </m-table-column>
          </m-table>
        </m-scaffold>
      `,
      data() {
        return { columns, rows };
      }
    });

    await nextTick();

    const tdElements = wrapper.findAll('td');
    expect(tdElements).toHaveLength(columns.length * rows.length);

    for (const [rowIndex, row] of rows.entries()) {
      for (const [columnIndex, column] of columns.entries()) {
        const cellIndex = rowIndex * columns.length + columnIndex;
        expect(tdElements[cellIndex].find('.custom-cell').text()).toBe(
          String((row as any)[column.field])
        );
      }
    }
  });
});
