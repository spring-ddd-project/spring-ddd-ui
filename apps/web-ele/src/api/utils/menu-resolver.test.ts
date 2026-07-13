import { beforeEach, describe, expect, it } from 'vitest';

import { findMenuIdByPath, getRawMenus, saveRawMenus } from './menu-resolver';

describe('menu-resolver', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveRawMenus / getRawMenus', () => {
    it('should persist raw menus to localStorage', () => {
      const menus = [
        { id: '1', path: '/dashboard' },
        {
          id: '2',
          path: '/system',
          children: [{ id: '3', path: '/system/dict' }],
        },
      ];
      saveRawMenus(menus);
      expect(getRawMenus()).toEqual(menus);
    });

    it('should not throw when localStorage is unavailable', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
      };
      expect(() => saveRawMenus([{ id: '1' }])).not.toThrow();
      localStorage.setItem = originalSetItem;
    });

    it('should return null when localStorage has no raw menus', () => {
      expect(getRawMenus()).toBeNull();
    });

    it('should return null when localStorage contains invalid JSON', () => {
      localStorage.setItem('__raw_menus__', '{invalid');
      expect(getRawMenus()).toBeNull();
    });
  });

  describe('findMenuIdByPath', () => {
    it('should find menu id by exact path', () => {
      saveRawMenus([
        { id: '1', path: '/system' },
        { id: '2', path: '/system/dict', children: [] },
      ]);
      expect(findMenuIdByPath('/system/dict')).toBe('2');
    });

    it('should find menu id when route has trailing /index', () => {
      saveRawMenus([{ id: '10', path: '/system/dict' }]);
      expect(findMenuIdByPath('/system/dict/index')).toBe('10');
    });

    it('should search nested children', () => {
      saveRawMenus([
        {
          id: '1',
          path: '/system',
          children: [
            {
              id: '2',
              path: '/system/user',
              children: [{ id: '3', path: '/system/user/role' }],
            },
          ],
        },
      ]);
      expect(findMenuIdByPath('/system/user/role')).toBe('3');
    });

    it('should return undefined when no menu matches', () => {
      saveRawMenus([{ id: '1', path: '/system' }]);
      expect(findMenuIdByPath('/not/found')).toBeUndefined();
    });

    it('should return undefined when raw menus are not saved', () => {
      expect(findMenuIdByPath('/system/dict')).toBeUndefined();
    });

    it('should return undefined when raw menus are not an array', () => {
      localStorage.setItem('__raw_menus__', '{"id":1}');
      expect(findMenuIdByPath('/system/dict')).toBeUndefined();
    });

    it('should prefer exact match over /index normalization', () => {
      saveRawMenus([
        { id: 'exact', path: '/system/dict/index' },
        { id: 'parent', path: '/system/dict' },
      ]);
      expect(findMenuIdByPath('/system/dict/index')).toBe('exact');
    });
  });
});
