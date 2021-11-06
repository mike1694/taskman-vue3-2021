import { FetchArgs } from "@/types/FetchArgs";

export function fetch_post(arg: FetchArgs): Promise<any> {
  return new Promise((resolve, reject) => 
    fetch(arg.url + arg.payload.action, {
      method: 'POST',
      body: JSON.stringify(arg.payload.body, null, 2)
    })
    .then(response => {
      resolve(response);
    })
    .catch(err => {
      console.error('fetch_post error: ', err);

      reject(false);
    })
  );
}

export function fetch_get(url: string): Promise<[]> {
  return new Promise((resolve, reject) => {
    return fetch(url)
      .then(json => json.json())
      .then((response) => {
        resolve(response);
      })
      .catch(err => {
        console.error('fetch_get error: ', err);

        reject(false);
      });
  });
}