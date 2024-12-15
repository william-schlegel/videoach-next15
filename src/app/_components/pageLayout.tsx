import type { PropsWithChildren } from "react";

type PageLayoutProps = {
  title?: string;
};

export default function PageLayout({
  children,
  title,
}: Readonly<PropsWithChildren<PageLayoutProps>>) {
  return (
    <div title={title} className="container mx-auto my-2 space-y-2 p-2">
      {children}
    </div>
  );
}
