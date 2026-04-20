import { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number = 300): string => {
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    if (value === "") {
      setDebounced("");
      return;
    }
    const timeout = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
};

export default useDebounce;
