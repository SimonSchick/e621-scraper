import Axios, { AxiosResponse } from 'axios';
import { writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);
const wait = promisify(setTimeout);

interface E621Response {
  id: number;
}

/**
 *
 * @param type Content type
 * @param limit Max amount of records per response
 * @param contKey Continuation key
 * @param order By what property to order.
 * @param lastId start offset
 */
export async function main(type: string, limit: number, contKey: string, order?: string, lastId?: number) {
  while (true) {
    const res = await Axios.request<any, AxiosResponse<E621Response[]>>({
      params: {
        [contKey]: lastId,
        limit,
        order,
      },
      responseType: 'json',
      url: `https://e621.net/${type}/index.json`,
    });
    const { data } = res;
    if (data.length === 0) {
      return;
    }
    lastId = data[data.length - 1].id;
    await writeFileAsync(join(__dirname, `../${type}s`, `${data[0].id}.json`), JSON.stringify(data), 'utf8');
    console.log(lastId);
    await wait(3500);
  }
}
