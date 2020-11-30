<template>
  <article class="card">
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
        <ButtonUi>Edit product</ButtonUi>
        <ButtonUi>Delete product</ButtonUi>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import ImageUi, { ImageConfig } from '@/components/UI/ImageUi.vue';
import ButtonUi from '@/components/UI/ButtonUi.vue';
import { Component, Vue, Prop } from 'nuxt-property-decorator';

interface CardConfig {
  title: string;
  rating: [];
  description: number;
  photos: {};
  price: number;
  stockOuantity: number;
}

@Component({
  components: {
    ButtonUi,
    ImageUi,
  },
})
export default class Card extends Vue {
  @Prop({ type: Object, required: true })
  readonly product!: CardConfig;

  imageConfig: ImageConfig = {
    desktop: { w: 300, h: 300 },
    tablet: { w: 100, h: 100 },
    mobile: { w: 50, h: 50 },
  };

  get getProduct() {
    return this.product;
  }
}
</script>
