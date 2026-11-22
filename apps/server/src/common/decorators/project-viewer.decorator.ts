/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PermissionKey } from "@syncr/packages";

export type ProjectViewer = {
  userId: number;
  canViewAllProjects: boolean;
};

// requires PermissionGuard, which stores the user's permissions on the request
export const ProjectViewer = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ProjectViewer => {
    const request = ctx.switchToHttp().getRequest();
    const permissions: string[] = request.permissions ?? [];

    return {
      userId: request.userId as number,
      canViewAllProjects: permissions.includes(PermissionKey.ProjectViewAll),
    };
  },
);
