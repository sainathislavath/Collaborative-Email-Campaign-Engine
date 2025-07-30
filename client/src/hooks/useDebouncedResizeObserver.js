// src/hooks/useResizeObserver.js
import { useEffect, useRef } from "react";

export const useResizeObserver = (callback, delay = 100) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Create a custom ResizeObserver with debouncing
    const handleResize = (entries) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(entries);
      }, delay);
    };

    const observer = new ResizeObserver(handleResize);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observer.disconnect();
    };
  }, [delay]);

  return (element) => {
    if (element) {
      const observer = new ResizeObserver((entries) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callbackRef.current(entries);
        }, delay);
      });

      observer.observe(element);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        observer.disconnect();
      };
    }
  };
};
