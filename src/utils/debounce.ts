export const debounce = (fn: any, time: number) => {
  let timeout: any;

  return function () {
    // Arrow function inherit this and arguments. And Babel transpile it to ES5.
    if (arguments.length > 0 && arguments[0].target) {
      // Persist Synthetic Event, because React takes event pooling for performance,
      // which cause asynchronous access to event be nullified.
      arguments[0].persist();
    }
    // @ts-ignore
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
};