import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { IWPropTypes } from '~/components/W';
import { W } from '~/components/W';

describe('W Component', () => {

  describe('Component API', () => {
    const props = {}

    it('Should add class when the "class" prop is passed', () => {
      const testClass = '.w';

      const wrapper = mount(W as any, {
        props: {
          ...props,
          class: testClass
        }
      });

      expect(wrapper.attributes().class).toContain(testClass);
    });

    it('Should render the W component', () => {
      const wrapper = mount(W as any, { props });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Emits', () => {
  });

  describe('Slots', () => {

  });
});
