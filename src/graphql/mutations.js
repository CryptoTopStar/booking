/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createInquiry = /* GraphQL */ `
  mutation CreateInquiry(
    $input: CreateInquiryInput!
    $condition: ModelInquiryConditionInput
  ) {
    createInquiry(input: $input, condition: $condition) {
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
export const updateInquiry = /* GraphQL */ `
  mutation UpdateInquiry(
    $input: UpdateInquiryInput!
    $condition: ModelInquiryConditionInput
  ) {
    updateInquiry(input: $input, condition: $condition) {
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
export const deleteInquiry = /* GraphQL */ `
  mutation DeleteInquiry(
    $input: DeleteInquiryInput!
    $condition: ModelInquiryConditionInput
  ) {
    deleteInquiry(input: $input, condition: $condition) {
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
