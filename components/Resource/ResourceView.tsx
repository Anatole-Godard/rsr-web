import { Resource } from "@definitions/Resource";
import { EventView } from "./TypeViews/Event";
import { ExternalLinkView } from "./TypeViews/ExternalLink";
import { LocationView } from "./TypeViews/Location";
import { OtherView } from "./TypeViews/Other";
import { PhysicalItemView } from "./TypeViews/PhysicalItem";

interface ResourceViewProps {
  type: Resource["data"]["type"];
  attributes: Resource["data"]["attributes"];
  slug: Resource["slug"];
  updatedAt: Resource["updatedAt"];
}

export const ResourceView = ({
    type,
    attributes,
    slug,
    updatedAt,
  }: ResourceViewProps) => {
    return (
      <div className="grid h-full gap-6 min-h-max xl:grid-cols-3 md:grid-cols-2">
        {type === "location" && (
          <LocationView attributes={attributes} slug={slug} />
        )}
        {type === "physical_item" && (
          <PhysicalItemView
            attributes={attributes}
            slug={slug}
            updatedAt={updatedAt.toString()}
          />
        )}
        {type === "external_link" && (
          <ExternalLinkView
            attributes={attributes}
            slug={slug}
            updatedAt={updatedAt.toString()}
          />
        )}
        {type === "event" && (
          <EventView
            attributes={attributes}
            slug={slug}
            updatedAt={updatedAt.toString()}
          />
        )}
        {type === "other" && (
          <OtherView
            attributes={attributes}
            slug={slug}
            updatedAt={updatedAt.toString()}
          />
        )}
      </div>
    );
  };