import { Chip } from "./Chip";

export const ChipList = ({
  list = [],
  selected = [],
  setSelected = null,
  color = "green",
  size = "normal",
}: {
  list: string[];
  selected?: string[];
  setSelected?: ((selected: string[]) => void) | null;
  color?: string;
  size: "normal" | "small";
}) => {
  return (
    <div
      className={[
        "inline-flex items-center max-w-max  overflow-x-auto ",
        size === "normal" ? "space-x-3 p-1.5" : " space-x-1 p-0.5",
      ].join(" ")}
    >
      {list.map((el, index) => (
        <Chip
          color={color}
          name={el}
          key={index}
          size={size}
          checked={selected.findIndex((chip) => chip === el) !== -1}
          onClick={
            setSelected
              ? () =>
                  selected.findIndex((chip) => chip === el) === -1
                    ? setSelected([...selected, el])
                    : setSelected(selected.filter((chip) => chip !== el))
              : null
          }
        />
      ))}
    </div>
  );
};
