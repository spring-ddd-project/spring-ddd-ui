import { generateAccessible } from '@vben/access';

import { ElMessage } from 'element-plus';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAllMenusApi } from '#/api';
import { saveRawMenus } from '#/api/utils/menu-resolver';

import { generateAccess } from './access';

vi.mock('@vben/access', () => ({
  generateAccessible: vi.fn(),
}));

vi.mock('@vben/preferences', () => ({
  preferences: {
    app: {
      accessMode: 'backend',
      loginExpiredMode: 'page',
      enableRefreshToken: true,
      locale: 'zh-CN',
    },
  },
}));

vi.mock('element-plus', () => ({
  ElMessage: vi.fn(),
}));

vi.mock('#/api', () => ({
  getAllMenusApi: vi.fn(),
}));

vi.mock('#/api/utils/menu-resolver', () => ({
  saveRawMenus: vi.fn(),
}));

vi.mock('#/layouts', () => ({
  BasicLayout: { name: 'BasicLayout' },
  IFrameView: { name: 'IFrameView' },
}));

vi.mock('#/locales', () => ({
  $t: vi.fn((key: string) => key),
}));

describe('router/access', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateAccessible).mockImplementation(async (_mode, options) => {
      if (options?.fetchMenuListAsync) {
        await options.fetchMenuListAsync();
      }
      return { routes: [], menus: [] };
    });
  });

  it('should call generateAccessible with backend access mode', async () => {
    const mockMenus = [
      { id: 1, path: '/system' },
      { id: 2, path: '/system/dict' },
    ];
    vi.mocked(getAllMenusApi).mockResolvedValue(mockMenus);

    const options = { router: { replace: vi.fn() } as any };
    await generateAccess(options);

    expect(ElMessage).toHaveBeenCalledWith({
      duration: 1500,
      message: 'common.loadingMenu...',
    });
    expect(generateAccessible).toHaveBeenCalledWith(
      'backend',
      expect.objectContaining({
        ...options,
        fetchMenuListAsync: expect.any(Function),
        forbiddenComponent: expect.any(Function),
        layoutMap: expect.objectContaining({
          BasicLayout: { name: 'BasicLayout' },
        }),
        pageMap: expect.any(Object),
      }),
    );
  });

  it('should persist raw menus before returning transformed menus', async () => {
    const mockMenus = [
      { id: 10, path: '/system/role' },
      { id: 20, path: '/system/post' },
    ];
    vi.mocked(getAllMenusApi).mockResolvedValue(mockMenus);

    await generateAccess({} as any);

    expect(saveRawMenus).toHaveBeenCalledWith(mockMenus);
  });

  it('should return the result from generateAccessible', async () => {
    const mockResult = {
      menus: [{ id: 1, name: 'menu' }],
      routes: [{ path: '/system' }],
    };
    vi.mocked(getAllMenusApi).mockResolvedValue([]);
    vi.mocked(generateAccessible).mockResolvedValue(mockResult);

    const result = await generateAccess({} as any);

    expect(result).toEqual(mockResult);
  });
});
