import { describe, expect, it } from 'vitest';

import Login from '../login.vue';

describe('Login.vue', () => {
  it('has correct name', () => {
    expect(Login.name).toBe('Login');
  });
});
