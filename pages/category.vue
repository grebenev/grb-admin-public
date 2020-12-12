<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <section>
        <Form
          @on-submit="onSubmit($event)"
          :config="formConfiguration"
          formName="Add new category"
        />
      </section>

      <div v-if="messages">
        <div v-for="(message, index) in messages" :key="index">
          MESSAGE: {{ message.message }}
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import { FormConfig } from '@/components/Form.vue';
import { AxiosResponse, AxiosPromise, AxiosError } from 'axios';

@Component
export default class Category extends Vue {
  header: string = 'Category page';
  messages: { message: string }[] = [];

  formConfiguration: FormConfig = {
    inputs: {
      category: {
        name: 'Create a new caterory',
        value: '',
        placeholder: 'place a category',
      },
    },
  };

  async onSubmit(formData: {}): Promise<void> {
    await this.$axios
      .post('http://localhost:3000/api/categories/category', formData)

      .then((res: AxiosResponse) => {
        this.messages = res.data.success;

        this.$router.push('/');
      })
      .catch((err: AxiosError) => {
        this.messages = err.response?.data.errors;
      });
  }
}
</script>
