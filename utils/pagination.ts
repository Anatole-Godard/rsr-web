export function getPagination(currentPage, entitiesPerPage) {
    const limit = entitiesPerPage ? parseInt(entitiesPerPage, 10) : 1000;
    const offset =
              currentPage && currentPage !== 1
                  ? (parseInt(currentPage, 10) - 1) * limit
                  : 0;

    return { limit, offset };
}

export function getTotalPages (entitiesCount, size) {
    return Math.ceil(entitiesCount / size);
}
