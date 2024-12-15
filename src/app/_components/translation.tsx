"use client";
import { useTranslations } from "next-intl";

export default function Translation({ text }: { text: string }) {
  const spl = text.split(".");
  const key = spl[spl.length - 1];
  const namespace = spl.slice(0, spl.length - 1).join(".");
  const t = useTranslations(namespace);

  return <>{t(key)}</>;
}
