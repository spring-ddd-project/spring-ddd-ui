import { requestClient } from '#/api/request';

export async function getAggregatePage(data: any) {
  return requestClient.post('/gen/aggregate/index', data);
}

export async function wipeAggregate() {
  return requestClient.delete('/gen/aggregate/wipe');
}

export async function createAggregate(data: any) {
  return requestClient.post('/gen/aggregate/create', data);
}

export async function updateAggregate(data: any) {
  return requestClient.put('/gen/aggregate/update', data);
}
