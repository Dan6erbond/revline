import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { Edit, Fuel, Plus, Trash } from "lucide-react";
import FuelUpModal, { FuelUpFields } from "./modal";
import {
  distanceUnits,
  fuelConsumptionUnitsShort,
  fuelVolumeUnits,
} from "@/literals";
import { graphql, useFragment } from "@/gql";
import { useMutation, useQuery } from "@apollo/client";

import DeleteModal from "../modals/delete";
import DocumentChip from "../documents/chip";
import { FuelCategory } from "@/gql/graphql";
import { createExtensions } from "../minimal-tiptap/hooks/use-minimal-tiptap";
import { generateHTML } from "@tiptap/react";
import { getCurrencySymbol } from "@/utils/currency";
import { getDistance } from "@/utils/distance";
import { getFuelConsumption } from "@/utils/fuel-consumption";
import { getFuelVolume } from "@/utils/fuel-volume";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUnits } from "@/hooks/use-units";

const getFuelUps = graphql(`
  query GetFuelUps($id: ID!) {
    me {
      id
      settings {
        id
        fuelConsumptionUnit
        currencyCode
        distanceUnit
        fuelVolumeUnit
      }
    }
    car(id: $id) {
      id
      fuelUps {
        ...FuelUpFields
        documents {
          id
          name
          tags
          metadata {
            contentType
          }
        }
      }
      averageConsumptionLitersPerKm
    }
  }
`);

const deleteFuelUp = graphql(`
  mutation DeleteFuelUp($id: ID!) {
    deleteFuelUp(id: $id)
  }
`);

const columns = [
  { key: "occurredAt", label: "Occurred At" },
  { key: "station", label: "Station" },
  { key: "amount", label: "Amount" },
  { key: "cost", label: "Cost" },
  { key: "fuelCategory", label: "Fuel Category" },
  { key: "odometer", label: "Odometer" },
  { key: "notes", label: "Notes" },
  { key: "fullTank", label: "Full Tank" },
  { key: "documents", label: "Documents" },
  { key: "actions", label: "" },
];

export default function FuelUps() {
  const router = useRouter();

  const { data } = useQuery(getFuelUps, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { fuelVolumeUnit, distanceUnit, currencyCode, fuelConsumptionUnit } =
    useUnits(data?.me.settings);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [editing, setEditing] = useState<string | null>(null);

  const [mutateDelete, { loading }] = useMutation(deleteFuelUp, {
    update: (cache, res, { variables }) => {
      if (!variables?.id || !data?.car) return;

      cache.writeQuery({
        query: getFuelUps,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            fuelUps:
              (data.car.fuelUps?.filter((fu) => {
                const f = useFragment(FuelUpFields, fu);

                return f.id !== variables.id;
              }) as any) ?? [],
          },
        },
      });
    },
  });

  const [deleting, setDeleting] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 container mx-auto">
        <div className="flex justify-between">
          <div>
            {data?.car.averageConsumptionLitersPerKm && (
              <Card className="bg-primary-50/5 border border-border rounded-xl shadow-sm">
                <CardHeader className="flex items-center gap-3 pb-1">
                  <Fuel className="text-primary w-5 h-5" />
                  <h4 className="text-md font-medium">Average Consumption</h4>
                </CardHeader>
                <CardBody className="pt-1 text-2xl font-semibold text-foreground">
                  {getFuelConsumption(
                    data.car.averageConsumptionLitersPerKm,
                    fuelConsumptionUnit
                  ).toLocaleString()}{" "}
                  <span className="text-muted-foreground text-base font-normal">
                    {fuelConsumptionUnitsShort[fuelConsumptionUnit]}
                  </span>
                </CardBody>
              </Card>
            )}
          </div>
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
            <ComposedChart
              data={data?.car.fuelUps?.map((f) => {
                const fu = useFragment(FuelUpFields, f);

                return {
                  ...fu,
                  occurredAt: new Date(fu.occurredAt).toLocaleDateString(),
                  relativeCost: fu.expense?.amount
                    ? fu.expense.amount / fu.amountLiters
                    : 0,
                  amount: getFuelVolume(fu.amountLiters, fuelVolumeUnit),
                };
              })}
            >
              <XAxis
                dataKey="occurredAt"
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                stroke="hsl(var(--heroui-foreground))"
              />
              <YAxis
                yAxisId="amount"
                dataKey="amount"
                unit={fuelVolumeUnits[fuelVolumeUnit]}
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                stroke="hsl(var(--heroui-foreground))"
              />
              <YAxis
                yAxisId="cost"
                orientation="right"
                dataKey="relativeCost"
                unit={getCurrencySymbol(currencyCode)}
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                stroke="hsl(var(--heroui-foreground))"
              />
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
              <Bar
                yAxisId="amount"
                dataKey="amount"
                fill="hsl(var(--heroui-secondary-400))"
                name={`Amount (${fuelVolumeUnits[fuelVolumeUnit]})`}
              />
              <Line
                yAxisId="cost"
                type="monotone"
                dataKey="relativeCost"
                stroke="hsl(var(--heroui-primary))"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: "hsl(var(--heroui-primary))",
                  fill: "white",
                }}
                name={`Cost (${getCurrencySymbol(currencyCode)}/L)`}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <Table isHeaderSticky>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data?.car?.fuelUps ?? []}
            emptyContent={"No rows to display."}
          >
            {(f) => {
              const fu = useFragment(FuelUpFields, f);

              return (
                <TableRow key={fu.id}>
                  <TableCell>
                    {new Date(fu.occurredAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{fu.station}</TableCell>
                  <TableCell>
                    {getFuelVolume(fu.amountLiters, fuelVolumeUnit)}{" "}
                    {fuelVolumeUnits[fuelVolumeUnit]}
                  </TableCell>
                  <TableCell>
                    {fu.expense?.amount.toLocaleString([], {
                      style: "currency",
                      currency: currencyCode,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{`${fu.fuelCategory}${
                    fu.fuelCategory === FuelCategory.Petrol
                      ? " (" + fu.octaneRating + ")"
                      : ""
                  }`}</TableCell>
                  <TableCell>
                    {fu.odometerReading?.readingKm &&
                      `${getDistance(
                        fu.odometerReading?.readingKm,
                        distanceUnit
                      ).toLocaleString()} ${distanceUnits[distanceUnit]}`}
                  </TableCell>
                  <TableCell>
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={
                        fu.notes && {
                          __html: generateHTML(fu.notes, createExtensions("")),
                        }
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox isSelected={fu.isFullTank} isReadOnly />
                  </TableCell>
                  <TableCell className="flex gap-2 flex-wrap">
                    {f.documents?.map((doc) => (
                      <DocumentChip document={doc} key={doc.id} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onPress={() => setEditing(fu.id)}
                      >
                        <Edit className="size-5" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        size="sm"
                        onPress={() => setDeleting(fu.id)}
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
      </div>

      <FuelUpModal
        settings={data?.me.settings}
        isOpen={isOpen || !!editing}
        onOpenChange={editing ? () => setEditing(null) : onOpenChange}
        fuelUp={data?.car.fuelUps?.find((fu) => {
          const f = useFragment(FuelUpFields, fu);
          return f.id === editing;
        })}
        key={editing}
      />

      <DeleteModal
        titleMessage="Are you sure you want to delete this fuel-up?"
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onDelete={() =>
          mutateDelete({ variables: { id: deleting! } }).then(() =>
            setDeleting(null)
          )
        }
        confirmProps={{ isLoading: loading }}
      />
    </>
  );
}
