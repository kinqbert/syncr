export const InvitationStatus = {
  Cancelled: "cancelled",
  Accepted: "accepted",
  Expired: "expired",
  Active: "active",
} as const;

export type InvitationStatus =
  (typeof InvitationStatus)[keyof typeof InvitationStatus];
