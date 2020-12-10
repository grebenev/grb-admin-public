<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <section>
        <Form
          @onSubmit="onSubmit($event)"
          :config="formConfiguration"
          formName="Add new category"
        />
      </section>

      <div>
        <div>MESSAGE:</div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import { FormConfig } from '@/components/Form.vue';

@Component
export default class Category extends Vue {
  header: string = 'Category page';

  formConfiguration: FormConfig = {
    inputs: {
      category: {
        name: 'Create a new caterory',
        value: '',
        placeholder: 'place a category',
      },
    },
  };

  onSubmit(formData: {}): void {
    console.log(formData);
  }
}
</script>
