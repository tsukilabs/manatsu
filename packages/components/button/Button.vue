<script setup lang="ts"></script>

<template>
  <button :class="$style['m-button']" type="button">
    <slot></slot>
  </button>
</template>

<style module lang="scss">
.m-button {
  width: var(--mana-button);
}
</style>
