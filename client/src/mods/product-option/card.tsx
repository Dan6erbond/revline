import { BadgeCheck, Info, Wrench, XCircle } from "lucide-react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  Link,
  useDisclosure,
} from "@heroui/react";
import { FragmentType, useFragment } from "../../gql";
import ProductOptionModal, { ModProductOptionDetails } from "./modal";

export function ProductOptionCard({
  option,
  currencyCode,
  ideaId,
  ...props
}: {
  option: FragmentType<typeof ModProductOptionDetails>;
  currencyCode: string;
  ideaId: string;
} & CardProps) {
  const o = useFragment(ModProductOptionDetails, option);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card isPressable onPress={onOpen} {...props}>
      <CardHeader className="flex justify-between items-center text-sm text-muted-foreground pb-0">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary-500" />
          <span>{o.vendor || "Unknown Vendor"}</span>
        </div>
        <span className="text-xs font-mono">#{o.id.slice(0, 6)}</span>
      </CardHeader>

      <CardBody className="space-y-2 pt-4">
        <div className="text-lg font-semibold text-primary-700">
          {o.name || "Unnamed Product"}
        </div>

        {o.price && (
          <div className="text-sm text-gray-500">
            Price: {o.price}
            {currencyCode}
          </div>
        )}
        {o.link && (
          <Link href={o.link} isExternal color="secondary" size="sm">
            View Product
          </Link>
        )}

        {o.notes && (
          <div className="text-sm text-gray-600">
            <Info className="inline-block w-4 h-4 mr-1 text-gray-400" />
            {o.notes}
          </div>
        )}

        {o.pros && o.pros.length > 0 && (
          <div className="text-sm text-success-300">
            <div className="flex items-center gap-1">
              <BadgeCheck className="w-4 h-4" /> Pros:
            </div>
            <ul className="list-disc list-inside">
              {(o.pros as string[]).map((pro, i) => (
                <li key={i}>{pro}</li>
              ))}
            </ul>
          </div>
        )}

        {o.cons && o.cons.length > 0 && (
          <div className="text-sm text-danger-300">
            <div className="flex items-center gap-1">
              <XCircle className="w-4 h-4" /> Cons:
            </div>
            <ul className="list-disc list-inside">
              {(o.cons as string[]).map((con, i) => (
                <li key={i}>{con}</li>
              ))}
            </ul>
          </div>
        )}

        {o.specs && Object.keys(o.specs).length > 0 && (
          <div className="text-sm text-content3-foreground">
            <div className="font-medium">Specs:</div>
            <ul className="list-inside space-y-1">
              {Object.entries(o.specs).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold text-content4-foreground">
                    {key}:
                  </span>{" "}
                  {value as string}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>

      <CardFooter className="text-xs text-muted-foreground text-right pt-2">
        Product ID: {o.id.slice(0, 8)}
      </CardFooter>

      <ProductOptionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        ideaId={ideaId}
        productOption={option}
        currencyCode={currencyCode}
      />
    </Card>
  );
}
