"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { listBank } from "@/app/lib/client-data";
import { DetailPayment } from "@/app/lib/definitions";
import { formatDate, formatDateWithTime, formatIDR } from "@/app/lib/utils";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useOptimistic, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import { cancelCheckout } from "@/app/lib/actions";
import CustomerEmptyTable from "../customer-empty-table";

const PaymentCard = ({
  detailPayment,
  onClick,
}: {
  detailPayment: DetailPayment;
  onClick: () => void;
}) => {
  const bank = listBank.find((bank) => bank.code === detailPayment.bank);
  const expiryTime = new Date(detailPayment.expiry_time);
  return (
    <Card shadow="sm" fullWidth>
      <CardHeader className="justify-between items-center">
        <div className="font-bold">
          Order at{" "}
          <span className="text-xs font-normal">
            {formatDate(new Date(detailPayment.created_at))}
          </span>
        </div>
        <div className="font-bold">
          Pay before{" "}
          <span className="text-xs font-normal text-warning">
            {formatDateWithTime(expiryTime)}
          </span>
        </div>
      </CardHeader>
      <CardBody className="w-full space-x-4 h-20 flex flex-row items-center">
        <div className="relative w-1/5 h-full">
          <Image
            src={bank?.imageUrl ?? ""}
            fill
            className="object-contain"
            alt={detailPayment.bank}
          />
        </div>
        <Divider orientation="vertical" />
        <div className="flex flex-col gap-1">
          <span className="text-foreground">Payment Method</span>
          <span className="font-bold">{bank?.name}</span>
        </div>
        <Divider orientation="vertical" />
        <div className="flex flex-col gap-1 w-3/12">
          <span className="text-foreground">Virtual Account</span>
          <span className="font-bold tracking-wider">
            {detailPayment.va_number}
          </span>
        </div>
        <Divider orientation="vertical" />
        <div className="flex flex-col gap-1">
          <span className="text-foreground">Payment Amount</span>
          <span className="font-bold">
            {formatIDR(detailPayment.gross_amount).replace(/(\.|,)00$/g, "")}
          </span>
        </div>
      </CardBody>
      <CardFooter className="justify-end items-center gap-3">
        <Button
          variant="ghost"
          color="primary"
          href={`/payment/${detailPayment.id}`}
          as={Link}
        >
          Details
        </Button>
        <Button variant="solid" color="danger" onClick={onClick}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function ListPayment({
  listPayment,
}: {
  listPayment: Array<DetailPayment>;
}) {
  const [optimisticListPayment, updateOptimisticListPayment] =
    useOptimistic(listPayment);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { onOpenChange, onOpen, isOpen } = useDisclosure();
  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        {optimisticListPayment.length !== 0 ? (
          optimisticListPayment.map((detailPayment) => (
            <PaymentCard
              key={detailPayment.id}
              onClick={() => {
                setPaymentId(detailPayment.id);
                onOpen();
              }}
              detailPayment={detailPayment}
            />
          ))
        ) : (
          <div className="my-11 flex justify-center items-center">
            <CustomerEmptyTable title="No transactions yet" />
          </div>
        )}
      </div>
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cancel Transaction
              </ModalHeader>
              <ModalBody>
                <p>Are you sure want to cancel this transaction?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  onClick={async () => {
                    onClose();
                    if (paymentId) {
                      updateOptimisticListPayment((pendingState) =>
                        pendingState.filter((state) => state.id !== paymentId),
                      );
                      await cancelCheckout(paymentId);
                    }
                  }}
                >
                  Cancel Transaction
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
