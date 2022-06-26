/**
 * Given the current page number and the number of entities per page,
 * return the limit and offset values to be used in a query
 * @param currentPage - The current page number.
 * @param entitiesPerPage - The number of entities to display per page.
 * @returns The pagination object is being returned.
 */
export function getPagination(
  currentPage: string | number = 0,
  entitiesPerPage: string | number = 1000
) {
  if (typeof currentPage === "string" && isNaN(parseInt(currentPage)))
    throw new Error("currentPage must be a number or stringified number");

  const limit = entitiesPerPage
    ? parseInt(entitiesPerPage.toString(), 10)
    : 1000;
  const offset =
    currentPage && currentPage !== 1
      ? (parseInt(currentPage.toString(), 10) - 1) * limit
      : 0;

  return { limit, offset };
}

/**
 * Given the number of entities and the size of the page, return the total number of pages
 * @param entitiesCount - the total number of entities
 * @param size - the number of entities to show per page
 * @returns An array of objects.
 */
export function getTotalPages(entitiesCount: number, size: number) {
  return Math.ceil(entitiesCount / size);
}
