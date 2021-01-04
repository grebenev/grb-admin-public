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

      <div v-if="messages">
        <div v-for="(message, index) in messages" :key="index">
          MESSAGE: {{ message.message }}
        </div>
      </div>

      <ButtonUi>Submit</ButtonUi>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator';
import { AxiosResponse, AxiosPromise, AxiosError } from 'axios';
import { InputConfig } from '@/components/UI/InputUi.vue';
import { SelectConfig } from '@/components/UI/SelectUi.vue';

interface EmittedData {
  [key: string]: string | number;
}

export interface FormConfig {
  api: string;
  id?: string;
  inputs: InputConfig;
  selects?: SelectConfig;
}

interface FormComponent {
  inputData: InputConfig;
  selectData: SelectConfig;
  messages: { message: string }[];

  getFormData(expData: InputConfig | SelectConfig): EmittedData;
  emitData(data: AxiosResponse): AxiosResponse;
  clearForm(inputs: InputConfig): void;
  onSubmit(): Promise<void | AxiosPromise>;
  onRequest(data: any): AxiosPromise;
}

@Component
export default class Form extends Vue implements FormComponent {
  @Prop({ type: Object })
  readonly config!: FormConfig;

  @Prop({ type: String, default: 'Форма' })
  formName!: string;

  inputData: InputConfig = {};
  selectData: SelectConfig = {};
  messages: { message: string }[] = [];

  getFormData(expData: InputConfig | SelectConfig): EmittedData {
    let data: EmittedData = {};

    for (let key in expData) {
      data[key] = expData[key].value;
    }
    return data;
  }

  @Emit()
  emitData(data: AxiosResponse): AxiosResponse {
    return data;
  }

  clearForm(inputs: InputConfig) {
    for (let key in inputs) {
      if (typeof inputs[key].value === 'string') {
        inputs[key].value = '';
      } else {
        inputs[key].value = 0;
      }
    }
  }

  onRequest(): AxiosPromise {
    const inputData = this.getFormData(this.inputData);
    const selectData = this.getFormData(this.selectData);
    const { api, id } = this.$props.config;

    let result = !id
      ? this.$axios.post(`http://localhost:3000/api/${api}`, {
          ...inputData,
          ...selectData,
        })
      : this.$axios.put(`http://localhost:3000/api/${api}/${id}`, {
          ...inputData,
          ...selectData,
        });

    return result;
  }

  async onSubmit(): Promise<void | AxiosPromise> {
    await this.onRequest()
      .then((res: AxiosResponse) => {
        this.messages = res.data.success;
        //  this.$router.push('/');

        this.emitData(res.data); // emmit response object to parent

        this.clearForm(this.inputData);
      })
      .catch((err: AxiosError) => {
        this.messages = err.response ? err.response.data.errors : [];
      });
  }

  created() {
    if (!this.$props.config.inputs) return;
    this.inputData = this.$props.config.inputs;

    if (!this.$props.config.selects) return;
    this.selectData = this.$props.config.selects;
  }
}
</script>
