// import { env } from "./env/server"

import type { Role } from "@prisma/client";

export type PlansNames = keyof typeof subscriptionPlans;
export type PaidPlansNames = Exclude<
  PlansNames,
  "freeMember" | "freeCoach" | "freeManager" | "freeManagerCoach"
>;

type SubscriptionPlan = Readonly<{
  applyTo: Role;
  name: string;
  description: string;
  priceInCentsPerMonth?: number;
  priceInCentsPerYear?: number;
  // for managers
  maxNumberOfClubs?: number;
  maxNumberOfSites?: number;
  maxNumberOfRooms?: number;
  // for coachs
  maxNumberOfOffers?: number;
  maxNumberOfCompanyOffers?: number;
  maxNumberOfCertifications?: number;
  maxNumberOfMeetings?: number;
  custom?: boolean;
  // stripe
  stripePriceId: string;
}>;

export const subscriptionPlans = {
  freeMember: {
    applyTo: "MEMBER",
    name: "Membre",
    description:
      "Accès gratuit à toutes les fonctionnalités de la plateforme pour un club",
    priceInCentsPerMonth: 0,
    maxNumberOfClubs: 1,
    stripePriceId: "",
  },
  paidMember: {
    applyTo: "MEMBER",
    name: "Membre multiclubs",
    description:
      "Accès à toutes les fonctionnalités de la plateforme pour jusqu'à 10 clubs",
    priceInCentsPerMonth: 500,
    priceInCentsPerYear: 5000,
    maxNumberOfClubs: 10,
    stripePriceId: "",
  },
  freeCoach: {
    applyTo: "COACH",
    name: "Essai pour Coach",
    description:
      "Accès gratuit mais limité à toutes les fonctionnalités de la plateforme pour un coach qui veut l'essayer",
    priceInCentsPerMonth: 0,
    stripePriceId: "",
    maxNumberOfOffers: 1,
    maxNumberOfCompanyOffers: 0,
    maxNumberOfCertifications: 1,
    maxNumberOfMeetings: 0,
  },
  coach: {
    applyTo: "COACH",
    name: "Coach",
    description:
      "Accès à toutes les fonctionnalités de la plateforme pour un coach",
    priceInCentsPerMonth: 2000,
    priceInCentsPerYear: 20000,
    stripePriceId: "",
    maxNumberOfOffers: 10,
    maxNumberOfCompanyOffers: 3,
    maxNumberOfCertifications: 3,
    maxNumberOfMeetings: 0,
  },
  coachAdvanced: {
    applyTo: "COACH",
    name: "Coach avancé",
    description:
      "Accès à toutes les fonctionnalités étendues de la plateforme pour un coach",
    priceInCentsPerMonth: 5000,
    priceInCentsPerYear: 50000,
    stripePriceId: "",
    maxNumberOfOffers: 50,
    maxNumberOfCompanyOffers: 50,
    maxNumberOfCertifications: 10,
    maxNumberOfMeetings: 100,
  },
  coachCustom: {
    applyTo: "COACH",
    name: "Coach sur mesure",
    description:
      "Accès sur mesure aux fonctionnalités de la plateforme pour un coach",
    custom: true,
    stripePriceId: "",
  },
  freeManager: {
    applyTo: "MANAGER",
    name: "Essai pour manager",
    description:
      "Accès gratuit mais limité à toutes les fonctionnalités de la plateforme pour un manager qui veut l'essayer",
    priceInCentsPerMonth: 0,
    stripePriceId: "",
    maxNumberOfClubs: 1,
    maxNumberOfSites: 1,
    maxNumberOfRooms: 1,
  },
  manager: {
    applyTo: "MANAGER",
    name: "Manager",
    description:
      "Accès à toutes les fonctionnalités de la plateforme pour un manager ayant un club",
    priceInCentsPerMonth: 10000,
    priceInCentsPerYear: 100000,
    stripePriceId: "",
    maxNumberOfClubs: 1,
    maxNumberOfSites: 3,
    maxNumberOfRooms: 10,
  },
  managerAdvanced: {
    applyTo: "MANAGER",
    name: "Manager avancé",
    description:
      "Accès à toutes les fonctionnalités étendues de la plateforme pour un manager",
    priceInCentsPerMonth: 25000,
    priceInCentsPerYear: 250000,
    stripePriceId: "",
    maxNumberOfClubs: 3,
    maxNumberOfSites: 5,
    maxNumberOfRooms: 30,
  },
  managerCustom: {
    applyTo: "MANAGER",
    name: "Manager sur mesure",
    description:
      "Accès sur mesure aux fonctionnalités de la plateforme pour un manager",
    custom: true,
    stripePriceId: "",
  },
  freeManagerCoach: {
    applyTo: "MANAGER_COACH",
    name: "Essai pour manager coach",
    description:
      "Accès gratuit mais limité à toutes les fonctionnalités de la plateforme pour un manager qui est aussi coach et qui veut l'essayer",
    priceInCentsPerMonth: 0,
    stripePriceId: "",
    maxNumberOfClubs: 1,
    maxNumberOfSites: 1,
    maxNumberOfRooms: 1,
    maxNumberOfOffers: 1,
    maxNumberOfCompanyOffers: 0,
    maxNumberOfCertifications: 1,
    maxNumberOfMeetings: 0,
  },
  managerCoach: {
    applyTo: "MANAGER_COACH",
    name: "Manager coach",
    description:
      "Accès à toutes les fonctionnalités de la plateforme pour un manager/coach ayant un club",
    priceInCentsPerMonth: 10000,
    priceInCentsPerYear: 100000,
    stripePriceId: "",
    maxNumberOfClubs: 1,
    maxNumberOfSites: 3,
    maxNumberOfRooms: 10,
    maxNumberOfOffers: 10,
    maxNumberOfCompanyOffers: 3,
    maxNumberOfCertifications: 3,
    maxNumberOfMeetings: 0,
  },
  managerCoachAdvanced: {
    applyTo: "MANAGER_COACH",
    name: "Manager/Coach avancé",
    description:
      "Accès à toutes les fonctionnalités étendues de la plateforme pour un manager/coach",
    priceInCentsPerMonth: 25000,
    priceInCentsPerYear: 250000,
    stripePriceId: "",
    maxNumberOfClubs: 3,
    maxNumberOfSites: 5,
    maxNumberOfRooms: 30,
    maxNumberOfOffers: 50,
    maxNumberOfCompanyOffers: 50,
    maxNumberOfCertifications: 10,
    maxNumberOfMeetings: 100,
  },
  managerCoachCustom: {
    applyTo: "MANAGER_COACH",
    name: "Manager/Coach sur mesure",
    description:
      "Accès sur mesure aux fonctionnalités de la plateforme pour un manager/coach",
    custom: true,
    stripePriceId: "",
  },
} as const satisfies Record<string, SubscriptionPlan>;

export const subscriptionPlansInOrder = [] as const;

export function getPlanByPriceId(stripePriceId: string) {
  return Object.values(subscriptionPlans).find(
    (tier) => tier?.stripePriceId === stripePriceId,
  ) as SubscriptionPlan;
}

export function getPlanByName(name?: PlansNames) {
  if (!name) return "";
  return subscriptionPlans[name] as SubscriptionPlan;
}

export function getPlansForRole(role: Role) {
  return Object.values(subscriptionPlans).filter(
    (plan) => plan.applyTo === role,
  ) as SubscriptionPlan[];
}
