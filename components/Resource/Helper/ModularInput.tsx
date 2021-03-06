import {
  CalculatorIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationIcon,
  MenuAlt2Icon,
  PlusCircleIcon,
  XIcon,
} from "@heroicons/react/outline";
import { CursorClickIcon } from "@heroicons/react/solid";
import { useTranslations } from "next-intl";
import { Dispatch, useState } from "react";
import slug from "slug";

export type Input = {
  label: string;
  slug: string;
  value: string | number | boolean;
  type: "date" | "string" | "number" | "boolean";
};
const DEFAULT_INPUT_TYPE = "string";
let DEFAULT_INPUT_LABEL = "Identifiant par défaut";

export const WrapperModularInputs = ({
  data,
  setData,
}: {
  data: Input[];
  setData: Dispatch<Input[]>;
}) => {
  const t = useTranslations("WrapperModularInputs");
  DEFAULT_INPUT_LABEL = t("default-input-label");
  const DEFAULT_INPUT_SLUG = slug(DEFAULT_INPUT_LABEL);

  const appendInput = () => {
    setData([
      ...data,
      {
        label: DEFAULT_INPUT_LABEL,
        slug: DEFAULT_INPUT_SLUG,
        value: "",
        type: DEFAULT_INPUT_TYPE,
      },
    ]);
  };

  const removeInput = (slug: string) => {
    setData(data.filter((input) => input.slug !== slug));
  };

  return (
    <div className="flex flex-col justify-between h-full max-h-full p-2 space-y-1 bg-gray-200 rounded-lg dark:bg-gray-800">
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center p-4">
          <ExclamationIcon className="w-8 h-8" />
          <h4 className="text-lg font-marianne">{t("no-input-title")}</h4>
          <p className="text-sm text-center font-spectral">
            {t("no-input-description")}
          </p>
        </div>
      )}
      <div className="flex flex-col space-y-1">
        {data.map((input, index) => (
          <Input
            key={index}
            label={input.label}
            value={input.value}
            type={input.type}
            onValueChange={(value) => {
              const newData = [...data];
              newData[index].value = value;
              setData(newData);
            }}
            onTypeChange={(value: Input["type"]) => {
              const newData = [...data];
              newData[index].type = value;
              newData[index].value = "";
              setData(newData);
            }}
            onLabelChange={(value) => {
              const newData = [...data];
              newData[index].label = value;
              newData[index].slug = slug(value);
              setData(newData);
            }}
            slug={input.slug}
            removeInput={removeInput}
          />
        ))}
      </div>
      <div className="inline-flex justify-end w-full mt-4 ">
        <button
          className="btn-gray dark:bg-gray-700"
          onClick={appendInput}
          type="button"
        >
          <PlusCircleIcon className="w-4 h-4 mr-2" />
          {t("add-input")}
        </button>
      </div>
    </div>
  );
};

interface IInputProps extends Input {
  // eslint-disable-next-line no-unused-vars
  onValueChange: (value: string | number | boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onTypeChange: (type: string) => void;
  // eslint-disable-next-line no-unused-vars
  onLabelChange: (label: string) => void;
  // eslint-disable-next-line no-unused-vars
  removeInput: (slug: string) => void;
}

const Input = ({
  label,
  value,
  type,
  slug,
  onValueChange,
  onTypeChange,
  onLabelChange,
  removeInput,
}: IInputProps) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const t = useTranslations("WrapperModularInputs");
  return (
    <div className="flex flex-col space-y-1">
      <div className="text-sm font-spectral">
        {isEditingLabel ? (
          <div className="inline-flex items-center mb-1 space-x-2">
            <input
              value={label}
              onChange={(e) => onLabelChange(e.target.value)}
              className="input hover:bg-gray-300 w-fit dark:bg-gray-700"
              placeholder={t("label-edit-placeholder")}
              onBlur={() => setIsEditingLabel(false)}
            />
            <button
              className="px-2.5 py-2.5 btn-bleuFrance"
              onClick={() => {
                setIsEditingLabel(false);
                if (label.trim().length === 0) {
                  onLabelChange(DEFAULT_INPUT_LABEL);
                }
              }}
            >
              <CheckCircleIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span
            onClick={() => {
              setIsEditingLabel(true);
              onLabelChange("");
            }}
            className="inline-flex items-center cursor-pointer hover:underline"
          >
            {label}
            <CursorClickIcon className="w-3 h-3 ml-1" />
          </span>
        )}
        <div className="inline-flex items-center w-full mt-1 space-x-2">
          <label className="relative text-gray-400 focus-within:text-gray-600 shrink-0">
            {type === "string" && (
              <MenuAlt2Icon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
            )}
            {type === "date" && (
              <CalendarIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
            )}
            {type === "number" && (
              <CalculatorIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
            )}
            {type === "boolean" && (
              <CheckCircleIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
            )}
            <select
              value={type || ""}
              onChange={(e) => {
                onTypeChange(e.target.value);
              }}
              required
              name="searchType"
              className="input pr-8 py-2 appearance-none pl-[2.25rem] placeholder-gray-500 min-w-fit dark:bg-gray-700"
            >
              <option value="string">{t("string")}</option>
              <option value="number">{t("number")}</option>
              <option value="date">{t("date")}</option>
              <option value="boolean">{t("boolean")}</option>
            </select>
            <ChevronDownIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 right-3" />
          </label>
          <div className="inline-flex items-center w-full space-x-2">
            {type !== "boolean" ? (
              <input
                className="input hover:bg-gray-300 dark:bg-gray-700 grow"
                type={type}
                value={type === "number" ? value as number : value.toString()}
                onChange={(e) =>
                  onValueChange(
                    type === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value
                  )
                }
                placeholder={t("placeholder", { label })}
              />
            ) : (
              <input
                className="w-4 h-4 p-0 rounded-md appearance-none input active:bg-bleuFrance-600 checked:bg-bleuFrance-500 checked:ring-2 ring-bleuFrance-200 dark:bg-gray-100 dark:checked:bg-bleuFrance-300 "
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => onValueChange(e.target.checked)}
              />
            )}
            <button
              type="button"
              className="px-2.5 py-2.5 btn-red shrink-0"
              onClick={() => removeInput(slug)}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
