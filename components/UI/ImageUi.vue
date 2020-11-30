<template>
  <div class="image">
    <div class="image__wrapper">
      <picture>
        <source
          type="image/webp"
          media="(min-width: 1300px)"
          :srcset="getUrl('webp', photo, config.desktop.w, config.desktop.h)"
        />
        <source
          type="image/webp"
          media="(min-width: 768px)"
          :srcset="getUrl('webp', photo, config.tablet.w, config.tablet.h)"
        />
        <source
          type="image/webp"
          :srcset="getUrl('webp', photo, config.mobile.w, config.mobile.h)"
        />
        <source
          media="(min-width: 1300px)"
          :srcset="getUrl('', photo, config.desktop.w, config.desktop.h)"
        />
        <source
          media="(min-width: 768px)"
          :srcset="getUrl('', photo, config.tablet.w, config.tablet.h)"
        />
        <source :srcset="getUrl('', photo, config.mobile.w, config.mobile.h)" />

        <img :src="getUrl('', photo, config.mobile.w, config.mobile.h)" />
      </picture>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

export interface ImageConfig {
  desktop: { w: number; h: number };
  tablet: { w: number; h: number };
  mobile: { w: number; h: number };
}

@Component
export default class ImageUi extends Vue {
  @Prop({ type: Object, required: true })
  readonly config!: ImageConfig;

  @Prop({ type: String, required: true })
  readonly photo!: string;

  resizeApi: string = `${process.env.API_URL}/api/resize/`;

  getUrl(...args: string[]): string {
    let photo: string, format: string;

    if (!args[1] && typeof args[1] !== 'string') {
      photo = 'noImage.jpeg';
    } else {
      photo = args[1];
    }

    format = args[0] !== 'webp' ? args[1].split('.')[1] : 'webp';

    return `${this.resizeApi}?format=${format}&file=${photo}&width=${parseInt(
      args[2]
    )}&height=${parseInt(args[3])} 1x, ${
      this.resizeApi
    }?&format=${format}&file=${photo}&width=${parseInt(args[2]) * 2}&height=${
      parseInt(args[3]) * 2
    } 2x`;
  }
}
</script>

<style lang="scss"></style>
