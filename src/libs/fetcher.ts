export const fetcher =
  (library: any) =>
  (...args: any[]) => {
    const [method, ...params] = args;

    return library[method](...params);
  };
