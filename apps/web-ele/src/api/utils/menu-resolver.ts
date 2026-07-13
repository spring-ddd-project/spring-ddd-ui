/**
 * 数据权限菜单解析工具
 *
 * 由于 `@vben/access` 的 `generateAccessible` 会剥离菜单的 `id` 字段，
 * 但后端数据权限需要前端在请求头中携带 `X-Menu-Id`，因此保留一份原始菜单树，
 * 并根据当前路由路径反查菜单 ID。
 */

export type RawMenu = {
  children?: RawMenu[];
  id?: number | string;
  path?: string;
};

const RAW_MENUS_STORAGE_KEY = '__raw_menus__';

/**
 * 持久化原始菜单树，供请求拦截器解析 X-Menu-Id 使用。
 */
export function saveRawMenus(menus: RawMenu[]): void {
  try {
    localStorage.setItem(RAW_MENUS_STORAGE_KEY, JSON.stringify(menus));
  } catch {
    // ignore storage errors
  }
}

/**
 * 根据路由路径从原始菜单树中查找菜单 ID。
 * 同时兼容 `/sys/dict/index` 与 `/sys/dict` 两种写法。
 */
export function findMenuIdByPath(path: string): number | string | undefined {
  let raw: null | RawMenu[];
  try {
    raw = JSON.parse(localStorage.getItem(RAW_MENUS_STORAGE_KEY) || 'null');
  } catch {
    raw = null;
  }
  if (!Array.isArray(raw)) {
    return undefined;
  }
  const candidates = new Set([path, path.replace(/\/index$/u, '')]);
  function search(menus: RawMenu[]): number | string | undefined {
    for (const menu of menus) {
      if (menu.path && candidates.has(menu.path)) {
        return menu.id;
      }
      if (menu.children?.length) {
        const found = search(menu.children);
        if (found) return found;
      }
    }
    return undefined;
  }
  return search(raw);
}

/**
 * 测试专用：读取当前保存的原始菜单树。
 */
export function getRawMenus(): null | RawMenu[] {
  try {
    return JSON.parse(localStorage.getItem(RAW_MENUS_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}
