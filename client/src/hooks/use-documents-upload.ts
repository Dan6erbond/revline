import { Car, CreateDocumentInput } from "@/gql/graphql";
import { useApolloClient, useMutation } from "@apollo/client";
import { useCallback, useState } from "react";

import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { uploadFile } from "@/utils/upload-file";
import { useRouter } from "next/router";

const uploadDocument = graphql(`
  mutation UploadDocument($input: CreateDocumentInput!) {
    uploadDocument(input: $input) {
      document {
        id
        name
        tags
        url
      }
      uploadUrl
    }
  }
`);

export const useDocumentsUpload = () => {
  const router = useRouter();

  const client = useApolloClient();

  const [uploadProgress, setUploadProgress] = useState<
    {
      id: string;
      file: File;
      progress: number;
      completed: boolean;
      error?: string;
    }[]
  >([]);

  const [mutate] = useMutation(uploadDocument);

  const handleFileUpload = useCallback(
    async (file: File, input?: Partial<CreateDocumentInput>) => {
      const res = await mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id) as string,
            name: file.name,
            ...input,
          },
        },
      });

      if (!res.data?.uploadDocument) return res;

      setUploadProgress((prev) => [
        ...prev,
        {
          id: res.data!.uploadDocument.document.id,
          file,
          completed: false,
          progress: 0,
        },
      ]);

      await uploadFile(
        file,
        res.data.uploadDocument.uploadUrl,
        "PUT",
        (progress) => {
          setUploadProgress((prev) =>
            prev.map((p) =>
              p.id === res.data!.uploadDocument.document.id
                ? { ...p, progress }
                : p
            )
          );
        }
      );

      setUploadProgress((prev) =>
        prev.filter((p) => p.id !== res.data!.uploadDocument.document.id)
      );

      client.cache.modify<Car>({
        id: client.cache.identify({
          __typename: "Car",
          id: getQueryParam(router.query.id),
        }),
        fields: {
          documents(existingDocRefs, { toReference }) {
            return [
              ...(existingDocRefs ?? []),
              toReference(res.data!.uploadDocument.document),
            ];
          },
        },
      });

      return res;
    },
    [mutate, router.query.id, client]
  );

  return [handleFileUpload, { uploadProgress }] as const;
};
