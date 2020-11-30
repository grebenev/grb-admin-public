<template>
  <section>
    <h1>{{ formName }}</h1>
    <form @submit.prevent="onSubmit">
      <section v-for="select in Object.keys(selectData)" :key="select">
        Choose {{ select }}
        <SelectUi
          :config="selectData[select]"
          v-model="selectData[select].value"
        />
      </section>

      <div
        v-for="(input, index) in Object.keys(this.config.inputs)"
        :key="index"
      >
        <InputUi
          v-model="inputData[input].value"
          :placeholder="inputData[input].placeholder"
          :type="inputData[input].type"
          :config="{ control: inputData[input].control }"
          >{{ inputData[input].name ? inputData[input].name : input }}
        </InputUi>
      </div>

      <Dropzone />

      <ButtonUi>Submit</ButtonUi>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import ButtonUi from '@/components/UI/ButtonUi.vue';
import Dropzone from '@/components/Dropzone.vue';

import InputUi, { InputConfig } from '@/components/UI/InputUi.vue';
import SelectUi, { SelectConfig } from '@/components/UI/SelectUi.vue';

export interface FormConfig {
  inputs: InputConfig;
  selects: SelectConfig;
}

interface EmittedData {
  [key: string]: string | undefined;
}

@Component({
  components: {
    ButtonUi,
    InputUi,
    Dropzone,
  },
})
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

  onSubmit() {
    if (!this.inputData) {
      return;
    }

    const inputData = this.getFormData(this.inputData);
    const selectData = this.getFormData(this.selectData);

    this.$emit('onSubmit', { ...inputData, ...selectData });
  }

  created() {
    this.inputData = this.$props.config.inputs;
    this.selectData = this.$props.config.selects;
  }
}
</script>
