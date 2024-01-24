"use client";

import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function ActionButton({
  className,
  color,
  variant,
  children,
  isDisabled,
  fullWidth,
  formAction,
  startContent,
  endContent,
  isIconOnly,
  radius,
}: {
  children: ReactNode;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  color?:
    | "danger"
    | "warning"
    | "default"
    | "primary"
    | "secondary"
    | "success";
  variant?:
    | "shadow"
    | "flat"
    | "solid"
    | "bordered"
    | "light"
    | "faded"
    | "ghost";
  className?: string;
  fullWidth?: boolean;
  formAction?: string | ((formData: FormData) => void);
  startContent: ReactNode;
  endContent?: ReactNode;
  radius?: "none" | "sm" | "md" | "lg" | "full";
}) {
  const { pending, method, action } = useFormStatus();

  // console.log(method);
  // console.log(action);

  return (
    <Button
      fullWidth={fullWidth}
      formAction={formAction}
      type="submit"
      isDisabled={pending || isDisabled}
      color={color}
      variant={variant}
      className={className}
      startContent={
        pending ? <Spinner color="current" size="sm" /> : startContent
      }
      endContent={endContent}
      isIconOnly={isIconOnly}
      radius={radius}
    >
      {children}
    </Button>
  );
}
