import { PageRequest, SortingOption } from '../entities/proto/api/v1/common_pb'

/**
 * Common input type for pagination parameters
 */
export type PaginationInput = {
  pageSize?: number
  cursor?: string
  sort?: Partial<SortingOption.AsObject>
}

/**
 * Common type for option items in metadata
 */
export type Option<T> = {
  id: string
  label: string
  value: T
}

/**
 * Creates a SortingOption from partial option data
 * @param sortData The partial sorting data
 * @returns A SortingOption object or undefined if no data provided
 */
export const createSortingOption = (sortData?: Partial<SortingOption.AsObject>): SortingOption | undefined => {
  if (!sortData || (!sortData.kind && sortData.orderAscending === undefined)) {
    return undefined
  }

  const option = new SortingOption()
  if (sortData.kind) {
    option.setKind(sortData.kind)
  }
  if (sortData.orderAscending !== undefined) {
    option.setOrderAscending(sortData.orderAscending)
  }
  return option
}

/**
 * Creates a PageRequest object from pagination input
 * @param input The pagination parameters
 * @returns A configured PageRequest object or undefined if no pagination parameters provided
 */
export const createPageRequest = (input: PaginationInput): PageRequest | undefined => {
  if (!input.pageSize && !input.cursor && !input.sort) {
    return undefined
  }

  const pagination = new PageRequest()

  if (input.pageSize) {
    pagination.setPageSize(input.pageSize)
  }

  if (input.cursor) {
    pagination.setCursor(input.cursor)
  }

  const sortOption = createSortingOption(input.sort)
  if (sortOption) {
    pagination.setSortingList([sortOption])
  }

  return pagination
}
