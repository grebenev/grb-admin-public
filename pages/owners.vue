<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <Form
        @emit-data="owners.push($event.owner)"
        :config="formConfiguration"
        formName="Add new owner"
      />
      <Dropzone />

      <List :list="owners" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { AxiosResponse, AxiosError } from 'axios';

import Form, { FormConfig } from '@/components/Form.vue';
import List from '@/components/List.vue';
import Dropzone from '@/components/Dropzone.vue';

interface Owner {
  header: string;
  messages: { message: string }[];
  formConfiguration: FormConfig;

  asyncData({ $axios, error }: Context): Promise<void | { owners: Owner[] }>;
}

@Component({
  components: {
    Form,
    List,
    Dropzone
  }
})
export default class OwnersPage extends Vue implements Owner {
  header: string = 'Owner page';
  messages: { message: string }[] = [];

  formConfiguration: FormConfig = {
    api: 'owners/owner',

    inputs: {
      name: {
        name: 'Create a new owner name',
        value: '',
        placeholder: 'place a owner name'
      },
      about: {
        name: 'Describe a new owner',
        value: '',
        control: 'textarea',
        placeholder: 'place describe'
      }
    }
  };

  asyncData({ $axios, error }: Context) {
    return $axios
      .get(`${process.env.baseUrl}/api/owners`)
      .then((res: AxiosResponse) => {
        const { owners } = res.data;
        return {
          owners
        };
      })
      .catch((err: AxiosError) => {
        error({
          statusCode: 404,
          message: `No items found - ${err.message}`
        });
      });
  }
}
</script>
