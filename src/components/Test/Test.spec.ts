import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { ITestPropTypes } from '~/components/Test';
import { Test } from '~/components/Test';

describe('Test Component', () => {

  describe('Component API', () => {
    const props = {}

    it('Should add class when the "class" prop is passed', () => {
      const testClass = '.test';

      const wrapper = mount(Test as any, {
        props: {
          ...props,
          class: testClass
        }
      });

      expect(wrapper.attributes().class).toContain(testClass);
    });

    it('Should render the Test component', () => {
      const wrapper = mount(Test as any, { props });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Emits', () => {
  });

  describe('Slots', () => {

  });
});
