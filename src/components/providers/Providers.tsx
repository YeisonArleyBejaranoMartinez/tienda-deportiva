"use client";

import { SessionProvider } from 'next-auth/react';
import {
  PayPalProvider,
} from "@paypal/react-paypal-js/sdk-v6";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  // console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "");
  return (
    <PayPalProvider
      clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
      components={["paypal-payments"]}
      pageType="checkout"
      environment="sandbox"
    >
      <SessionProvider>{children}</SessionProvider>
    </PayPalProvider>
  );
};

export default Providers;