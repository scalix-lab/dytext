declare module 'dlv' {
  function dlv(obj: any, key: string | string[], def?: any): any;
  export = dlv;
}