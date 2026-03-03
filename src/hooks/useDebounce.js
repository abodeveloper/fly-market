import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the given value.
 * The debounced value only updates after `delay` ms of inactivity.
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {*} debouncedValue
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
