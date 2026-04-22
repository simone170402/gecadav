export type BillingCycle = 'MONTHLY' | 'YEARLY';

export interface SubscriptionPlan {
  id: number;
  name: string;
  billingCycle: BillingCycle;
  price: number;
  durationInDays: number;
  active: boolean;
  description?: string;
}

export interface SubscribeRequest {
  planId: number;
  userEmail: string;
}

export interface UserSubscription {
  id: number;
  planId: number;
  planName: string;
  userEmail: string;
  active: boolean;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}