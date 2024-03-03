<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-8">
    <m-toolbar end-class="flex gap-4">
      <template #start>
        <m-dynamic-link to="/">Home</m-dynamic-link>
      </template>

      <template #center>
        <span>Toolbar with border</span>
      </template>

      <template #end>
        <m-button>Foo</m-button>
        <m-button>Bar</m-button>
      </template>
    </m-toolbar>

    <m-toolbar :border="false" end-class="flex gap-4">
      <template #start>
        <m-dynamic-link to="/">Home</m-dynamic-link>
      </template>

      <template #center>
        <span>Toolbar without border</span>
      </template>

      <template #end>
        <m-button>Foo</m-button>
        <m-button>Bar</m-button>
      </template>
    </m-toolbar>
  </div>
</template>
