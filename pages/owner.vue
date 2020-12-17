<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <Form
        @emit-data="owners.push($event.owner)"
        :config="formConfiguration"
        formName="Add new owner"
      />

      <List :list="owners" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { FormConfig } from '@/components/Form.vue';
import { AxiosResponse, AxiosPromise, AxiosError } from 'axios';
import List from '@/components/List.vue';

@Component
export default class Owner extends Vue {
  header: string = 'Owner page';
  messages: { message: string }[] = [];

  formConfiguration: FormConfig = {
    postApi: 'owners/owner',
    dropzone: true,
    inputs: {
      name: {
        name: 'Create a new owner name',
        value: '',
        placeholder: 'place a owner name',
      },
      about: {
        name: 'Describe a new owner',
        value: '',
        control: 'textarea',
        placeholder: 'place describe',
      },
    },
  };

  asyncData({ $axios, error }: Context) {
    return $axios
      .get(`http://localhost:3000/api/owners`)
      .then((res) => {
        const { owners } = res.data;
        return {
          owners,
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
