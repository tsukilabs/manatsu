<script setup lang="ts"></script>

<template>
  <button type="button" class="m-button-filled">
    <span class="m-button-content">
      <slot></slot>
    </span>
  </button>
</template>

<style lang="scss">
.m-button .m-button-filled {
  border-radius: var(--mana-button-border-radius);
  background-color: var(--mana-color-primary);
  color: var(--mana-color-on-primary);

  transition: {
    property: filter, transform;
    duration: 0.2s;
    timing-function: ease-in-out;
  }

  &:hover {
    filter: contrast(150%);
  }

  &:active {
    filter: contrast(90%);
  }
}
</style>
