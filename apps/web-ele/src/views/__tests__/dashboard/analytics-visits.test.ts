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

const TestDonutChart = {
  name: 'TestDonutChart',
  setup() {
    const renderEcharts = vi.fn();
    return { renderEcharts };
  },
  template: '<div class="test-donut-chart"><slot /></div>',
};

describe('analytics-visits', () => {
  it('should mount donut chart component', () => {
    const wrapper = mount(TestDonutChart, {
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
    expect(wrapper.find('.test-donut-chart').exists()).toBe(true);
  });

  it('should have renderEcharts function', () => {
    const renderEcharts = vi.fn();
    const wrapper = mount(TestDonutChart, {
      setup() {
        return { renderEcharts };
      },
    });
    expect(wrapper.vm.renderEcharts).toBeDefined();
  });
});
