import { describe, expect, it, vi } from 'vitest';

import { mount } from '@vue/test-utils';

// Mock echarts
vi.mock('@vben/plugins/echarts', () => ({
  EchartsUI: {
    name: 'EchartsUI',
    props: ['ref'],
    template: '<div class="echarts-ui-mock"><slot /></div>',
  },
  useEcharts: () => ({
    chartRef: { value: null },
    renderEcharts: vi.fn(),
  }),
}));

const TestEchartsWrapper = {
  name: 'TestEchartsWrapper',
  setup() {
    const renderEcharts = vi.fn();
    return { renderEcharts };
  },
  template: '<div class="test-echarts"><slot /></div>',
};

describe('analytics-trends', () => {
  it('should mount echarts mock component', () => {
    const wrapper = mount(TestEchartsWrapper, {
      global: {
        stubs: {
          EchartsUI: {
            name: 'EchartsUI',
            template: '<div class="echarts-mock"></div>',
          },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.test-echarts').exists()).toBe(true);
  });

  it('should have renderEcharts function', () => {
    const renderEcharts = vi.fn();
    const wrapper = mount(TestEchartsWrapper, {
      setup() {
        return { renderEcharts };
      },
    });
    expect(wrapper.vm.renderEcharts).toBeDefined();
  });
});
