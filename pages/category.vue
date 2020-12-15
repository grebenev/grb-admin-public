<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <Form
        @emit-data="categories.push({ type: $event.category.type })"
        :config="formConfiguration"
        formName="Add new category"
      />

      <div v-for="category in categories" :key="category._id">
        {{ category.type }}
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { FormConfig } from '@/components/Form.vue';
import { AxiosResponse, AxiosPromise, AxiosError } from 'axios';

@Component
export default class Category extends Vue {
  header: string = 'Category page';
  messages: { message: string }[] = [];

  formConfiguration: FormConfig = {
    postApi: 'categories/category',
    inputs: {
      category: {
        name: 'Create a new caterory',
        value: '',
        placeholder: 'place a category',
      },
    },
  };

  asyncData({ $axios, error }: Context) {
    return $axios
      .get(`http://localhost:3000/api/categories`)
      .then((res) => {
        const { categories } = res.data;
        return {
          categories,
        };
      })
      .catch((err) => {
        error({
          statusCode: 404,
          message: `No items found - ${err.message}`,
        });
      });
  }
}
</script>
