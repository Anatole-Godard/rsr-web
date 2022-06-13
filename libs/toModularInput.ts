import { Input } from "@components/helpers/ModularInput";
import { Resource } from "@definitions/Resource";

export const toModularInput = (
  properties: Resource["data"]["attributes"]["properties"]
): Input[] => {
  const array: Input[] = Object.values(
    (properties as { [key: string]: any | Input }) || []
  ).filter(
    (property) =>
      property?.type !== undefined &&
      property?.label !== undefined &&
      property?.slug !== undefined &&
      property?.value !== undefined
  );

  return array;
};
