import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import AppWrapper from "./_components/appWrapper";
import { getActualUser } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const user = await getActualUser();

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppWrapper user={user}>{children}</AppWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
