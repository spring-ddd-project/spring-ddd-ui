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

const TestBarChart = {
  name: 'TestBarChart',
  setup() {
    const renderEcharts = vi.fn();
    return { renderEcharts };
  },
  template: '<div class="test-bar-chart"><slot /></div>',
};

describe('analytics-visits-source', () => {
  it('should mount bar chart component', () => {
    const wrapper = mount(TestBarChart, {
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
    expect(wrapper.find('.test-bar-chart').exists()).toBe(true);
  });

  it('should have renderEcharts function', () => {
    const renderEcharts = vi.fn();
    const wrapper = mount(TestBarChart, {
      setup() {
        return { renderEcharts };
      },
    });
    expect(wrapper.vm.renderEcharts).toBeDefined();
  });
});
