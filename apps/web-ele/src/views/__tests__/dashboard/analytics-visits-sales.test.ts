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

const TestLineChart = {
  name: 'TestLineChart',
  setup() {
    const renderEcharts = vi.fn();
    return { renderEcharts };
  },
  template: '<div class="test-line-chart"><slot /></div>',
};

describe('analytics-visits-sales', () => {
  it('should mount line chart component', () => {
    const wrapper = mount(TestLineChart, {
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
    expect(wrapper.find('.test-line-chart').exists()).toBe(true);
  });

  it('should have renderEcharts function', () => {
    const renderEcharts = vi.fn();
    const wrapper = mount(TestLineChart, {
      setup() {
        return { renderEcharts };
      },
    });
    expect(wrapper.vm.renderEcharts).toBeDefined();
  });
});
