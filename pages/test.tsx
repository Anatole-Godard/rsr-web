import { Media, MediaUploader } from "@components/helpers/MediaUploader";
import { useState } from "react";

export default function TestPage() {
  const [medias, setMedias] = useState<Media[]>([]);

  return <MediaUploader files={medias} setFiles={setMedias} />;
}
