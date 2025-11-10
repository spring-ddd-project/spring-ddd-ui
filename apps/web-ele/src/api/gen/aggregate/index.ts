import { requestClient } from '#/api/request';

export async function getAggregatePage(data: any) {
  return requestClient.post('/gen/aggregate/index', data);
}

export async function wipeAggregate(data: any) {
  return requestClient.delete('/gen/aggregate/wipe', {
    params: {
      ids: data,
    },
  });
}

export async function createAggregate(data: any) {
  return requestClient.post('/gen/aggregate/create', data);
}

export async function updateAggregate(data: any) {
  return requestClient.put('/gen/aggregate/update', data);
}
