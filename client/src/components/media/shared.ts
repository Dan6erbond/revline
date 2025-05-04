import { graphql } from "@/gql";

export const MediaItemFields = graphql(`
  fragment MediaItem on Media {
    id
    url
    title
    description
    metadata {
      contentType
    }
  }
`);
