import {
  BadgeCheck,
  Banknote,
  Car,
  Cog,
  CreditCard,
  DollarSign,
  FileText,
  Fuel,
  Hammer,
  HelpCircle,
  Landmark,
  ParkingCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Chip } from "@heroui/react";
import { ExpenseType } from "@/gql/graphql";
import Link from "next/link";

const typeToIcon = {
  [ExpenseType.Accessories]: Sparkles,
  [ExpenseType.Cleaning]: Settings,
  [ExpenseType.Fuel]: Fuel,
  [ExpenseType.Inspection]: FileText,
  [ExpenseType.Insurance]: ShieldCheck,
  [ExpenseType.Loan]: CreditCard,
  [ExpenseType.Maintenance]: Wrench,
  [ExpenseType.Other]: HelpCircle,
  [ExpenseType.Parking]: ParkingCircle,
  [ExpenseType.Registration]: BadgeCheck,
  [ExpenseType.Repair]: Hammer,
  [ExpenseType.Service]: Cog,
  [ExpenseType.Tax]: Banknote,
  [ExpenseType.Toll]: Landmark,
  [ExpenseType.Upgrade]: Car,
};

const typeToLabel = {
  [ExpenseType.Accessories]: "Accessories",
  [ExpenseType.Cleaning]: "Cleaning",
  [ExpenseType.Fuel]: "Fuel",
  [ExpenseType.Inspection]: "Inspection",
  [ExpenseType.Insurance]: "Insurance",
  [ExpenseType.Loan]: "Loan",
  [ExpenseType.Maintenance]: "Maintenance",
  [ExpenseType.Other]: "Other",
  [ExpenseType.Parking]: "Parking",
  [ExpenseType.Registration]: "Registration",
  [ExpenseType.Repair]: "Repair",
  [ExpenseType.Service]: "Service",
  [ExpenseType.Tax]: "Tax",
  [ExpenseType.Toll]: "Toll",
  [ExpenseType.Upgrade]: "Upgrade",
};

export function ExpenseChip({
  expense,
  href,
  currencyCode,
}: {
  expense: { id: string; type: ExpenseType; amount: number };
  href?: string;
  currencyCode?: string | null;
}) {
  const Icon = typeToIcon[expense.type] ?? DollarSign;
  const label = typeToLabel[expense.type] ?? expense.type;

  return (
    <Chip
      as={href ? Link : undefined}
      href={href}
      className="capitalize"
      startContent={<Icon className="size-4 ml-1 text-muted-foreground" />}
    >
      {label}: {expense.amount.toLocaleString()}
      {currencyCode}
    </Chip>
  );
}
