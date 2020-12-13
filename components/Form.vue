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
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { AxiosResponse, AxiosPromise, AxiosError } from 'axios';
import { InputConfig } from '@/components/UI/InputUi.vue';
import { SelectConfig } from '@/components/UI/SelectUi.vue';

export interface FormConfig {
  dropzone?: boolean;
  postApi: string;
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
  messages: { message: string }[] = [];

  getFormData(expData: InputConfig | SelectConfig): EmittedData {
    let data: EmittedData = {};

    for (let key in expData) {
      data[key] = expData[key].value;
    }
    return data;
  }

  async onSubmit(): Promise<void> {
    const inputData = this.getFormData(this.inputData);
    const selectData = this.getFormData(this.selectData);

    await this.$axios
      .post(`http://localhost:3000/api/${this.$props.config.postApi}`, {
        ...inputData,
        ...selectData,
      })
      .then((res: AxiosResponse) => {
        this.messages = res.data.success;

        setTimeout(() => {
          this.$router.push('/');
        }, 3000);
      })
      .catch((err: AxiosError) => {
        this.messages = err.response?.data.errors;
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
