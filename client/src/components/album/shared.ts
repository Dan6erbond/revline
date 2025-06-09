import { graphql } from "@/gql";

export const getAlbum = graphql(`
  query GetAlbum(
    $id: ID!
    $where: MediaWhereInput
    $first: Int
    $after: Cursor
    $orderBy: [MediaOrder!]
  ) {
    album(id: $id) {
      id
      title
      media(where: $where, first: $first, after: $after, orderBy: $orderBy) {
        edges {
          node {
            id
            ...MediaItem
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
      car {
        id
        name
        owner {
          id
          email
          profile {
            id
            username
            pictureUrl
          }
        }
      }
    }
  }
`);
