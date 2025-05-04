import { Input, Spinner } from "@heroui/react";
import { useMutation, useSuspenseQuery } from "@apollo/client";

import MediaItem from "@/components/media/item";
import { getAlbum } from "@/components/album/shared";
import { graphql } from "@/gql";
import useDebounce from "@/hooks/use-debounce";
import { useState } from "react";

const updateAlbum = graphql(`
  mutation UpdateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
      id
      title
      media {
        id
        ...MediaItem
      }
    }
  }
`);

export default function AlbumView({ id }: { id: string }) {
  const { data } = useSuspenseQuery(getAlbum, {
    variables: { id },
    skip: !id,
  });

  const [mutate, { loading }] = useMutation(updateAlbum);

  const [title, setTitle] = useState(data?.album.title);

  const handleTitleChange = useDebounce({
    handle: (val: string) => {
      mutate({
        variables: {
          id,
          input: { title: val },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateAlbum: {
            id,
            title: val,
          },
        },
      });

      setTitle(val);
    },
  });

  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-xl mx-auto">
      <Input
        label="Title"
        variant="underlined"
        className="border-b mr-10"
        value={title}
        onValueChange={handleTitleChange}
        size="lg"
        endContent={loading && <Spinner />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.album.media?.map((m) => (
          <MediaItem item={m} key={m.id} />
        ))}
      </div>
    </div>
  );
}
