import { classes } from "@utils/classes";
import { Dispatch, SetStateAction } from "react";
import { Chip } from "./Chip";

interface ChipElement {
  label: string;
  value: string;
  validated?: boolean;
}

export const ChipList = ({
  list = [],
  selected = [],
  setSelected = null,
  color = "green",
  size = "normal",
  multiple = true,
}: {
  list: ChipElement[];
  selected?: ChipElement[];
  setSelected?:
    | ((selected?: ChipElement[]) => void)
    | Dispatch<SetStateAction<ChipElement[]>>
    | null;
  color?: string;
  size: "normal" | "small";
  multiple?: boolean;
}) => {
  return (
    <div
      className={classes(
        "inline-flex items-center max-w-max  overflow-x-auto ",
        size === "normal" ? "space-x-3 p-1.5" : " space-x-1 p-0.5"
      )}
    >
      {list.map((el, index) => {
        const accSelected = !multiple ? [] : [...selected];
        return (
          <Chip
            color={color}
            element={el}
            key={index}
            size={size}
            checked={
              selected.findIndex((chip) => chip.label === el.label) !== -1
            }
            onClick={
              setSelected
                ? () =>
                    selected.findIndex((chip) => chip.label === el.label) === -1
                      ? setSelected([...accSelected, el])
                      : setSelected(
                          selected.filter((chip) => chip.label !== el.label)
                        )
                : null
            }
          />
        );
      })}
    </div>
  );
};
