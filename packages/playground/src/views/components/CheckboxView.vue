<script setup lang="ts">
const first = ref(false);
const second = ref('yes');
const third = ref(0);
const fourth = ref({ label: 'yes' });

const singleValues = computed(() => {
  const values = {
    first: first.value,
    second: second.value,
    third: third.value,
    fourth: fourth.value
  };

  return JSON.stringify(values, null, 2);
});

const fourthValues = {
  trueValue: { label: 'yes' },
  falseValue: { label: 'no' }
};

const group = ref(['label 1']);
</script>

<template>
  <div class="flex gap-4">
    <m-card variant="outlined" title="Single" class="w-max" header-style="padding-bottom: 0;">
      <div class="flex flex-col gap-4">
        <pre>{{ singleValues }}</pre>

        <div class="flex gap-4">
          <m-checkbox v-model="first">Label 1</m-checkbox>
          <m-checkbox v-model="second" true-value="yes" false-value="no">Label 2</m-checkbox>
          <m-checkbox v-model="third" :true-value="1" :false-value="0">Label 3</m-checkbox>
          <m-checkbox v-model="fourth" v-bind="fourthValues"> Label 4 </m-checkbox>
          <m-checkbox v-model="fourth" v-bind="fourthValues" disabled>Disabled</m-checkbox>
        </div>
      </div>
    </m-card>

    <m-card variant="outlined" title="Group" class="w-max" header-style="padding-bottom: 0;">
      <div class="flex flex-col gap-4">
        <pre>{{ JSON.stringify(group, null, 2) }}</pre>

        <div class="flex gap-4">
          <m-checkbox v-model="group" value="label 1">Label 1</m-checkbox>
          <m-checkbox v-model="group" :value="2">Label 2</m-checkbox>
          <m-checkbox v-model="group" :value="{ label: '3' }">Label 3</m-checkbox>
        </div>
      </div>
    </m-card>
  </div>
</template>
