import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getMenusPage(data: any) {
  return requestClient.post('/sys/menu/page', data);
}
