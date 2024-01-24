"use client";
import { countCartTotal, formatIDR } from "@/app/lib/utils";
import CartCheckout from "@/app/ui/cart/checkout";
import CustomerEmptyTable from "@/app/ui/customer-empty-table";
import Image from "next/image";
import DeleteButton from "@/app/ui/delete-button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { APIResponse, CartItem } from "@/app/lib/definitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { deleteCart, updateCartQuantity } from "@/app/lib/actions";
import { useTotalCart } from "@/app/context/cart-provider";

const columns = [
  {
    name: "Products",
    uid: "products",
  },
  {
    name: "Price",
    uid: "price",
  },
  {
    name: "Quantity",
    uid: "quantity",
  },
  {
    name: "Sub Total",
    uid: "subTotal",
  },
  {
    name: "Action",
    uid: "action",
  },
];

type Props = {
  cart: CartItem[];
};

export default function CartTable({ cart }: Props) {
  const queryClient = useQueryClient();
  const [listMutatedItem, setListMutatedItem] = useState<Array<CartItem>>(cart);
  const [listItem, setListItem] = useState<Array<CartItem>>(cart);
  const totalCart = countCartTotal(listMutatedItem, 0);
  const [_totalCart, updateTotalCart] = useTotalCart();
  const { mutate } = useMutation<
    { message: string } | undefined,
    APIResponse<undefined, { message: string }>,
    {
      sku: string;
      quantity: number;
    },
    { previousCart: CartItem[] | undefined }
  >({
    mutationFn: async ({ sku: productSku, quantity }) => {
      updateTotalCart(totalCart);
      const res = await updateCartQuantity(productSku, quantity);
      if (res.code !== 200) {
        throw res;
      }
      return res.data;
    },
    onMutate: async ({ sku, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = listItem;

      setListMutatedItem((prev) =>
        prev.map((item) => {
          if (item.sku === sku) {
            item.quantity = quantity;
          }
          return item;
        }),
      );

      return { previousCart };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSuccess: () => {
      setListItem(listMutatedItem);
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        // console.log(context.previousCart);
        setListMutatedItem(context.previousCart);
      }
      if (err.code === 400) {
        if (variables.quantity === 0) {
          toast.error(
            `Minimal pembelian produk (${variables.sku}) tidak terpenuhi`,
            {
              duration: 3000,
            },
          );
          return;
        }
        toast.error(`Stok produk (${variables.sku}) tidak cukup`, {
          duration: 3000,
        });
        return;
      }
      toast.error(err.errors.message ?? "error occurs");
    },
  });

  const { mutate: delteMutation } = useMutation<
    { message: string } | undefined,
    APIResponse<undefined, { message: string }>,
    {
      sku: string;
    },
    { previousCart: CartItem[] | undefined }
  >({
    mutationFn: async ({ sku: productSku }) => {
      updateTotalCart(totalCart);
      const res = await deleteCart(productSku);
      if (res.code !== 200) {
        throw res;
      }
      return res.data;
    },
    onMutate: async ({ sku }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = listItem;

      setListMutatedItem((prev) => prev.filter((item) => item.sku !== sku));

      return { previousCart };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSuccess: () => {
      setListItem(listMutatedItem);
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        // console.log(context.previousCart);
        setListMutatedItem(context.previousCart);
      }
      if (error.code === 404) {
        toast.error(`Delete failed, product not found`);
      } else {
        toast.error(
          `Delete failed, unable to remove produk (${variables.sku}) from cart`,
        );
      }
    },
  });

  const debounceMutation = useDebouncedCallback(mutate, 300);

  return (
    <Table
      removeWrapper
      classNames={{
        th: [
          "bg-transparent",
          "text-default-500",
          "border-b",
          "border-divider",
          "text-center",
          "text-base",
          "font-semibold",
        ],
        td: ["border-b", "border-divider", "text-center", "first:text-start"],
      }}
      aria-label="Example static collection table"
      layout="fixed"
      bottomContent={<CartCheckout cart={cart} />}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn align="center" key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={<CustomerEmptyTable title="Your Cart Is Empty" />}
      >
        {listMutatedItem.map((item) => (
          <TableRow key={item.sku}>
            <TableCell>
              <div className="flex gap-2 items-center">
                <Image
                  src={item.image.url}
                  alt={item.image.name}
                  width={50}
                  height={50}
                />
                <div className="flex flex-col">
                  <span className="text-small overflow-hidden">
                    {item.name}
                  </span>
                  <span className="text-tiny text-default-400">{item.sku}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {formatIDR(item.price).replace(/(\.|,)00$/g, "")}
            </TableCell>
            <TableCell>
              <input
                min={1}
                className="py-3 w-[70px] text-center number-control"
                type="number"
                value={item.quantity.toString()}
                onBlur={(e) => {
                  const val = e.currentTarget.value || String(0);
                  const numVal = Number(val);
                  if (numVal === 0) {
                    setListMutatedItem(listItem);
                  }
                }}
                onChange={(e) => {
                  const val = e.currentTarget.value || String(0);
                  const numVal = Number(val);
                  queryClient.cancelQueries({ queryKey: ["cart"] });
                  setListMutatedItem(
                    listMutatedItem.map((itemData) => {
                      if (itemData.sku === item.sku) {
                        return {
                          ...itemData,
                          quantity: numVal,
                        };
                      }
                      return itemData;
                    }),
                  );
                  if (numVal !== 0) {
                    debounceMutation({
                      sku: item.sku,
                      quantity: numVal,
                    });
                  }
                }}
              />
            </TableCell>
            <TableCell>
              {formatIDR(item.quantity * item.price).replace(/(\.|,)00$/g, "")}
            </TableCell>
            <TableCell>
              <DeleteButton
                ariaLabel="delete from cart"
                variant="x"
                onClick={() => delteMutation({ sku: item.sku })}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
