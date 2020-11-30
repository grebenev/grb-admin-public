<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>
      {{ products }}
      <section>
        <ButtonUi>Add new product</ButtonUi>
      </section>

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
import { Context } from '@nuxt/types';
//import { NuxtAxiosInstance } from '@nuxtjs/axios';
import ButtonUi from '@/components/UI/ButtonUi.vue';
import Card from '@/components/Card.vue';
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  components: {
    ButtonUi,
    Card,
  },
})
export default class Index extends Vue {
  header: string = 'All products';

  asyncData({ $axios, error }: Context) {
    return $axios
      .get(`http://localhost:3000/api/products`)
      .then((res) => {
        const { products } = res.data;
        return {
          products,
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
