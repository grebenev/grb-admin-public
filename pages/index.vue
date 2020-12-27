<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <!-- <section>
        <ButtonUi>Add new product</ButtonUi>
      </section> -->

      <section>
        <Card
          v-for="product in products"
          :key="product._id"
          :product="product"
        />
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { AxiosResponse, AxiosError } from 'axios';

import Card from '@/components/Card.vue';

interface Product {
  _id: string;
  rating: [];
  title: string;
  description: string;
  photos: {};
  price: number;
  stockQuantity: number;
  category: string;
  owner: string;
}

interface Index {
  header: string;
  asyncData({
    $axios,
    error,
  }: Context): Promise<void | { products: Product[] }>;
}

@Component({
  components: {
    Card,
  },
})
export default class IndexPage extends Vue implements Index {
  header: string = 'All products';

  asyncData({ $axios, error }: Context) {
    return $axios
      .get(`http://localhost:3000/api/products`)
      .then((res: AxiosResponse) => {
        const { products } = res.data;
        return {
          products,
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
