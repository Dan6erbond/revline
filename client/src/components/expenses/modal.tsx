import {
  Button,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  NumberInput,
  Progress,
  Select,
  SelectItem,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Expense, ExpenseType } from "@/gql/graphql";
import { FragmentType, graphql, useFragment } from "@/gql";
import {
  ZonedDateTime,
  getLocalTimeZone,
  now,
  parseAbsolute,
} from "@internationalized/date";
import { useApolloClient, useMutation } from "@apollo/client";

import Dropzone from "@/components/dropzone";
import FileIcon from "@/components/file-icon";
import { FileUp } from "lucide-react";
import { JSONContent } from "@tiptap/react";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { formatBytes } from "@/utils/upload-file";
import { getQueryParam } from "@/utils/router";
import { useDocumentsUpload } from "@/hooks/use-documents-upload";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

export const ExpenseFields = graphql(`
  fragment ExpenseFields on Expense {
    id
    occurredAt
    type
    amount
    notes
    documents {
      id
      name
      tags
      metadata {
        contentType
      }
    }
  }
`);

const getExpenses = graphql(`
  query GetExpenses($id: ID!) {
    me {
      id
      settings {
        id
        currencyCode
        fuelVolumeUnit
        distanceUnit
      }
    }
    car(id: $id) {
      id
      expenses {
        ...ExpenseFields
        fuelUp {
          id
          occurredAt
          station
          amountLiters
          fuelCategory
          octaneRating
          odometerReading {
            id
            readingKm
          }
          notes
          isFullTank
        }
        serviceLog {
          id
          datePerformed
          odometerReading {
            id
            readingKm
          }
          performedBy
          notes
        }
      }
    }
  }
`);

type Inputs = {
  occurredAt: ZonedDateTime;
  type: ExpenseType;
  amount: number;
  notes: JSONContent;
  files: File[];
};

const createExpense = graphql(`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      ...ExpenseFields
    }
  }
`);

const updateExpense = graphql(`
  mutation UpdateExpense($id: ID!, $input: UpdateExpenseInput!) {
    updateExpense(id: $id, input: $input) {
      ...ExpenseFields
    }
  }
`);

export default function ExpenseModal({
  currencyCode,
  expense,
  ...props
}: {
  currencyCode: string;
  expense?: FragmentType<typeof ExpenseFields>;
} & Omit<ModalProps, "children">) {
  const router = useRouter();

  const client = useApolloClient();

  const ex = useFragment(ExpenseFields, expense);

  const { register, handleSubmit, control, reset } = useForm<Inputs>({
    defaultValues: {
      files: [],
      ...ex,
      occurredAt: ex?.occurredAt
        ? parseAbsolute(ex.occurredAt, getLocalTimeZone())
        : now(getLocalTimeZone()),
    },
  });

  const [handleFileUpload, { uploadProgress }] = useDocumentsUpload();

  const [mutate, { loading }] = useMutation(createExpense, {
    update: (cache, res) => {
      const data = cache.readQuery({
        query: getExpenses,
        variables: { id: getQueryParam(router.query.id) as string },
      });

      if (!res.data?.createExpense || !data?.car) return;

      cache.writeQuery({
        query: getExpenses,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            expenses: [...(data.car.expenses ?? []), res.data.createExpense],
          },
        },
      });
    },
  });

  const [update, { loading: updating }] = useMutation(updateExpense);

  const onSubmit: SubmitHandler<Inputs> = withNotification(
    { title: "Saving expense..." },
    ({ occurredAt, type, amount, notes, files }) => {
      const input = {
        occurredAt: occurredAt.toDate().toISOString(),
        type,
        amount,
        notes,
      };

      if (ex) {
        return update({
          variables: {
            id: ex.id,
            input: input,
          },
        }).then(props.onClose ?? (() => props.onOpenChange?.(false)));
      }

      return mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id)!,
            ...input,
          },
        },
      })
        .then(({ data }) => {
          if (!data) return;

          reset();

          const expense = data.createExpense;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const ex = useFragment(ExpenseFields, expense);

          return Promise.all(
            files.map((f) =>
              handleFileUpload(f, { expenseID: ex.id }).then(({ data }) => {
                if (!data?.uploadDocument) return;

                client.cache.modify<Expense>({
                  id: client.cache.identify(expense),
                  fields: {
                    documents(existingDocRefs, { toReference, readField }) {
                      return [
                        ...(existingDocRefs ?? []).filter(
                          (doc) =>
                            readField({ from: doc, fieldName: "id" }) !==
                            data!.uploadDocument.document.id
                        ),
                        toReference(data!.uploadDocument.document),
                      ];
                    },
                  },
                });
              })
            )
          );
        })
        .then(props.onClose ?? (() => props.onOpenChange?.(false)));
    }
  );

  return (
    <Modal scrollBehavior="inside" {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{expense ? "Update" : "Enter"} Expense</ModalHeader>
            <ModalBody>
              <form
                id="expense"
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="occurredAt"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      hideTimeZone
                      showMonthAndYearPickers
                      label="Date"
                      {...field}
                      variant="bordered"
                    />
                  )}
                />
                <Select
                  label="Type"
                  {...register("type")}
                  variant="bordered"
                  aria-label="Type"
                >
                  {Object.entries(ExpenseType).map(([label, type]) => (
                    <SelectItem key={type}>{label}</SelectItem>
                  ))}
                </Select>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, ...field } }) => (
                    <NumberInput
                      label="Amount"
                      className="min-w-36"
                      endContent={currencyCode}
                      {...field}
                      onValueChange={onChange}
                      variant="bordered"
                      aria-label="Amount"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="notes"
                  render={({ field }) => <MinimalTiptapEditor {...field} />}
                />
                <Controller
                  control={control}
                  name="files"
                  render={({ field: { value, onChange } }) => (
                    <Dropzone
                      value={value}
                      onChange={onChange}
                      multiple
                      label="Drag & drop files or click to browse"
                      icon={<FileUp className="size-4 opacity-60" />}
                    />
                  )}
                />
                {uploadProgress.length > 0 && (
                  <div className="space-y-2">
                    {uploadProgress.map(({ file, id, progress }) => (
                      <div
                        key={id}
                        className="bg-background flex flex-col gap-2"
                      >
                        <Progress value={progress} size="sm" />
                        <div className="flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                              <FileIcon file={file} />
                            </div>
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <p className="truncate text-[13px] font-medium">
                                {file.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {formatBytes(file.size)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                type="submit"
                form="expense"
                isLoading={loading || updating || uploadProgress.length > 0}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
