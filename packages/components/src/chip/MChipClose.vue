<template>
  <span class="m-chip-close">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        d="M764.288 214.592L512 466.88L259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512L214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
      ></path>
    </svg>
  </span>
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';

.m-chip-close {
  @include flex.center;
  border-radius: var(--m-border-radius);
  background-color: transparent;
  width: 1rem;

  & > svg {
    fill: currentColor;
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
