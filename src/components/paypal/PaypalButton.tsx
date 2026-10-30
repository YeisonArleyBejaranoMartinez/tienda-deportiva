"use client";
import { useRouter } from "next/navigation";
import { PayPalOneTimePaymentButton } from "@paypal/react-paypal-js/sdk-v6";
import { capturePaypalOrder } from "@/src/actions/payments/capture-paypal-order";
import { createPaypalOrder } from "@/src/actions/payments/create-paypal-order";

interface Props {
  orderId: string;
  amount: number;
}

export const PaypalButton = ({ orderId, amount }: Props) => {
  const router = useRouter();

  const createOrder = async (): Promise<{ orderId: string }> => {
    const { paypalOrderId } = await createPaypalOrder(orderId, amount);
    return { orderId: paypalOrderId! };
  };

  const onApprove = async ({ orderId: transactionId }: { orderId: string }) => {
    await capturePaypalOrder(transactionId);
    router.refresh();
  };

  return (
    <div className="relative z-0">
      <PayPalOneTimePaymentButton
        presentationMode="auto"
        createOrder={createOrder}
        onApprove={onApprove}
        />
    </div>
  );
};
