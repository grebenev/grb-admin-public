<template>
  <button :class="['button', buttonStyle]" v-bind="$attrs" v-on="$listeners">
    <slot />
  </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component
export default class ButtonUi extends Vue {
  @Prop({ type: String })
  readonly buttonStyle!: string;
}
</script>

<style lang="scss">
.button {
  outline: none;
  padding: 14px 28px;
  @include font('Blogger Sans-Medium', 15px, 16px);
  text-transform: uppercase;
  color: $light;
  background-color: $blue;
  border: 1px solid transparent;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: $gray;
    box-shadow: 0px 10px 10px 0 rgba(0, 0, 0, 0.2);
  }

  &:active {
    box-shadow: inset 0 2px 2px $dark;
  }
}
</style>
