<template>
  <div class="dropzone">
    <!-- listing photos -->
    <!-- {{ uploadedPhotos }} -->
    <ul class="dropzone__list">
      <li
        class="dropzone__item"
        v-for="photo in uploadedPhotos"
        :key="photo.id"
      >
        <div v-if="!photo.deleted">
          <ImageUi :photo="photo.photo" :config="imageConfig" /> {{ photo.id }}

          <ButtonUi @click="deleteFile(photo.id)"> Delete</ButtonUi>
        </div>
      </li>
    </ul>
    <div v-if="messages">
      <div v-for="(message, index) in messages" :key="index">
        MESSAGE: {{ message.message }}
      </div>
    </div>

    <input class="dropzone__input" type="file" @change="sendFile" ref="drop" />
    <progress class="dropzone__bar" :value="progress" max="100"></progress>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import { AxiosResponse, AxiosError } from 'axios';
import ImageUi, { ImageConfig } from '@/components/UI/ImageUi.vue';
import ButtonUi from '@/components/UI/ButtonUi.vue';
import { Photo } from '@/plugins/interfaces';

interface DropzoneComponent {
  progress: number;
  uploadedPhotos: Photo[];
  imageConfig: ImageConfig;
  messages: { message: string }[];

  sendFile(): void;
  deleteFile(id: number): Promise<void>;
}

interface AxiosCustomResponse extends AxiosResponse {
  photo: Photo;
  success: { message: string }[];
}

@Component({
  components: {
    ImageUi,
    ButtonUi
  }
})
export default class Dropzone extends Vue implements DropzoneComponent {
  @Ref() readonly drop!: HTMLFormElement;

  @Prop({ type: Array })
  readonly fetchedPhotos!: Photo[];

  @Prop({ type: String })
  readonly ProductId!: string;

  progress: number = 0;
  uploadedPhotos: Photo[] = [];
  messages: { message: string }[] = [];

  imageConfig: ImageConfig = {
    desktop: { w: 200, h: 200 },
    tablet: { w: 100, h: 100 },
    mobile: { w: 50, h: 50 }
  };

  async sendFile(): Promise<void> {
    const file: File = (this.$refs.drop as HTMLFormElement).files[0];

    const allowedType: string[] = [
      'image/jpeg',
      'image/webp',
      'image/png',
      'image/gif',
      'image/svg+xml'
    ];
    const maxSize: number = 1000000;
    const tooLarge: boolean = file.size > maxSize;

    if (!allowedType.includes(file.type)) {
      this.messages = [{ message: 'Non allowed file type!' }];
      return;
    }
    if (tooLarge) {
      this.messages = [{ message: 'File too large!' }];
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', file);

    try {
      await this.$axios
        .$post(`${process.env.baseUrl}/api/products/upload`, formData, {
          onUploadProgress: (event: ProgressEvent): number =>
            (this.progress = Math.round((event.loaded * 100) / event.total))
        })
        .then((res: AxiosCustomResponse) => {
          this.messages = res.success;

          this.uploadedPhotos.push(res.photo);

          this.progress = 0;
          (this.$refs.drop as HTMLFormElement).value = '';
        })
        .catch((err: AxiosError) => {
          this.messages = err.response ? err.response.data.errors : [];
        });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteFile(id: number): Promise<void> {
    const result = this.uploadedPhotos.filter(photo => {
      return photo.id != id;
    });

    this.uploadedPhotos = result;

    if (!this.$props.ProductId) return;

    this.$axios
      .put(
        `${process.env.baseUrl}/api/products/photo/${this.$props.ProductId}`,
        { photoid: id }
      )
      .then((res: AxiosResponse) => {
        this.messages = res.data.success;
      })
      .catch((err: AxiosError) => {
        this.messages = err.response ? err.response.data.errors : [];
      });
  }

  created() {
    if (this.$props.fetchedPhotos) {
      this.uploadedPhotos = this.$props.fetchedPhotos;
    }
  }
}
</script>
