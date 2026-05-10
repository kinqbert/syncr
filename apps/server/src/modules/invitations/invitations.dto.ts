import { type InviteTeamMembersBody, RoleKey } from "@syncr/packages";
import { ArrayMinSize, IsArray, IsEmail, IsEnum } from "class-validator";

export class InviteTeamMembersDto implements InviteTeamMembersBody {
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true, message: "Every email has to be valid." })
  emails: string[];

  @IsEnum(RoleKey)
  roleKey: RoleKey;
}
