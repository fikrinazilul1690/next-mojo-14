"use client";

import { RadioGroup } from "@nextui-org/react";
import { CustomRadio } from "@/app/ui/custom-radio";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// Todo: integrate with rtk query and revalidate

const orderStatuses = [
  {
    value: "all",
    name: "All",
  },
  {
    value: "on_progress",
    name: "On progress",
  },
  {
    value: "confirmed",
    name: "Confirmed",
  },
  {
    value: "allocated",
    name: "Allocated",
  },
  {
    value: "on_delivery",
    name: "On delivery",
  },
  {
    value: "delivered",
    name: "Delivered",
  },
];

export default function OrderStatusFilter({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(1));
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <RadioGroup
      className={`gap-1 justify-center ${className}`}
      classNames={{
        wrapper:
          "max-sm:justify-start flex-nowrap overflow-x-auto overflow-y-hidden px-3 pb-1",
      }}
      orientation="horizontal"
      value={status ?? "all"}
      onValueChange={handleChange}
    >
      {orderStatuses.map((status) => (
        <CustomRadio key={status.name} value={status.value}>
          {status.name}
        </CustomRadio>
      ))}
    </RadioGroup>
  );
}
