// Owner with NO teardown anywhere in the project - must still FAIL
let raf = 0;
export function start(cv) {
  const ctx = cv.getContext("2d");
  const loop = () => { ctx.clearRect(0,0,10,10); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
}
