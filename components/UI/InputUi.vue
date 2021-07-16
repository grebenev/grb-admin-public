<template>
  <div>
    <label class="label">
      <slot />

      <textarea
        class="textarea"
        v-if="config.control === 'textarea'"
        v-bind="$attrs"
        @input="$emit('input', $event.target.value)"
      ></textarea>

      <input
        class="input"
        v-else
        v-bind="$attrs"
        @input="$emit('input', $event.target.value)"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

export interface InputConfig {
  [key: string]: {
    name?: string;
    control?: string;
    placeholder?: string;
    type?: string;
    value: string | number;
  };
}

@Component
export default class InputUi extends Vue {
  @Prop({ type: Object })
  readonly config!: InputConfig;
}
</script>
<style lang="scss">
.label {
  display: flex;
  flex-direction: column;
  color: $dark;
}

.input,
.textarea {
  display: block;
  width: 100%;
  // height: 45px;
  margin-top: 10px;
  padding: 13px 15px;

  @include font('', 16px, 22px);
  border: solid 1px $gray;
  resize: none;

  &::placeholder {
    text-indent: 0;
    transition: text-indent 0.3s ease;
  }

  &:hover,
  &:focus {
    outline: 0;
    border: solid 1px $gray;
  }

  &:focus::placeholder,
  &:hover::placeholder {
    text-indent: -200px;
    transition: text-indent 0.3s ease;
  }
}
.textarea {
  resize: vertical;
}
.input--footer {
  padding: 13px 40px 13px 20px;
  color: $light;
  background-color: $blue;
  border: 1px solid $gray;

  &:hover,
  &:focus {
    outline: 0;
    border: 1px dashed $gray;
  }

  &::placeholder {
    color: $light;
  }
}
.invalid .input,
.invalid .textarea {
  border: dashed 1px red;
}
</style>
