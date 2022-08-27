/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getInquiry = /* GraphQL */ `
  query GetInquiry($id: ID!) {
    getInquiry(id: $id) {
      id
      name
      email
      title
      text
      createdAt
      updatedAt
    }
  }
`;
export const listInquirys = /* GraphQL */ `
  query ListInquirys(
    $filter: ModelInquiryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInquirys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        title
        text
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
