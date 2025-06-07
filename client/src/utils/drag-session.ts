import { DragResultUnit } from "@/gql/graphql";

const MILE_TO_KM = 1.60934;

export const commonDragResultCombinations = [
  {
    unit: DragResultUnit.Km,
    value: MILE_TO_KM * 0.25,
    label: "¼ mile",
  },
  {
    unit: DragResultUnit.Km,
    value: MILE_TO_KM * 0.125,
    label: "⅛ mile",
  },
  {
    unit: DragResultUnit.Km,
    value: MILE_TO_KM * 0.5,
    label: "½ mile",
  },
  {
    unit: DragResultUnit.Kph,
    value: MILE_TO_KM * 60,
    label: "0-60mph",
  },
  {
    unit: DragResultUnit.Kph,
    value: MILE_TO_KM * 100,
    label: "0-100mph",
  },
  {
    unit: DragResultUnit.Kph,
    value: MILE_TO_KM * 120,
    label: "0-120mph",
  },
] as const;

export function resolveDragResultType(unit: DragResultUnit, value: number) {
  return commonDragResultCombinations.find(
    (t) => t.unit === unit && t.value === value
  )?.label;
}
