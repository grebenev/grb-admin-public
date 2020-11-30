<template>
  <main>
    <div class="container">
      <h1>{{ header }}</h1>

      <section>
        <Form
          @onSubmit="onSubmit($event)"
          :config="formConfig"
          formName="Add new product"
        />
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import Form, { FormConfig } from '@/components/Form.vue';
import ButtonUi from '@/components/UI/ButtonUi.vue';

import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  components: {
    Form,
    ButtonUi,
  },
})
export default class Product extends Vue {
  header: string = 'Product page';

  formConfig: FormConfig = {
    inputs: {
      title: { name: 'Заголовок', value: '', placeholder: 'place title' },
      description: { value: '', control: 'textarea' },
      price: { value: '', placeholder: 'place price' },
    },
    selects: {
      owners: {
        options: [
          { name: 'Choose one of the owners', value: '' },
          { name: 'owner1', value: 'owner1' },
          { name: 'owner2', value: 'owner2' },
        ],
        value: '',
      },
      categories: {
        options: [
          { name: 'Choose one of the categories', value: '' },
          { name: 'category1', value: 'category1' },
          { name: 'category2', value: 'category2', selected: 'category2' },
        ],
        value: '',
      },
    },
  };

  onSubmit(formData: {}): void {
    console.log('Emmit data from Form: ', formData);
  }
}
</script>
