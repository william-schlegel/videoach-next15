"use client";

import PageLayout from "@/app/_components/pageLayout";
import { useTranslations } from "next-intl";

export const PROVIDERS = [
  ["google", "Google"],
  ["apple", "Apple"],
  ["facebook", "Facebook"],
] as const;

export default function SignInPage() {
  const t = useTranslations("auth");
  return (
    <PageLayout title={t("signin.connect")}>
      <SignIn.Root>
        <SignIn.Step name="start">
          <div className="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title">{t("signin.connect")}</h1>

              {PROVIDERS.map((provider) => (
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  key={provider[0]}
                >
                  <Clerk.Connection name={provider[0]}>
                    {t("signin.connect-with-account")} {provider[1]}
                  </Clerk.Connection>
                </button>
              ))}

              <div className="divider">{t("signin.or")}</div>

              <Clerk.Field name="identifier">
                <Clerk.Label>{t("signin.my-email")}</Clerk.Label>
                <Clerk.Input className="input input-bordered w-full" />
                <Clerk.FieldError />
              </Clerk.Field>

              <button type="button" className="btn btn-outline w-full">
                <SignIn.Action submit>
                  {t("signin.connect-with-account")} {t("signin.local")}
                </SignIn.Action>
              </button>
              <a href="/sign-up" className="link self-end">
                {t("signin.create-account")}
              </a>
            </div>
          </div>
        </SignIn.Step>

        <SignIn.Step name="verifications">
          <div className="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
              <SignIn.Strategy name="email_code">
                <h1 className="card-title">{t("signin.check-code")}</h1>
                <p>
                  {t("signin.code-sent-to")} <SignIn.SafeIdentifier />
                </p>

                <Clerk.Field name="code">
                  <Clerk.Label>{t("signin.email-code")}</Clerk.Label>
                  <Clerk.Input />
                  <Clerk.FieldError />
                </Clerk.Field>
                <button type="button" className="btn btn-outline w-full">
                  <SignIn.Action submit>{t("signin.continue")}</SignIn.Action>
                </button>
              </SignIn.Strategy>

              <SignIn.Strategy name="password">
                <h1 className="card-title">{t("signin.enter-password")}</h1>

                <Clerk.Field name="password">
                  <Clerk.Label>{t("signin.password")}</Clerk.Label>
                  <Clerk.Input className="input input-bordered w-full" />
                  <Clerk.FieldError />
                </Clerk.Field>
                <button type="button" className="btn btn-outline w-full">
                  <SignIn.Action submit>{t("signin.continue")}</SignIn.Action>
                </button>

                <SignIn.Action navigate="forgot-password">
                  {t("signin.forgotten-password")}
                </SignIn.Action>
              </SignIn.Strategy>

              <SignIn.Strategy name="reset_password_email_code">
                <h1 className="card-title">{t("signin.check-code")}</h1>
                <p>
                  {t("signin.code-sent-to")} <SignIn.SafeIdentifier />
                </p>

                <Clerk.Field name="code">
                  <Clerk.Label>{t("signin.email-code")}</Clerk.Label>
                  <Clerk.Input className="input input-bordered w-full" />
                  <Clerk.FieldError />
                </Clerk.Field>

                <button type="button" className="btn btn-outline w-full">
                  <SignIn.Action submit>{t("signin.continue")}</SignIn.Action>
                </button>
              </SignIn.Strategy>
            </div>
          </div>
        </SignIn.Step>

        <SignIn.Step name="forgot-password">
          <div className="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
              <h1>Forgot your password?</h1>

              <SignIn.SupportedStrategy name="reset_password_email_code">
                Reset password
              </SignIn.SupportedStrategy>

              <SignIn.Action navigate="previous">Go back</SignIn.Action>
            </div>
          </div>
        </SignIn.Step>

        <SignIn.Step name="reset-password">
          <div className="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
              <h1>Reset your password</h1>

              <Clerk.Field name="password">
                <Clerk.Label>New password</Clerk.Label>
                <Clerk.Input className="input input-bordered w-full" />
                <Clerk.FieldError />
              </Clerk.Field>

              <Clerk.Field name="confirmPassword">
                <Clerk.Label>Confirm password</Clerk.Label>
                <Clerk.Input className="input input-bordered w-full" />
                <Clerk.FieldError />
              </Clerk.Field>

              <SignIn.Action submit>Reset password</SignIn.Action>
            </div>
          </div>
        </SignIn.Step>
      </SignIn.Root>
    </PageLayout>
  );
}
