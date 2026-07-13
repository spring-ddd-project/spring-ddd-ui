import { getMenuTreeWithoutPermission } from '#/api/sys/menu';

/**
 * Reload only the children of the given parent row in a lazy vxe-table tree.
 * Unlike reloadTreeExpand, this preserves the expansion state of all other
 * branches, because it directly replaces the child records without touching
 * treeExpandedMaps.
 *
 * Falls back to a full grid reload for root-level operations (parentId null).
 */
export async function refreshParentSubtree(
  gridApi: any,
  parentId?: null | string,
) {
  if (!parentId) {
    await gridApi.reload();
    return;
  }

  const parentRow = gridApi.grid?.getRowById(parentId);
  if (!parentRow) {
    // Parent is not currently loaded/expanded; full reload to be safe.
    await gridApi.reload();
    return;
  }

  const children = await getMenuTreeWithoutPermission(parentRow.id);
  parentRow.hasChildren = children && children.length > 0;

  // Access the underlying VxeTable instance to call the non-grid-proxied
  // loadTreeChildren method.
  const refMaps = gridApi.grid?.getRefMaps?.();
  const tableInstance = refMaps?.refTable?.value;
  tableInstance && typeof tableInstance.loadTreeChildren === 'function'
    ? await tableInstance.loadTreeChildren(parentRow, children)
    : await gridApi.reload();
}
