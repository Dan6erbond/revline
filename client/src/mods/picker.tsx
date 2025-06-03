import { Button } from "@heroui/react";
import { Key } from "react";
import ModChip from "./chip";
import ModsSelect from "./select";
import { X } from "lucide-react";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getMods = graphql(`
  query Mods($id: ID!) {
    car(id: $id) {
      id
      mods {
        id
        title
        stage
        category
        status
        description
        productOptions {
          id
        }
      }
    }
  }
`);

export default function ModsPicker({
  value,
  onChange,
}: {
  value: Key[];
  onChange(value: Key[]): void;
}) {
  const router = useRouter();

  const { data: modsData } = useQuery(getMods, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  return (
    <>
      <ModsSelect
        placeholder="Add Mod"
        classNames={{ innerWrapper: "py-4" }}
        selectedKeys={new Set()}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          if (!key) return;

          onChange([...(value ?? []), key]);
        }}
        filterMods={(m) => !value || !value.includes(m.id)}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {value?.map((id) => {
          const mod = modsData?.car.mods?.find((mod) => mod.id === id);

          if (!mod) return null;

          return (
            <ModChip
              key={id}
              endContent={
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onPress={() => onChange(value?.filter((id) => id !== mod.id))}
                  isIconOnly
                  color="danger"
                  variant="light"
                  size="sm"
                  radius="full"
                  className="h-6"
                >
                  <X size={12} />
                </Button>
              }
              href={`/cars/${router.query.id}/project/mods/${mod.id}`}
              mod={mod}
            />
          );
        })}
      </div>
    </>
  );
}
