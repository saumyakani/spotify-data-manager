import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value.
 * @param {any} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds (e.g., 300).
 * @returns {any} The debounced value.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: Cancel the previous timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}