<template>
  <div class="dropzone">
    <!-- listing photos -->

    <ul class="dropzone__list">
      <li
        class="dropzone__item"
        v-for="(photo, propretyName) in uploadedPhotos"
        :key="propretyName"
      >
        <ImageUi :photo="photo.photo" :config="imageConfig" />
      </li>
    </ul>

    <input class="dropzone__input" type="file" @change="sendFile" ref="drop" />
    <progress class="dropzone__bar" :value="progress" max="100"></progress>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import { AxiosResponse, AxiosError } from 'axios';
import { ImageConfig } from '@/components/UI/ImageUi.vue';
import { Photo } from '@/plugins/interfaces';

interface DropzoneComponent {
  progress: number;
  uploadedPhotos: Photo;
  imageConfig: ImageConfig;
  messages: string[];

  sendFile(): void;
}

interface AxiosCustomResponse extends AxiosResponse {
  photo: Photo;
  success: { message: string }[];
}

@Component
export default class Dropzone extends Vue implements DropzoneComponent {
  @Ref() readonly drop!: HTMLFormElement;

  @Prop({ type: Object })
  readonly fetchedPhotos!: Photo;

  progress: number = 0;
  uploadedPhotos: Photo = {};
  messages: string[] = [];

  imageConfig: ImageConfig = {
    desktop: { w: 200, h: 200 },
    tablet: { w: 100, h: 100 },
    mobile: { w: 50, h: 50 },
  };

  async sendFile(): Promise<void> {
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
        .then((res: AxiosCustomResponse) => {
          console.log('Success uploaded: ', res.success[0].message);

          this.uploadedPhotos = { ...this.uploadedPhotos, ...res.photo };

          console.log('ответ res ', res.photo);

          this.progress = 0;
          (this.$refs.drop as HTMLFormElement).value = '';
        })
        .catch((err: AxiosError) => {
          console.log('Something wrong with uploading: ', err);
        });
    } catch (err) {
      console.log('not available: ', err);
    }
  }
  created() {
    if (this.$props.fetchedPhotos) {
      this.uploadedPhotos = this.$props.fetchedPhotos;
    }
  }
}
</script>
