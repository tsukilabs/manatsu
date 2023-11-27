<script setup lang="ts">
import MButton from './Button.vue';
</script>

<template>
  <MButton :class="$style['m-button-elevated']" type="button">
    <slot></slot>
  </MButton>
</template>

<style module lang="scss">
.m-button-elevated {
  width: 1200px;
}
</style>
