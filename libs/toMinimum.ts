import { Resource, ResourceMinimum } from "@definitions/Resource";

/**
 * `toResourceMinimum` takes a `Resource` and returns a `ResourceMinimum`
 * @param {Resource} resource - The resource to be converted.
 */
export const toResourceMinimum = (resource: Resource): ResourceMinimum => {
  if (!resource) throw new Error("resource is required");
  return {
    slug: resource.slug,
    owner: resource.owner,
    createdAt: resource.createdAt,
    description: resource.description,
    tags: resource.tags,
    data: resource.data,
    validated: resource.validated,
    visibility: resource.visibility,
    members: resource.members,
    seenBy: resource.seenBy,
    updatedAt: resource.updatedAt,
  };
};
