import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { IDfPropTypes } from '~/components/Df';
import { Df } from '~/components/Df';

describe('Df Component', () => {

  describe('Component API', () => {
    const props = {}

    it('Should add class when the "class" prop is passed', () => {
      const testClass = '.df';

      const wrapper = mount(Df as any, {
        props: {
          ...props,
          class: testClass
        }
      });

      expect(wrapper.attributes().class).toContain(testClass);
    });

    it('Should render the Df component', () => {
      const wrapper = mount(Df as any, { props });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Emits', () => {
  });

  describe('Slots', () => {

  });
});
