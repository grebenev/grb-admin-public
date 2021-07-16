<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <Form :config="formConfiguration" formName="Add new product" />

      <Dropzone />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { AxiosResponse, AxiosError } from 'axios';

import Form, { FormConfig } from '@/components/Form.vue';
import Dropzone from '@/components/Dropzone.vue';
import { formatOptions } from '@/plugins/formatOptions';

interface Product {
  header: string;
  asyncData({
    $axios,
    error
  }: Context): Promise<void | { formConfiguration: FormConfig }>;
}

@Component({
  components: {
    Form,
    Dropzone
  }
})
export default class ProductPage extends Vue implements Product {
  header: string = 'Product page';

  asyncData({ $axios, error }: Context) {
    return Promise.all([
      $axios.get(`${process.env.baseUrl}/api/categories`),
      $axios.get(`${process.env.baseUrl}/api/owners`)
    ])
      .then(([categoriesRes, ownersRes]: AxiosResponse[]) => {
        const { categories } = categoriesRes.data;
        const { owners } = ownersRes.data;

        return {
          formConfiguration: {
            api: 'products/product',
            // inputs props
            inputs: {
              title: {
                name: 'Заголовок',
                value: '',
                placeholder: 'product title'
              },
              description: {
                value: '',
                control: 'textarea',
                placeholder: 'product description'
              },
              price: {
                value: '',
                placeholder: 'number',
                type: 'number'
              },
              stockOuantity: {
                value: '',
                placeholder: 'number',
                type: 'number'
              }
            },
            // selects props
            selects: {
              owner: {
                options: [
                  { name: 'Choose one owner', value: '' },
                  ...formatOptions(owners)
                ],
                value: ''
              },
              category: {
                options: [
                  { name: 'Choose one category', value: '' },
                  ...formatOptions(categories)
                ],
                value: ''
              }
            }
          } as FormConfig
        };
      })
      .catch((err: AxiosError) => {
        error({
          statusCode: 404,
          message: `No items found - ${err.message}`
        });
      });
  }
}
</script>
