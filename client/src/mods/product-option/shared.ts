import { graphql } from "@/gql";

export const ModProductOptionDetails = graphql(`
  fragment ModProductOptionDetails on ModProductOption {
    id
    vendor
    name
    link
    price
    notes
    pros
    cons
    specs
  }
`);
