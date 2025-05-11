import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Image,
  Pagination,
} from "@heroui/react";
import { Document, Page } from "react-pdf";
import { FragmentType, graphql, useFragment } from "@/gql";

import { DragSessionChip } from "../performance/drag-sessions/chip";
import { DynoSessionChip } from "../performance/dyno-sessions/chip";
import { ExpenseChip } from "../expenses/chip";
import { FuelUpChip } from "../fuelups/chip";
import { ServiceLogChip } from "../maintenance/service/logs/chip";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSuspenseQuery } from "@apollo/client";

const PreviewFields = graphql(`
  fragment PreviewFields on Document {
    id
    name
    url
    metadata {
      contentType
      size
    }
  }
`);

function Preview({ docRef }: { docRef: FragmentType<typeof PreviewFields> }) {
  const document = useFragment(PreviewFields, docRef);

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (document.metadata?.contentType === "application/pdf") {
    return (
      <div className="flex flex-col gap-2">
        <div className="max-w-full overflow-x-auto p-4">
          <Document file={document.url} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
        {numPages !== undefined && (
          <Pagination
            total={numPages}
            page={pageNumber}
            onChange={setPageNumber}
            showControls
            className="self-center"
          />
        )}
      </div>
    );
  } else if (document.metadata?.contentType.startsWith("image/")) {
    return <Image src={document.url} alt={document.name} />;
  }

  return <>No preview available...</>;
}

const getDocument = graphql(`
  query GetDocument($id: ID!) {
    me {
      id
      settings {
        id
        currencyCode
        fuelVolumeUnit
        distanceUnit
      }
    }
    document(id: $id) {
      id
      name
      url
      tags
      metadata {
        contentType
        size
      }
      ...PreviewFields
      expense {
        id
        type
        amount
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
      fuelUp {
        id
        occurredAt
        station
        amountLiters
        expense {
          id
          amount
        }
        fuelCategory
        octaneRating
        odometerReading {
          id
          readingKm
        }
        notes
        isFullTank
      }
      dragSession {
        id
        title
        notes
        results {
          id
          unit
          value
          result
        }
      }
      dynoSession {
        id
        title
        notes
        results {
          id
          rpm
          powerKw
          torqueNm
        }
      }
    }
  }
`);

export default function Details({
  onClose,
  id,
}: {
  onClose(): void;
  id: string;
}) {
  const router = useRouter();

  const { data } = useSuspenseQuery(getDocument, { variables: { id } });

  return (
    <>
      <DrawerHeader className="flex flex-col gap-1">
        {data.document.name}
      </DrawerHeader>
      <DrawerBody>
        <Preview docRef={data.document} />
        {data.document.expense && (
          <div className="flex flex-col gap-1">
            <p>Expense</p>
            <ExpenseChip
              expense={data.document.expense}
              currencyCode={data.me.settings?.currencyCode}
              href={`/cars/${router.query.id}`}
            />
          </div>
        )}
        {data.document.fuelUp && (
          <div className="flex flex-col gap-1">
            <p>Fuel-up</p>
            <FuelUpChip
              fuelUp={data.document.fuelUp}
              href={`/cars/${router.query.id}`}
              fuelVolumeUnit={data.me.settings?.fuelVolumeUnit}
              distanceUnit={data.me.settings?.distanceUnit}
            />
          </div>
        )}
        {data.document.serviceLog && (
          <div className="flex flex-col gap-1">
            <p>Service log</p>
            <ServiceLogChip
              log={data.document.serviceLog}
              href={`/cars/${router.query.id}`}
              distanceUnit={data.me.settings?.distanceUnit}
            />
          </div>
        )}
        {data.document.dragSession && (
          <div className="flex flex-col gap-1">
            <p>Drag session</p>
            <DragSessionChip
              session={data.document.dragSession}
              href={`/cars/${router.query.id}/performance/drag-sessions/${data.document.dragSession.id}`}
            />
          </div>
        )}
        {data.document.dynoSession && (
          <div className="flex flex-col gap-1">
            <p>Dyno session</p>
            <DynoSessionChip
              session={data.document.dynoSession}
              href={`/cars/${router.query.id}/performance/dyno-sessions/${data.document.dynoSession.id}`}
            />
          </div>
        )}
      </DrawerBody>
      <DrawerFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
      </DrawerFooter>
    </>
  );
}
