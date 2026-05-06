export const InvitationStatus = {
  Cancelled: "cancelled",
  Declined: "declined",
  Accepted: "accepted",
  Expired: "expired",
  Active: "active",
} as const;

export type InvitationStatus =
  (typeof InvitationStatus)[keyof typeof InvitationStatus];
