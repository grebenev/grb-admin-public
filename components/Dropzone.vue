<template>
  <div class="dropzone">
    <!-- listing photos -->
    <ul class="dropzone__list" v-if="getPhotos.length > 0">
      <li class="dropzone__item" v-for="photo in getPhotos" :key="photo">
        <ImageUi :photo="photo" :config="imageConfig" />
      </li>
    </ul>

    <input class="dropzone__input" type="file" @change="sendFile" ref="drop" />
    <progress class="dropzone__bar" :value="progress" max="100"></progress>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import { ImageConfig } from '@/components/UI/ImageUi.vue';

@Component
export default class Dropzone extends Vue {
  @Ref() readonly drop!: HTMLFormElement;

  progress: number = 0;
  uploadedFiles: string[] = [];

  imageConfig: ImageConfig = {
    desktop: { w: 200, h: 200 },
    tablet: { w: 100, h: 100 },
    mobile: { w: 50, h: 50 },
  };

  async sendFile() {
    const file: File = (this.$refs.drop as HTMLFormElement).files[0];

    const allowedType: string[] = [
      'image/jpeg',
      'image/webp',
      'image/png',
      'image/gif',
      'image/svg+xml',
    ];
    const maxSize: number = 1000000;
    const tooLarge: boolean = file.size > maxSize;

    if (!allowedType.includes(file.type)) {
      console.log('non allowed type ');
      return;
    }
    if (tooLarge) {
      console.log(' too lagre');
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', file);

    try {
      await this.$axios
        .$post('http://localhost:3000/api/products/upload', formData, {
          onUploadProgress: (event: ProgressEvent): number =>
            (this.progress = Math.round((event.loaded * 100) / event.total)),
        })
        .then((res) => {
          console.log('Success uploaded: ', ...res.success);
          this.uploadedFiles = [...this.uploadedFiles, res.file];

          this.progress = 0;
          (this.$refs.drop as HTMLFormElement).value = '';
        })
        .catch((err) => {
          console.log('Something wrong with uploading: ', err);
        });
    } catch (err) {
      console.log('not available: ', err);
    }
  }

  get getPhotos() {
    return this.uploadedFiles;
  }
}
</script>
