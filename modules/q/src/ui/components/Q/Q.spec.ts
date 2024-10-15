import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { IQPropTypes } from '~/components/Q';
import { Q } from '~/components/Q';

describe('Q Component', () => {

  describe('Component API', () => {
    const props = {}

    it('Should add class when the "class" prop is passed', () => {
      const testClass = '.q';

      const wrapper = mount(Q as any, {
        props: {
          ...props,
          class: testClass
        }
      });

      expect(wrapper.attributes().class).toContain(testClass);
    });

    it('Should render the Q component', () => {
      const wrapper = mount(Q as any, { props });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Emits', () => {
  });

  describe('Slots', () => {

  });
});
