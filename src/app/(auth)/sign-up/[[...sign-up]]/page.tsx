"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import PageLayout from "^/app/_components/pageLayout";
import { PROVIDERS } from "^/app/(auth)/sign-in/[[...sign-in]]/page";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const t = useTranslations("auth");

  return (
    <PageLayout title={t("account.create-account")}>
      <SignUp.Root>
        <SignUp.Step name="start">
          <div className="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title">{t("account.create-account")}</h1>

              {PROVIDERS.map((provider) => (
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  key={provider[0]}
                >
                  <Clerk.Connection name={provider[0]}>
                    {t("account.create-with-account")} {provider[1]}
                  </Clerk.Connection>
                </button>
              ))}

              <div className="divider">{t("signin.or")}</div>

              <Clerk.Field name="emailAddress">
                <Clerk.Label>{t("signin.my-email")}</Clerk.Label>
                <Clerk.Input className="input input-bordered w-full" />
                <Clerk.FieldError />
              </Clerk.Field>

              <Clerk.Field name="password">
                <Clerk.Label>{t("signin.password")}</Clerk.Label>
                <Clerk.Input className="input input-bordered w-full" />
                <Clerk.FieldError />
              </Clerk.Field>

              <button type="button" className="btn btn-outline w-full">
                <SignUp.Action submit>
                  {t("account.create-with-account")} {t("account.local")}
                </SignUp.Action>
              </button>
            </div>
          </div>
        </SignUp.Step>

        <SignUp.Step name="verifications">
          <SignUp.Strategy name="phone_code">
            <h1>Check your phone for an SMS</h1>

            <Clerk.Field name="code">
              <Clerk.Label>Phone Code</Clerk.Label>
              <Clerk.Input />
              <Clerk.FieldError />
            </Clerk.Field>

            <SignUp.Action submit>Verify</SignUp.Action>
          </SignUp.Strategy>

          <SignUp.Strategy name="email_code">
            <h1>Check your email</h1>

            <Clerk.Field name="code">
              <Clerk.Label>Email Code</Clerk.Label>
              <Clerk.Input />
              <Clerk.FieldError />
            </Clerk.Field>

            <SignUp.Action submit>Verify</SignUp.Action>
          </SignUp.Strategy>
        </SignUp.Step>
      </SignUp.Root>
    </PageLayout>
  );
}
