import { useEffect, useState } from "react";

const useDebounce = (value: string) => {
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (value === "") {
      setDebounced("");
    } else {
      timeout = setTimeout(() => {
        (async () => {
          setDebounced(value);
        })();
      }, 300);
    }
    return () => {
      if (timeout !== null) clearTimeout(timeout);
    };
  }, [value]);
  return debounced;
};

export default useDebounce;
