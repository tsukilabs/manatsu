<script setup lang="ts"></script>

<template>
  <button :class="$style['m-button']" type="button">
    <slot></slot>
  </button>
</template>

<style module lang="scss">
.m-button {
  border: none;
  font: inherit;
  color: inherit;
  background-color: transparent;

  text-align: center;
  padding: 1rem 2rem;
}
</style>
