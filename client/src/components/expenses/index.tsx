import {
  Button,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
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
import { Coins, Edit, Fuel, Plus, Trash } from "lucide-react";
import ExpenseModal, { ExpenseFields } from "@/components/expenses/modal";
import { graphql, useFragment } from "@/gql";
import { useMutation, useQuery } from "@apollo/client";

import DeleteModal from "@/components/modals/delete";
import DocumentChip from "@/components/documents/chip";
import { ExpenseType } from "@/gql/graphql";
import { FuelUpChip } from "@/components/fuelups/chip";
import { ServiceLogChip } from "@/components/maintenance/service/logs/chip";
import { createExtensions } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";
import { generateHTML } from "@tiptap/react";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUnits } from "@/hooks/use-units";

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

const deleteExpense = graphql(`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id)
  }
`);

const columns = [
  { key: "occurredAt", label: "Occurred At" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "notes", label: "Notes" },
  { key: "documents", label: "Documents" },
  { key: "fuelup", label: "Fuel-up" },
  { key: "service", label: "Service" },
  { key: "actions", label: "" },
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

export default function Expenses() {
  const router = useRouter();

  const { data } = useQuery(getExpenses, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const expenseData =
    data?.car.expenses?.reduce<Record<string, number>>((acc, expense) => {
      const ex = useFragment(ExpenseFields, expense);
      const type = ex.type.toLowerCase();
      acc[type] = (acc[type] || 0) + ex.amount;
      return acc;
    }, {}) ?? {};

  const chartData = Object.entries(expenseData).map(([type, amount]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: amount,
    type: type as ExpenseType,
  }));

  const { currencyCode } = useUnits(data?.me?.settings);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [editing, setEditing] = useState<string | null>(null);

  const [mutateDelete, { loading }] = useMutation(deleteExpense, {
    update: (cache, _, { variables }) => {
      if (!variables?.id || !data?.car) return;

      cache.writeQuery({
        query: getExpenses,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            expenses:
              (data.car.expenses?.filter((ex) => {
                const e = useFragment(ExpenseFields, ex);

                return e.id !== variables.id;
              }) as any) ?? [],
          },
        },
      });
    },
  });

  const [deleting, setDeleting] = useState<string | null>(null);

  return (
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
                aria-label="Add Expense"
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
                      fill={COLORS[entry.type] || COLORS.other}
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

          <Table isHeaderSticky aria-label="Expenses">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={data?.car?.expenses ?? []}
              emptyContent={"No rows to display."}
            >
              {(expense) => {
                const ex = useFragment(ExpenseFields, expense);

                return (
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
                    <TableCell>
                      <div
                        className="prose"
                        dangerouslySetInnerHTML={
                          ex.notes && {
                            __html: generateHTML(
                              ex.notes,
                              createExtensions("")
                            ),
                          }
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {ex.documents?.map((doc) => (
                          <DocumentChip document={doc} key={doc.id} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {expense.fuelUp && (
                        <FuelUpChip
                          fuelUp={expense.fuelUp}
                          href={`/cars/${router.query.id}/fuelups`}
                          fuelVolumeUnit={data?.me?.settings?.fuelVolumeUnit}
                          distanceUnit={data?.me?.settings?.distanceUnit}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {expense.serviceLog && (
                        <ServiceLogChip
                          log={expense.serviceLog}
                          href={`/cars/${router.query.id}/maintenance`}
                          distanceUnit={data?.me?.settings?.distanceUnit}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          onPress={() => setEditing(ex.id)}
                        >
                          <Edit className="size-5" />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          size="sm"
                          onPress={() => setDeleting(ex.id)}
                        >
                          <Trash className="size-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>

          <ExpenseModal
            currencyCode={currencyCode}
            isOpen={isOpen || !!editing}
            onOpenChange={editing ? () => setEditing(null) : onOpenChange}
            expense={data?.car.expenses?.find((ex) => {
              const e = useFragment(ExpenseFields, ex);
              return e.id === editing;
            })}
            key={editing}
          />

          <DeleteModal
            titleMessage="Are you sure you want to delete this expense?"
            isOpen={!!deleting}
            onClose={() => setDeleting(null)}
            onDelete={() =>
              mutateDelete({ variables: { id: deleting! } }).then(() =>
                setDeleting(null)
              )
            }
            confirmProps={{ isLoading: loading }}
          />
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
  );
}
