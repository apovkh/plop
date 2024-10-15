import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { ITestModuleCmpPropTypes } from '~/components/TestModuleCmp';
import { TestModuleCmp } from '~/components/TestModuleCmp';

describe('TestModuleCmp Component', () => {

  describe('Component API', () => {
    const props = {}

    it('Should add class when the "class" prop is passed', () => {
      const testClass = '.test-module-cmp';

      const wrapper = mount(TestModuleCmp as any, {
        props: {
          ...props,
          class: testClass
        }
      });

      expect(wrapper.attributes().class).toContain(testClass);
    });

    it('Should render the TestModuleCmp component', () => {
      const wrapper = mount(TestModuleCmp as any, { props });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Emits', () => {
  });

  describe('Slots', () => {

  });
});
