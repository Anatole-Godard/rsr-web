import { UserMinimum } from "@definitions/User";
import { ExternalLinkWithoutRedundancy } from "./ExternalLink";
import { GeoJSONPointWithoutRedundancy } from "./GeoJSON";
import { Media } from "./Media";

export interface Event {
  //   location: {
  //     type: "online_event" | "in_place_event";
  //     data: GeoJSONPointwithoutRedundancy | ExternalLinkWithoutRedundancy;
  //   };
  properties: {
    name: string;
    startDate: string | Date;
    endDate?: string | Date;
    medias?: Media[];
    participants: UserMinimum[];
  };
}
