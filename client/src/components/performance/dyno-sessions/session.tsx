import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip as HeroTooltip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Selection,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  cn,
  useDisclosure,
} from "@heroui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  FilePlus,
  Files,
  Gauge,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Trash,
  X,
} from "lucide-react";
import { FormEventHandler, Key, ReactElement, useState } from "react";
import { PowerUnit, TorqueUnit } from "@/gql/graphql";
import { getKilowatts, getPower } from "@/utils/power";
import { getNm, getTorque } from "@/utils/torque";
import { powerUnitsShort, torqueUnitsShort } from "@/literals";
import { useMutation, useQuery, useSuspenseQuery } from "@apollo/client";

import DocumentChip from "@/components/documents/chip";
import FancySwitch from "@/components/fancy-switch";
import FileIcon from "@/components/file-icon";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

const getDynoSession = graphql(`
  query GetDynoSession($id: ID!) {
    me {
      id
      settings {
        id
        powerUnit
        torqueUnit
      }
    }
    dynoSession(id: $id) {
      id
      title
      notes
      results {
        id
        rpm
        powerKw
        torqueNm
      }
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
`);

const getDocuments = graphql(`
  query GetDocuments($id: ID!) {
    car(id: $id) {
      id
      documents {
        id
        name
        tags
        url
        metadata {
          contentType
          size
        }
      }
    }
  }
`);

const updateDynoSession = graphql(`
  mutation UpdateDynoSession($id: ID!, $input: UpdateDynoSessionInput!) {
    updateDynoSession(id: $id, input: $input) {
      id
      title
      notes
      results {
        id
        rpm
        powerKw
        torqueNm
      }
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
`);

type Inputs = {
  rpm: number;
  power: number;
  torque: number;
};

const createDynoResult = graphql(`
  mutation CreateDynoResult($input: CreateDynoResultInput!) {
    createDynoResult(input: $input) {
      id
      rpm
      powerKw
      torqueNm
    }
  }
`);

const deleteDynoResults = graphql(`
  mutation DeleteDynoResults($ids: [ID!]!) {
    deleteDynoResults(ids: $ids)
  }
`);

export default function Session() {
  const router = useRouter();

  const { data } = useSuspenseQuery(getDynoSession, {
    variables: {
      id: router.query.tab![1],
    },
  });

  const { data: documentsData } = useQuery(getDocuments, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [selectedRows, setSelectedRows] = useState<Selection>(new Set());

  const powerUnit = data?.me?.settings?.powerUnit ?? PowerUnit.ImpHorsepower;
  const torqueUnit = data?.me?.settings?.torqueUnit ?? TorqueUnit.PoundFeet;

  const [visible, setVisible] = useState({
    power: true,
    torque: true,
  });

  const handleLegendClick = (e: Payload) => {
    const key = e.dataKey === "powerKw" ? "power" : "torque";
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [bulkAddType, setBulkAddType] = useState<string | ReactElement>("both");
  const [bulkAddResults, setBulkAddResults] = useState("");

  const {
    isOpen: isBulkAddOpen,
    onOpen: onBulkAddOpen,
    onClose: onBulkAddClose,
    onOpenChange: onBulkAddOpenChange,
  } = useDisclosure();

  const { handleSubmit, control } = useForm<Inputs>({
    defaultValues: {},
  });

  const [mutate, { loading }] = useMutation(updateDynoSession);

  const [mutateCreate, { loading: isCreating }] = useMutation(
    createDynoResult,
    {
      update(cache, res) {
        if (!res.data?.createDynoResult) return;

        const data = cache.readQuery({
          query: getDynoSession,
          variables: {
            id: router.query.tab![1],
          },
        });

        if (!data?.dynoSession) return;

        cache.writeQuery({
          query: getDynoSession,
          variables: {
            id: router.query.tab![1],
          },
          data: {
            ...data,
            dynoSession: {
              ...data.dynoSession,
              results: [
                ...(data.dynoSession.results ?? []),
                res.data.createDynoResult,
              ],
            },
          },
        });
      },
    }
  );

  const [mutateDelete, { loading: deleting }] = useMutation(deleteDynoResults, {
    update(cache, res, { variables }) {
      if (!res.data?.deleteDynoResults || !data.dynoSession) return;

      cache.writeQuery({
        query: getDynoSession,
        variables: {
          id: router.query.tab![1],
        },
        data: {
          ...data,
          dynoSession: {
            ...data.dynoSession,
            results: data.dynoSession.results?.filter(
              (res) => !variables?.ids.includes(res.id)
            ),
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({ rpm, power, torque }) => {
    mutateCreate({
      variables: {
        input: {
          sessionID: router.query.tab![1],
          rpm,
          powerKw: getKilowatts(power, powerUnit),
          torqueNm: getNm(torque, torqueUnit),
        },
      },
    }).then(() => {
      onClose();
    });
  };

  const handleAction = (action: Key) => {
    switch (action) {
      case "add":
        onOpen();
        break;
      case "bulk-add":
        onBulkAddOpen();
        break;
    }
  };

  const handleBulkAddSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    Promise.all(
      bulkAddResults.split("\n").map((res) => {
        let [rpm, power, torque] = ["", "", ""];

        switch (bulkAddType) {
          case "power":
            [rpm, power] = res.split(",");
            return mutateCreate({
              variables: {
                input: {
                  sessionID: router.query.tab![1],
                  rpm: parseInt(rpm.trim()),
                  powerKw: getKilowatts(parseInt(power.trim()), powerUnit),
                },
              },
            });
          case "torque":
            [rpm, torque] = res.split(",");
            return mutateCreate({
              variables: {
                input: {
                  sessionID: router.query.tab![1],
                  rpm: parseInt(rpm.trim()),
                  torqueNm: getTorque(parseInt(torque.trim()), torqueUnit),
                },
              },
            });
          case "both":
            [rpm, power, torque] = res.split(",");
            return mutateCreate({
              variables: {
                input: {
                  sessionID: router.query.tab![1],
                  rpm: parseInt(rpm.trim()),
                  powerKw: getKilowatts(parseInt(power.trim()), powerUnit),
                  torqueNm: getTorque(parseInt(torque.trim()), torqueUnit),
                },
              },
            });
        }
      })
    ).then(() => {
      setBulkAddResults("");
      onBulkAddClose();
    });
  };

  return (
    <div className="flex flex-col gap-8 container mx-auto">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">{data?.dynoSession?.title}</h2>
        <MinimalTiptapEditor
          placeholder="Notes"
          throttleDelay={750}
          value={data.dynoSession.notes}
          onChange={(c) => {
            mutate({
              variables: {
                id: router.query.tab![1],
                input: { notes: c },
              },
            });
          }}
          toolbarOptions={{
            endContent: (
              <div className="ml-auto">{loading && <Spinner size="sm" />}</div>
            ),
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <p>Documents</p>

        <div className="flex flex-wrap gap-2">
          {data.dynoSession.documents?.map((doc) => (
            <DocumentChip
              key={doc.id}
              document={doc}
              endContent={
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  radius="full"
                  onClick={(e) => e.preventDefault()}
                  onPress={withNotification({}, () =>
                    mutate({
                      variables: {
                        id: router.query.tab![1],
                        input: { removeDocumentIDs: [doc.id] },
                      },
                    })
                  )}
                >
                  <X size={16} />
                </Button>
              }
            />
          ))}
        </div>

        <Select
          placeholder="Add"
          classNames={{ innerWrapper: "py-4" }}
          items={
            documentsData?.car.documents?.filter(
              (doc) =>
                data.dynoSession.documents?.findIndex(
                  (d) => d.id === doc.id
                ) === -1
            ) ?? []
          }
          selectedKeys={new Set()}
          onSelectionChange={withNotification({}, async (keys) => {
            const key = Array.from(keys)[0];
            if (key)
              await mutate({
                variables: {
                  id: router.query.tab![1],
                  input: { addDocumentIDs: [key as string] },
                },
              });
          })}
          variant="bordered"
        >
          {({ id, name, metadata }) => (
            <SelectItem key={id} textValue={name}>
              <div className="flex items-center gap-2">
                <FileIcon
                  name={name}
                  contentType={metadata?.contentType}
                  className="size-4"
                />
                <span className="text-sm font-medium truncate max-w-xs">
                  {name}
                </span>
              </div>
            </SelectItem>
          )}
        </Select>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl">Results</h3>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="bordered" radius="full">
              <Plus />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Add results"
            variant="faded"
            onAction={handleAction}
          >
            <DropdownItem
              key="add"
              description="Input individual result"
              startContent={<FilePlus />}
            >
              Add
            </DropdownItem>
            <DropdownItem
              key="bulk-add"
              description="Input multiple results"
              startContent={<Files />}
            >
              Add bulk
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="aspect-video min-h-[300px] rounded-2xl bg-primary/5 backdrop-blur-xl px-6 md:px-10 py-8 md:py-12 border border-primary/10 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={
              data.dynoSession.results
                ?.toSorted((a, b) => a.rpm - b.rpm)
                .map(({ rpm, powerKw, torqueNm }) => ({
                  rpm,
                  power:
                    powerKw != null ? getPower(powerKw, powerUnit) : undefined,
                  torque:
                    torqueNm != null
                      ? getTorque(torqueNm, torqueUnit)
                      : undefined,
                })) ?? []
            }
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" />
            <XAxis
              dataKey="rpm"
              tick={{ fill: "hsl(var(--heroui-foreground))" }}
              label={{
                value: "RPM",
                position: "insideBottom",
                offset: -10,
                fill: "hsl(var(--heroui-foreground))",
              }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "hsl(var(--heroui-primary))" }}
              label={{
                value: `Power (${powerUnitsShort[powerUnit]})`,
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "hsl(var(--heroui-primary))",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(var(--heroui-secondary-400))" }}
              label={{
                value: `Torque (${torqueUnitsShort[torqueUnit]})`,
                angle: -90,
                position: "insideRight",
                offset: 10,
                fill: "hsl(var(--heroui-secondary-400))",
              }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--heroui-background))",
                color: "hsl(var(--heroui-foreground))",
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 16, cursor: "pointer" }}
              onClick={handleLegendClick}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="power"
              stroke="hsl(var(--heroui-primary))"
              strokeWidth={2}
              dot={false}
              name={`Power (${powerUnitsShort[powerUnit]})`}
              hide={!visible.power}
              strokeOpacity={visible.power ? 1 : 0}
              connectNulls
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="torque"
              stroke="hsl(var(--heroui-secondary-400))"
              strokeWidth={2}
              dot={false}
              name={`Torque (${torqueUnitsShort[torqueUnit]})`}
              hide={!visible.torque}
              strokeOpacity={visible.torque ? 1 : 0}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Table
        selectionMode="multiple"
        selectedKeys={selectedRows}
        onSelectionChange={setSelectedRows}
        topContent={
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2 items-center">
              {selectedRows != "all" && selectedRows.size > 0 && (
                <span>{selectedRows.size} rows selected</span>
              )}
            </div>
            <div>
              {(selectedRows === "all" || selectedRows.size > 0) && (
                <HeroTooltip content="Delete">
                  <Button
                    variant="light"
                    startContent={<Trash />}
                    isIconOnly
                    color="danger"
                    size="sm"
                    onPress={withNotification({}, () =>
                      mutateDelete({
                        variables: {
                          ids:
                            selectedRows === "all"
                              ? data.dynoSession.results?.map(
                                  (res) => res.id
                                ) ?? []
                              : ([...selectedRows] as string[]),
                        },
                      }).then(() => setSelectedRows(new Set()))
                    )}
                    isLoading={deleting}
                  />
                </HeroTooltip>
              )}
            </div>
          </div>
        }
      >
        <TableHeader
          columns={[
            { key: "rpm", name: "RPM" },
            { key: "power", name: `Power (${powerUnitsShort[powerUnit]})` },
            { key: "torque", name: `Torque (${torqueUnitsShort[torqueUnit]})` },
            { key: "actions", name: "" },
          ]}
        >
          {(column) => (
            <TableColumn key={column.key}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={
            data.dynoSession.results?.toSorted((a, b) => a.rpm - b.rpm) ?? []
          }
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.rpm}</TableCell>
              <TableCell>
                {item.powerKw && getPower(item.powerKw, powerUnit)}
              </TableCell>
              <TableCell>
                {item.torqueNm && getTorque(item.torqueNm, torqueUnit)}
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <HeroTooltip content="Delete">
                  <Button
                    variant="light"
                    startContent={<Trash />}
                    isIconOnly
                    color="danger"
                    size="sm"
                    onPress={withNotification({}, () =>
                      mutateDelete({
                        variables: {
                          ids: [item.id],
                        },
                      })
                    )}
                    isLoading={deleting}
                  />
                </HeroTooltip>
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
              <ModalHeader>Enter result</ModalHeader>
              <ModalBody>
                <form
                  id="result-form"
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    control={control}
                    name="rpm"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="RPM"
                        endContent={"RPM"}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="power"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Power"
                        endContent={powerUnitsShort[powerUnit]}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="torque"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Torque"
                        endContent={torqueUnitsShort[torqueUnit]}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  form="result-form"
                  isLoading={isCreating}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isBulkAddOpen}
        onOpenChange={onBulkAddOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Bulk add</ModalHeader>
              <ModalBody>
                <form
                  id="result-form"
                  className="flex flex-col gap-4"
                  onSubmit={handleBulkAddSubmit}
                >
                  <FancySwitch
                    options={[
                      {
                        value: "power",
                        label: powerUnitsShort[powerUnit],
                        icon: <Gauge className="h-4 w-4" />,
                      },
                      {
                        value: "torque",
                        label: torqueUnitsShort[torqueUnit],
                        icon: <RotateCcw className="h-4 w-4" />,
                      },
                      {
                        value: "both",
                        label: "Both",
                        icon: <SlidersHorizontal className="h-4 w-4" />,
                      },
                    ]}
                    value={bulkAddType}
                    onChange={setBulkAddType}
                    className="flex rounded-full bg-muted p-2"
                    highlighterClassName="bg-primary rounded-full"
                    radioClassName="relative mx-2 flex h-9 cursor-pointer items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors focus:outline-none data-[checked]:text-primary-foreground"
                    highlighterIncludeMargin={true}
                    renderOption={({ option, getOptionProps }) => (
                      <div
                        {...getOptionProps()}
                        className={cn(
                          "flex items-center gap-2",
                          getOptionProps().className
                        )}
                      >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    )}
                  />
                  <Textarea
                    variant="bordered"
                    label="Results"
                    placeholder={`Enter one result per line; in the format ${
                      bulkAddType === "both"
                        ? "rpm,power,torque"
                        : bulkAddType === "power"
                        ? "rpm,power"
                        : "rpm,torque"
                    }`}
                    value={bulkAddResults}
                    onChange={(e) => setBulkAddResults(e.target.value)}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  form="result-form"
                  isLoading={isCreating}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
