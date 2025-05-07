import {
  Button,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import { useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import { ExpenseType } from "@/gql/graphql";
import { Plus } from "lucide-react";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useRouter } from "next/router";

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
      }
    }
  }
`);

type Inputs = {
  occurredAt: ZonedDateTime;
  type: ExpenseType;
  amount: number;
  notes: string;
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
];

const COLORS: Record<string, string> = {
  fuel: "hsl(var(--heroui-primary))",
  service: "hsl(var(--heroui-secondary))",
  other: "hsl(var(--heroui-muted))",
};

export default function Car() {
  const router = useRouter();

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

  const { register, handleSubmit, control } = useForm<Inputs>({
    defaultValues: {
      occurredAt: now(getLocalTimeZone()),
    },
  });

  const [mutate] = useMutation(createExpense, {
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

  const onSubmit: SubmitHandler<Inputs> = ({
    occurredAt,
    type,
    amount,
    notes,
  }) => {
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
    }).then(({ data }) => {
      if (!data) return;

      onClose();
    });
  };

  return (
    <CarLayout>
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
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit" form="expense">
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </CarLayout>
  );
}
