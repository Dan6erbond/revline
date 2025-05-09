import {
  Button,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Progress,
  Select,
  SelectItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Coins, FileUp, Fuel, Plus } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Expense, ExpenseType } from "@/gql/graphql";
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import DocumentChip from "@/components/documents/chip";
import Dropzone from "@/components/dropzone";
import FileIcon from "@/components/file-icon";
import { formatBytes } from "@/utils/upload-file";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useDocumentsUpload } from "@/hooks/use-documents-upload";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

const getExpenses = graphql(`
  query GetExpenses($id: ID!) {
    me {
      id
      profile {
        id
        currencyCode
      }
    }
    car(id: $id) {
      id
      expenses {
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
    }
  }
`);

type Inputs = {
  occurredAt: ZonedDateTime;
  type: ExpenseType;
  amount: number;
  notes: string;
  files: File[];
};

const createExpense = graphql(`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      occurredAt
      type
      amount
      notes
    }
  }
`);

const columns = [
  { key: "occurredAt", label: "Occurred At" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "notes", label: "Notes" },
  { key: "documents", label: "Documents" },
];

const COLORS: Record<ExpenseType, string> = {
  [ExpenseType.Accessories]: "#F31260",
  [ExpenseType.Cleaning]: "#06B7DB",
  [ExpenseType.Fuel]: "#12A150",
  [ExpenseType.Inspection]: "#FBDBA7",
  [ExpenseType.Insurance]: "#C4841D",
  [ExpenseType.Loan]: "#f5a524",
  [ExpenseType.Maintenance]: "#f5a524",
  [ExpenseType.Other]: "#52525b",
  [ExpenseType.Parking]: "#52525B",
  [ExpenseType.Registration]: "#06B7DB",
  [ExpenseType.Repair]: "#CC3EA4",
  [ExpenseType.Service]: "#6020a0",
  [ExpenseType.Tax]: "#C4841D",
  [ExpenseType.Toll]: "#52525B",
  [ExpenseType.Upgrade]: "#6020a0",
};

export default function Car() {
  const router = useRouter();

  const client = useApolloClient();

  const { data } = useQuery(getExpenses, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const expenseData =
    data?.car.expenses?.reduce<Record<string, number>>((acc, expense) => {
      const type = expense.type.toLowerCase();
      acc[type] = (acc[type] || 0) + expense.amount;
      return acc;
    }, {}) ?? {};

  const chartData = Object.entries(expenseData).map(([type, amount]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: amount,
  }));

  const currencyCode = data?.me?.profile?.currencyCode ?? "USD";

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control, reset } = useForm<Inputs>({
    defaultValues: {
      occurredAt: now(getLocalTimeZone()),
      files: [],
    },
  });

  const [handleFileUpload, { uploadProgress }] = useDocumentsUpload();

  const [mutate, { loading }] = useMutation(createExpense, {
    update: (cache, res) => {
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

  const onSubmit: SubmitHandler<Inputs> = withNotification(
    {},
    ({ occurredAt, type, amount, notes, files }) =>
      mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id)!,
            occurredAt: occurredAt.toDate().toISOString(),
            type,
            amount,
            notes,
          },
        },
      })
        .then(({ data }) => {
          if (!data) return;

          reset();

          const expense = data.createExpense;

          return Promise.all(
            files.map((f) =>
              handleFileUpload(f, { expenseID: expense.id }).then(
                ({ data }) => {
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
                }
              )
            )
          );
        })
        .then(onClose)
  );

  return (
    <CarLayout>
      <Tabs variant="underlined" selectedKey="expenses" className="mt-2">
        <Tab
          key="expenses"
          title={
            <div className="flex items-center gap-2">
              <Coins />
              <span>Expenses</span>
            </div>
          }
          href={`/cars/${router.query.id}`}
        >
          <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 container mx-auto">
            <div className="flex justify-between">
              <h1 className="text-2xl">Expenses</h1>
              <div>
                <Button
                  onPress={onOpen}
                  startContent={<Plus />}
                  className="self-end"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="aspect-video min-h-[300px] rounded-2xl bg-primary/5 backdrop-blur-xl px-6 md:px-10 py-8 md:py-12 border border-primary/10 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="hsl(var(--heroui-primary))"
                    label={({ name }) => name}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name.toLowerCase()] || COLORS.other}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--heroui-background))",
                      color: "hsl(var(--heroui-foreground))",
                      borderRadius: "0.5rem",
                      border: "1px solid hsl(var(--heroui-default))",
                    }}
                    labelStyle={{ color: "hsl(var(--heroui-foreground))" }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: 16,
                      color: "hsl(var(--heroui-foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <Table isHeaderSticky>
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={data?.car?.expenses ?? []}
                emptyContent={"No rows to display."}
              >
                {(ex) => (
                  <TableRow key={ex.id}>
                    <TableCell>
                      {new Date(ex.occurredAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{ex.type}</TableCell>
                    <TableCell>
                      {ex.amount.toLocaleString([], {
                        style: "currency",
                        currency: currencyCode,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>{ex.notes}</TableCell>
                    <TableCell className="flex gap-2 flex-wrap">
                      {ex.documents?.map((doc) => (
                        <DocumentChip document={doc} key={doc.id} />
                      ))}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              scrollBehavior="inside"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>Enter Expense</ModalHeader>
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
                          // endContent={<Fuel />}
                          {...register("type")}
                          variant="bordered"
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
                            />
                          )}
                        />
                        <Textarea
                          label="Notes"
                          {...register("notes")}
                          variant="bordered"
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
                        isLoading={loading || uploadProgress.length > 0}
                      >
                        Save
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </Tab>
        <Tab
          key="fuelups"
          title={
            <div className="flex items-center gap-2">
              <Fuel />
              <span>Fuel-ups</span>
            </div>
          }
          href={`/cars/${router.query.id}/fuelups`}
        />
      </Tabs>
    </CarLayout>
  );
}
