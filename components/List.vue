<template>
  <div>
    <ul class="list">
      <li class="list__item" v-for="(item, index) in list" :key="index">
        <div>Name: {{ item.name }}</div>
        <div v-if="item.about">About: {{ item.about }}</div>

        <div v-if="item.photos">
          <div v-for="photo in item.photos" :key="photo.id">
            <ImageUi :photo="photo.photo" :config="imageConfig" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import ImageUi, { ImageConfig } from '@/components/UI/ImageUi.vue';

@Component({
  components: {
    ImageUi
  }
})
export default class List extends Vue {
  @Prop({ type: Array })
  readonly list!: [];

  imageConfig: ImageConfig = {
    desktop: { w: 300, h: 300 },
    tablet: { w: 100, h: 100 },
    mobile: { w: 50, h: 50 }
  };
}
</script>

<style lang="scss">
.list {
  &__item {
    padding: 10px 10px;
    margin-bottom: 10px;
    border: 1px solid $gray;
  }
}
</style>
