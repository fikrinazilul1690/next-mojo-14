"use client";
import Image from "next/image";
import { formatIDR } from "@/app/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { OrderInfo } from "@/app/lib/definitions";
import { useCallback, useOptimistic } from "react";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { RequestPickUp } from "./orders-button";
import { requestPickUp } from "@/app/lib/actions";
import { utils as XLSX_utils, writeFile as XLSX_writeFile } from "xlsx";

const columns = [
  { name: "Order ID", uid: "id" },
  { name: "Items", uid: "item" },
  { name: "Buyyer", uid: "buyyer" },
  { name: "Status", uid: "status" },
  { name: "Destination", uid: "destination" },
  { name: "Total Cost", uid: "total-cost" },
  { name: "", uid: "actions" },
];

export default function OrdersTableClient({ orders }: { orders: OrderInfo[] }) {
  const [optimisticOrders, updateOptimisticOrders] = useOptimistic(orders);

  const downloadOrderExcel = useCallback((data: any) => {
    const worksheet = XLSX_utils.json_to_sheet(data);
    const workbook = XLSX_utils.book_new();

    XLSX_utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX_writeFile(workbook, `Order-${new Date()}.xlsx`);
  }, []);

  return (
    <Table
      topContent={
        <div className="flex justify-end items-center">
          <Button
            color="primary"
            onPress={() =>
              downloadOrderExcel(
                orders.map((data) => {
                  let updatedAt: string = "";
                  let orderItem: { [key: string]: any } = {};
                  if (data.status === "delivered") {
                    updatedAt = data.updated_at ?? "";
                  }
                  data.order_items.forEach((item, idx) => {
                    orderItem[`order_item_name_${idx + 1}`] = item.name;
                    orderItem[`order_item_qty_${idx + 1}`] = item.quantity;
                    orderItem[`order_item_price_${idx + 1}`] = item.price;
                    orderItem[`order_item_total_price_${idx + 1}`] =
                      item.total_price;
                  });
                  return {
                    order_id: data.id,
                    buyyer: data.buyyer.email,
                    status: data.status,
                    destination: data.destination.address,
                    courier: `${data.courier.company_name} - ${data.courier.service_type}`,
                    ...orderItem,
                    total_quantity: data.total_quantity,
                    total_weight: `${data.total_weight.value} ${data.total_weight.unit}`,
                    total_product_price: data.total_product_price,
                    shipping_cost: data.shipping_cost,
                    total_cost: data.total_cost,
                    order_at: data.created_at,
                    delivered_ata: updatedAt,
                  };
                }),
              )
            }
            className="font-bold"
          >
            Export Excel
          </Button>
        </div>
      }
      aria-label="Products table"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={"center"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No rows to display."} items={optimisticOrders}>
        {(order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id.toUpperCase()}</TableCell>
            <TableCell>
              <div className="mb-2 flex items-center">
                <Image
                  src={order.order_items[0].image}
                  className="mr-2 rounded-sm"
                  width={34}
                  height={34}
                  alt={`${order.order_items[0].name}`}
                />
                <p>
                  {order.order_items.length > 1
                    ? `${order.order_items[0].name} and ${
                        order.order_items.length - 1
                      } more`
                    : order.order_items[0].name}
                </p>
              </div>
            </TableCell>
            <TableCell>{order.buyyer.email}</TableCell>
            <TableCell>
              <Chip>{order.status.replaceAll("_", " ")}</Chip>
            </TableCell>
            <TableCell>{order.destination.address}</TableCell>
            <TableCell>
              <p className="text-xl font-medium">
                {formatIDR(order.total_cost ?? 0).replace(/(\.|,)00$/g, "")}
              </p>
            </TableCell>
            <TableCell>
              {order.status === "on_progress" && (
                <RequestPickUp
                  action={async () => {
                    updateOptimisticOrders((pendingState) =>
                      pendingState.map((state) => {
                        if (state.id === order.id) {
                          state.status = "confirmed";
                        }
                        return state;
                      }),
                    );
                    await requestPickUp(order.id);
                  }}
                />
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
