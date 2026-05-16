import { describe, expect, it } from 'vitest';

import About from '../index.vue';

describe('About/index.vue', () => {
  it('has correct name', () => {
    expect(About.name).toBe('About');
  });
});
