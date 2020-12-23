<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <Form
        @emit-data="categories.push($event.category)"
        :config="formConfiguration"
        formName="Add new category"
      />

      <List :list="categories" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { AxiosResponse, AxiosError } from 'axios';

import { FormConfig } from '@/components/Form.vue';
import { types } from 'node-sass';

type Category = {
  _id: string;
  name: string;
};

interface Categories {
  header: string;
  messages: { message: string }[];
  formConfiguration: FormConfig;

  asyncData({
    $axios,
    error,
  }: Context): Promise<void | { categories: Category[] }>;
}

@Component
export default class CategoriesPage extends Vue implements Categories {
  header = 'Category page';
  messages = [];

  formConfiguration = {
    dropzone: false,
    api: 'categories/category',

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
      .then((res: AxiosResponse) => {
        const { categories } = res.data;
        return {
          categories,
        };
      })
      .catch((err: AxiosError) => {
        error({
          statusCode: 404,
          message: `No items found - ${err.message}`,
        });
      });
  }
}
</script>
