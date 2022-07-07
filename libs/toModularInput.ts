import { Input } from "@components/Resource/Helper/ModularInput";
import { Resource } from "@definitions/Resource";

export const toModularInput = (
  properties: Resource["data"]["attributes"]["properties"]
): Input[] => {
  if (!properties) throw new Error("properties is required");
  if (!(properties instanceof Object))
    throw new Error("properties must be an object");

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
