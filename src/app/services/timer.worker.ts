/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let milliseconds = data;
  setInterval(() => {
    milliseconds -= 1000;
    postMessage(milliseconds);
  }, 1000);
});