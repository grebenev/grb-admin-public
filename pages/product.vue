<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <section>
        <Form
          @onSubmit="onSubmit($event)"
          :config="formConfiguration"
          formName="Add new product"
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
import Form, { FormConfig } from '@/components/Form.vue';
import ButtonUi from '@/components/UI/ButtonUi.vue';

import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { AxiosResponse, AxiosPromise, AxiosError } from 'axios';

interface Select {
  type: string;
  name: string;
  _id: string;
}

@Component({
  components: {
    Form,
    ButtonUi,
  },
})
export default class Product extends Vue {
  header: string = 'Product page';
  messages: { message: string }[] = [];

  async onSubmit(formData: {}): Promise<void> {
    console.log(formData);

    await this.$axios
      .post('http://localhost:3000/api/products/product', formData)

      .then((res: AxiosResponse) => {
        this.messages = res.data.success;

        // this.$router.push('/');
      })
      .catch((err: AxiosError) => {
        this.messages = err.response?.data.errors;
      });
  }

  asyncData({ $axios, error }: Context) {
    return Promise.all([
      $axios.get(`http://localhost:3000/api/categories`),
      $axios.get(`http://localhost:3000/api/owners`),
    ])
      .then(([categoriesRes, ownersRes]) => {
        const { categories } = categoriesRes.data;
        const { owners } = ownersRes.data;

        const formatSelects = (selects: Select[]): object[] => {
          let formatted: object[] = [];

          formatted = selects.map((select: Select): {} => {
            return {
              name: select.type ? select.type : select.name,
              value: select._id,
            };
          });

          return formatted;
        };

        return {
          formConfiguration: {
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
                value: '',
                placeholder: '0',
                type: 'number',
              },
              stockOuantity: {
                value: '',
                placeholder: '0',
                type: 'number',
              },
            },
            selects: {
              owner: {
                options: [
                  { name: 'Choose one owner', value: '' },
                  ...formatSelects(owners),
                ],
                value: '',
              },
              category: {
                options: [
                  { name: 'Choose one category', value: '' },
                  ...formatSelects(categories),
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
