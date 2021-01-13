<template>
  <article class="card" :class="{ 'card--deleted': getProduct.deleted }">
    <div class="card__wrapper">
      <div class="card__item card__item--title">
        <h2 class="title">{{ getProduct.title }}</h2>
      </div>
      <div
        class="card__item card__item--image"
        v-for="(value, key) in getProduct.photos"
        :key="key"
      >
        {{ key }} : {{ value }}

        <ImageUi :photo="value.photo" :config="imageConfig" />
      </div>

      <div class="card__item card__item--text">
        {{ getProduct.description }}
      </div>
      <div class="card__item card__item--text">
        {{ getProduct.price }}
      </div>
      <div class="card__item card__item--text">
        {{ getProduct.stockOuantity }}
      </div>

      <div class="card__item card__item--tools">
        <ButtonUi
          type="button"
          @click="$router.push(`products/${getProduct._id}`)"
          >Edit product</ButtonUi
        >
        <ButtonUi
          v-if="!getProduct.deleted"
          type="button"
          @click="deleteProduct(getProduct._id)"
          >Delete product</ButtonUi
        >
      </div>
      <div v-if="messages">
        <div v-for="(message, index) in messages" :key="index">
          MESSAGE: {{ message.message }}
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { ImageConfig } from '@/components/UI/ImageUi.vue';
import { AxiosResponse, AxiosError } from 'axios';

interface CardConfig {
  _id: string;
  title: string;
  rating: [];
  description: number;
  photos: {};
  price: number;
  stockOuantity: number;
  deleted?: boolean;
}

@Component
export default class Card extends Vue {
  @Prop({ type: Object, required: true })
  readonly product!: CardConfig;

  messages: { message: string }[] = [];

  imageConfig: ImageConfig = {
    desktop: { w: 300, h: 300 },
    tablet: { w: 100, h: 100 },
    mobile: { w: 50, h: 50 },
  };

  get getProduct() {
    return this.product;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.$axios
      .put(`http://localhost:3000/api/products/delete/${id}`)
      .then((res: AxiosResponse) => {
        this.messages = res.data.success;
      })
      .catch((err: AxiosError) => {
        this.messages = err.response ? err.response.data.errors : [];
      });
  }
}
</script>
<style lang="scss">
.card {
  &--deleted {
    opacity: 0.3;
  }
}
</style>
