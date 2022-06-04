import { Input, WrapperModularInputs } from "@components/helpers/ModularInput";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [inputs, setInputs] = useState<Input[]>([]);

  useEffect(() => {
    console.log("parent", inputs);
  }, [inputs]);

  return <WrapperModularInputs data={inputs} setData={setInputs} />;
}
