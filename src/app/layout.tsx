import { ClerkProvider } from "@clerk/nextjs";
import "^/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import AppWrapper from "./_components/appWrapper";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <head>
          <link
            href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
            rel="stylesheet"
          />
        </head>
        <body>
          <NextIntlClientProvider messages={messages}>
            <AppWrapper>{children}</AppWrapper>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
