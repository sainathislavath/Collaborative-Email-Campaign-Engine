// src/utils/resizeObserverPatch.js
(function () {
  const OriginalResizeObserver = window.ResizeObserver;

  if (!OriginalResizeObserver) {
    return;
  }

  // Create a throttle function to limit how often the observer can fire
  const throttle = (func, limit) => {
    let inThrottle;
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        lastRan = Date.now();
        inThrottle = true;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  // Create a map to store original callbacks
  const callbackMap = new WeakMap();

  // Patch the ResizeObserver constructor
  window.ResizeObserver = function (callback) {
    // Create a throttled version of the callback
    const throttledCallback = throttle(callback, 100);

    // Store the original callback in the map
    callbackMap.set(throttledCallback, callback);

    // Call the original constructor with the throttled callback
    const observer = new OriginalResizeObserver(throttledCallback);

    return observer;
  };

  // Copy over the prototype and static properties
  window.ResizeObserver.prototype = OriginalResizeObserver.prototype;
  Object.getOwnPropertyNames(OriginalResizeObserver).forEach((prop) => {
    if (prop !== "prototype" && prop !== "length" && prop !== "name") {
      window.ResizeObserver[prop] = OriginalResizeObserver[prop];
    }
  });
})();
