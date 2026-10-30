"use server";
import prisma from "@/src/lib/prisma";

const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL ?? "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export const capturePaypalOrder = async (transactionId: string) => {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${transactionId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    // console.log("PayPal capture response:", JSON.stringify(data, null, 2));

    if (data.status !== "COMPLETED") {
      return { ok: false, message: "El pago no fue completado" };
    }

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
    const orderId = capture?.custom_id as string;
    const captureId = capture?.id as string;

    // console.log("DB orderId:", orderId, "| captureId:", captureId);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        transactionId: captureId,
      },
    });

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al capturar el pago" };
  }
};
