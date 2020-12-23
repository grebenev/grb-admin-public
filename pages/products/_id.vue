<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <Form :config="formConfiguration" formName="Edit product" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { AxiosResponse, AxiosError } from 'axios';

import { FormConfig } from '@/components/Form.vue';
import { formatOptions } from '@/plugins/formatOptions';

interface Product {
  header: string;
  asyncData({
    $axios,
    error,
  }: Context): Promise<void | { formConfiguration: FormConfig }>;
}

@Component
export default class ProductEditPage extends Vue implements Product {
  header = 'Product edit page';

  asyncData({ $axios, params }: Context) {
    return Promise.all([
      $axios.get(`http://localhost:3000/api/categories`),
      $axios.get(`http://localhost:3000/api/owners`),
      $axios.get(`http://localhost:3000/api/products/${params.id}`),
    ]).then(([...args]: AxiosResponse[]) => {
      const { categories } = args[0].data;
      const { owners } = args[1].data;
      const { product } = args[2].data;

      return {
        formConfiguration: {
          dropzone: true,
          api: 'products',
          id: params.id,

          // inputs props
          inputs: {
            title: {
              name: 'Заголовок',
              value: product.title,
              // placeholder: product.title,
            },
            description: {
              value: product.description,
              control: 'textarea',
              // placeholder: product.description,
            },
            price: {
              value: product.price,
              placeholder: product.price,
              type: 'number',
            },
            stockOuantity: {
              value: product.stockOuantity,
              // placeholder: product.stockOuantity,
              type: 'number',
            },
          },
          // selects props
          selects: {
            owner: {
              options: [
                { name: 'Choose one owner', value: '' },
                ...formatOptions(owners, product.owner),
              ],
              value: product.owner,
            },
            category: {
              options: [
                { name: 'Choose one category', value: '' },
                ...formatOptions(categories, product.category),
              ],
              value: product.category,
            },
          },
        } as FormConfig,
      };
    });
  }
}
</script>
