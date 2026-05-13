import type { TeamMember } from "@syncr/packages";

import { getUserFullName } from "@/utils/getUserFullName";

export const getMemberLabel = (member: TeamMember) => {
  return getUserFullName(member.name, member.surname) || member.email;
};
