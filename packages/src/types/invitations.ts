import { type RoleKey } from "./role";

export const InvitationStatus = {
  Cancelled: "cancelled",
  Declined: "declined",
  Accepted: "accepted",
  Expired: "expired",
  Active: "active",
} as const;

export type InvitationStatus =
  (typeof InvitationStatus)[keyof typeof InvitationStatus];

export type TeamInvitation = {
  id: number;
  email: string;
  roleKey: string;
  roleName: string;
  status: InvitationStatus;
};

export type UserInvitation = {
  id: number;
  companyId: number;
  companyName: string;
  roleKey: string;
  roleName: string;
  status: InvitationStatus;
};

export type InviteTeamMembersBody = {
  emails: string[];
  roleKey: RoleKey;
};
