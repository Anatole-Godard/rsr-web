import { ChangeEvent, useEffect, useState } from "react";

export function useSearch<T = object>(key: keyof T, items: T[]) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<T[]>(items);

  // if the 'items' change, make sure we update our state.
  useEffect(() => {
    setFiltered(items);
  }, [items]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);

    // if there's no hits found, set filtered back to all items
    if (value.length <= 0) {
      setFiltered(items);

      // else, search on the provided 'key'
    } else {
      setFiltered(
        items.filter((v) =>
          (v[key] as unknown as string)
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      );
    }
  }

  return {
    search,
    onChange,
    filtered,
  };
}
