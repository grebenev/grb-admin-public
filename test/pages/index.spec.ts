import Index from '@/pages/index.vue';
import { mount } from '@vue/test-utils';

describe('HomePage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Index);
    expect(wrapper.vm).toBeTruthy();
  });
});
