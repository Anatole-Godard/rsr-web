import { Resource, ResourceMinimum } from "@definitions/Resource";

/**
 * `toResourceMinimum` takes a `Resource` and returns a `ResourceMinimum`
 * @param {Resource} resource - The resource to be converted.
 */
export const toResourceMinimum = (resource: Resource): ResourceMinimum => ({
  slug: resource.slug,
  description: resource.description,
  tags: resource.tags,
  data: resource.data,
  owner: resource.owner,
  validated: resource.validated,
  createdAt: resource.createdAt,
  visibility: resource.visibility,
  members: resource.members,
  seenBy: resource.seenBy,
});
