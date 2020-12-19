<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <Form :config="formConfiguration" formName="Add new product" />
    </div>
  </main>
</template>

<script lang="ts">
import { FormConfig } from '@/components/Form.vue';

import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { formatOptions } from '@/plugins/formatOptions';

@Component
export default class Product extends Vue {
  header: string = 'Product page';

  asyncData({ $axios, error }: Context) {
    return Promise.all([
      $axios.get(`http://localhost:3000/api/categories`),
      $axios.get(`http://localhost:3000/api/owners`),
    ])
      .then(([categoriesRes, ownersRes]) => {
        const { categories } = categoriesRes.data;
        const { owners } = ownersRes.data;

        return {
          formConfiguration: {
            dropzone: true,
            postApi: 'products/product',

            // inputs props
            inputs: {
              title: {
                name: 'Заголовок',
                value: '',
                placeholder: 'product title',
              },
              description: {
                value: '',
                control: 'textarea',
                placeholder: 'product description',
              },
              price: {
                value: 0,
                placeholder: 'number',
                type: 'number',
              },
              stockOuantity: {
                value: 0,
                placeholder: 'number',
                type: 'number',
              },
            },
            // selects props
            selects: {
              owner: {
                options: [
                  { name: 'Choose one owner', value: '' },
                  ...formatOptions(owners),
                ],
                value: '',
              },
              category: {
                options: [
                  { name: 'Choose one category', value: '' },
                  ...formatOptions(categories),
                ],
                value: '',
              },
            },
          } as FormConfig,
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
