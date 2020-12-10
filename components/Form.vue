<template>
  <section>
    <h1>{{ formName }}</h1>
    <form @submit.prevent="onSubmit">
      <div v-for="select in Object.keys(selectData)" :key="select">
        Choose {{ select }}
        <SelectUi
          :config="selectData[select]"
          v-model="selectData[select].value"
        />
      </div>

      <div v-for="(input, index) in Object.keys(inputData)" :key="index">
        <InputUi
          v-model="inputData[input].value"
          :placeholder="inputData[input].placeholder"
          :type="inputData[input].type"
          :config="{ control: inputData[input].control }"
          >{{ inputData[input].name ? inputData[input].name : input }}
        </InputUi>
      </div>

      <div v-if="config.dropzone">
        <Dropzone />
      </div>

      <ButtonUi>Submit</ButtonUi>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator';

import { InputConfig } from '@/components/UI/InputUi.vue';
import { SelectConfig } from '@/components/UI/SelectUi.vue';

export interface FormConfig {
  dropzone?: boolean;
  inputs: InputConfig;
  selects?: SelectConfig;
}

interface EmittedData {
  [key: string]: string | undefined;
}

@Component
export default class Form extends Vue {
  @Prop({ type: Object })
  readonly config!: FormConfig;

  @Prop({ type: String, default: 'Форма' })
  formName!: string;

  inputData: InputConfig = {};
  selectData: SelectConfig = {};

  getFormData(expData: InputConfig | SelectConfig): EmittedData {
    let data: EmittedData = {};

    for (let key in expData) {
      data[key] = expData[key].value;
    }
    return data;
  }

  @Emit()
  onSubmit(): EmittedData {
    const inputData = this.getFormData(this.inputData);
    const selectData = this.getFormData(this.selectData);

    return { ...inputData, ...selectData };
  }

  created() {
    if (!this.$props.config.inputs) return;
    this.inputData = this.$props.config.inputs;

    if (!this.$props.config.selects) return;
    this.selectData = this.$props.config.selects;
  }
}
</script>
