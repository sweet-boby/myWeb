export default function concurRequest(
  urls: string[],
  maxNum: number,
  callback?: (url: string) => Promise<any>
): Promise<any[]> {
  if (urls.length === 0) {
    return Promise.resolve([]);
  }
  let urlsCopy = [...urls];

  const maxn = Math.min(urls.length, maxNum);
  return new Promise((resolve) => {
    let index = 0;
    let count = 0;
    let result: any[] = [];
    async function request() {
      const i = index;
      const url = urlsCopy[index];
      index++;
      try {
        let resq;
        if (callback) {
          resq = await callback(url);
        } else {
          resq = await fetch(url);
        }
        result[i] = resq;
      } catch (e) {
        result[i] = e;
      } finally {
        count++;
        if (count === urlsCopy.length) {
          resolve(result);
        }
        if (index < urlsCopy.length) {
          request();
        }
      }
    }
    for (let i = 0; i < maxn; i++) {
      request();
    }
  });
}
