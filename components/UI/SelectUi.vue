<template>
  <div class="select">
    <select class="select__list" @change="$emit('input', $event.target.value)">
      <slot />
      <option
        class="select__item"
        v-for="(option, index) in config.options"
        :selected="option.selected"
        :value="option.value"
        :key="index"
      >
        {{ option.name }}
      </option>
    </select>
    <div class="select__arrow"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

export interface SelectConfig {
  [key: string]: {
    options: { name: string; value: string; selected?: string }[];
    value: string;
  };
}

@Component
export default class SelectUi extends Vue {
  @Prop({ type: Object })
  readonly config!: SelectConfig;
}
</script>

<style lang="scss">
.select {
  position: relative;

  &__list {
    // min-width: 180px;
    width: 100%;
    padding: 6px 30px 6px 10px;
    background-color: $blue;
    border-radius: 20px;
    color: $light;
    font: inherit;

    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    &::-ms-expand {
      display: none;
    }

    &:hover,
    &:focus {
      background-color: $gray;
      box-shadow: 0px 10px 10px 0 rgba(0, 0, 0, 0.2);
    }

    &:active {
      box-shadow: inset 0 2px 2px $dark;
    }

    &:hover + .select__arrow {
      border-top: 10px solid $blue;
    }
  }

  &__item {
    // background-color: $light;
  }

  &__arrow {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 8px;
    height: 10px;
    border-top: 10px solid $light;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 0;
    pointer-events: none;
  }
}

.invalid .select__list {
  box-shadow: 0 0 0 1.5px red;
}
</style>
