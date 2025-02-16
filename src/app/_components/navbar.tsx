"use client";
import type { Feature, Role } from "@prisma/client";
import Link from "next/link";
import { type TThemes } from "./themeSelector";
import type { GetUserData } from "@/server/user";
import { env } from "@/env";
import { useTranslations } from "next-intl";
import { useSession } from "@/lib/auth-client";

type MenuDefinitionType = {
  label: string;
  page: string;
  access: ("VISITOR" | Role)[];
  featured?: Feature;
};

const BETA = env.NEXT_PUBLIC_BETA === "true";

const MENUS: MenuDefinitionType[] = [
  {
    label: "navigation.dashboard",
    page: "/dashboard",
    access: ["ADMIN", "COACH", "MANAGER", "MANAGER_COACH", "MEMBER"],
  },
  {
    label: "navigation.find-club",
    page: "/#find-club",
    access: ["VISITOR"],
  },
  {
    label: "navigation.chat",
    page: "/chat",
    access: ["ADMIN", "COACH", "MANAGER", "MANAGER_COACH", "MEMBER"],
  },

  {
    label: "navigation.find-coach",
    page: "/#find-coach",
    access: ["VISITOR"],
  },
  { label: "navigation.manager-offer", page: "/manager", access: ["VISITOR"] },
  { label: "navigation.coach-offer", page: "/coach", access: ["VISITOR"] },
  {
    label: "navigation.company-offer",
    page: "/company",
    access: ["MEMBER", "VISITOR"],
  },
  {
    label: "navigation.planning-management",
    page: `/planning-management`,
    access: ["MANAGER", "MANAGER_COACH"],
    featured: "MANAGER_PLANNING",
  },
  // {
  //   label: "navigation.coach-marketplace",
  //   page: `/coach-management`,
  //   access: ["MANAGER", "MANAGER_COACH"],
  //   featured: "MANAGER_COACH",
  // },
  {
    label: "navigation.coaching-offer",
    page: `/coach/offer`,
    access: ["COACH", "MANAGER_COACH"],
    featured: "COACH_OFFER",
  },
  {
    label: "navigation.presentation-page",
    page: `/create-page`,
    access: ["MANAGER", "COACH", "MANAGER_COACH"],
  },
  {
    label: "navigation.users",
    page: "/admin/users",
    access: ["ADMIN"],
  },
  {
    label: "navigation.pricing-definition",
    page: "/admin/pricing",
    access: ["ADMIN"],
  },
  {
    label: "navigation.certifications",
    page: "/admin/certifications",
    access: ["ADMIN"],
  },
  {
    label: "navigation.activity-groups",
    page: "/admin/activitygroups",
    access: ["ADMIN"],
  },
];

type NavbarProps = Readonly<{
  theme: TThemes;
  onChangeTheme: (newTheme: TThemes) => void;
  user: GetUserData;
}>;

export default function Navbar({ theme, onChangeTheme, user }: NavbarProps) {
  const { data } = useSession();
  const userId = data?.user.id;
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");

  // const { notifications, unread, formatMessage } = useNotifications(userId);
  // const user = trpc.users.getUserById.useQuery(userId ?? "", {
  //   enabled: isCUID(userId),
  // });

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <p className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </p>
          <ul className="menu-compact menu dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
            <Menu user={user} />
          </ul>
        </div>
        <Logo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link href={"/"}>{t("navigation.home")}</Link>
          </li>
          <Menu user={user} />
        </ul>
      </div>

      <div className="navbar-end space-x-2">
        <label className="swap swap-rotate" aria-label="swap">
          <input
            type="checkbox"
            onChange={(e) =>
              onChangeTheme(e.target.checked ? "dark" : "cupcake")
            }
            checked={theme === "dark"}
            className="m-0 border-0 p-0"
          />
          <svg
            className="swap-on h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          <svg
            className="swap-off h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
        {userId ? (
          <>
            {/* {notifications.length ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn-ghost btn-circle btn">
                  <div className="w-10 rounded-full">
                    {unread ? (
                      <div className="indicator ">
                        <i className="bx bx-bell bx-md text-primary" />
                        <span className="badge-secondary badge badge-sm indicator-item">
                          {unread}
                        </span>
                      </div>
                    ) : (
                      <i className="bx bx-bell bx-md text-primary" />
                    )}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
                >
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`max-w-full overflow-hidden truncate text-ellipsis ${
                        notification.viewDate ? "" : "font-bold text-secondary"
                      }`}
                    >
                      <Link
                        href={`/user/${notification.userToId}/notification?notificationId=${notification.id}`}
                      >
                        <span>{formatMessage(notification)}</span>
                      </Link>
                    </li>
                  ))}
                  <div className="divider my-1"></div>
                  <li>
                    <Link href={`/user/${sessionData.user.id}/notification`}>
                      <span>{t("navigation.my-notifications")}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            ) : ( */}
            <i className="bx bx-bell bx-md text-base-300" />
            {/* )}{" "} */}
            {userId ? (
              <>
                <span className="badge badge-primary">
                  {t(`roles.${user?.role}`)}
                </span>
                {/* <UserButton /> */}
              </>
            ) : (
              <Link href="/sign-in">{tAuth("signin.connect")}</Link>
            )}
          </>
        ) : (
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link href="/sign-in">{tAuth("signin.connect")}</Link>{" "}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

type MenuProps = Readonly<{
  user: GetUserData;
}>;
const Menu = ({ user }: MenuProps) => {
  return (
    <>
      {MENUS.map((menu) => {
        if (
          (user?.role && menu.access.includes(user.role)) ||
          (!user && menu.access.includes("VISITOR"))
        ) {
          const locked =
            (menu.featured && !user?.features.includes(menu.featured)) ?? false;
          return (
            <li key={menu.page}>
              <MenuItem locked={locked} label={menu.label} page={menu.page} />
            </li>
          );
        }
        return null;
      })}
    </>
  );
};

const Logo = () => {
  return (
    <div className="flex-1">
      <Link href={"/"} className="btn btn-ghost text-2xl capitalize">
        Videoach
      </Link>
      {BETA ? (
        <span className="badge badge-warning hidden lg:inline">BETA</span>
      ) : null}
    </div>
  );
};

function MenuItem({
  locked,
  label,
  page,
}: {
  locked: boolean;
  label: string;
  page: string;
}) {
  const t = useTranslations("common");
  return locked ? (
    <span
      className="tooltip tooltip-bottom tooltip-error flex items-center gap-2 text-gray-300"
      data-tip={t("navigation.insufficient-plan")}
    >
      <i className="bx bx-lock bx-xs" />
      {t(label)}
    </span>
  ) : (
    <Link className="justify-between" href={page}>
      {t(label)}
    </Link>
  );
}
