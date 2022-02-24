import { Resource, ResourceMinimum } from "@definitions/Resource";

export const toResourceMinimum = (resource: Resource): ResourceMinimum => ({
  slug: resource.slug,
  description: resource.description,
  tags: resource.tags,
  data: resource.data,
  owner: resource.owner,
  validated: resource.validated,
  createdAt: resource.createdAt,
});
