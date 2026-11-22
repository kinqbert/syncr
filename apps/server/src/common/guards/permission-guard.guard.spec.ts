import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionKey } from "@syncr/packages";

import { RoleRepository } from "../../repositories/role.repository";
import { PermissionGuard } from "./permission-guard.guard";

type TestRequest = {
  headers: Record<string, string>;
  params?: Record<string, string>;
  userId?: number;
  permissions?: string[];
};

const createContext = (request: TestRequest) =>
  ({
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => undefined,
    getClass: () => undefined,
  }) as unknown as ExecutionContext;

describe("PermissionGuard", () => {
  const getUserCompanyPermissionKeys = jest.fn<Promise<string[]>, [number, number]>();
  const isProjectMember = jest.fn<Promise<boolean>, [number, number, number]>();
  const getAllAndOverride = jest.fn();

  const guard = new PermissionGuard(
    { getUserCompanyPermissionKeys, isProjectMember } as unknown as RoleRepository,
    { getAllAndOverride } as unknown as Reflector,
  );

  const memberRequest = { headers: { "x-company-id": "7" }, userId: 3 };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("allows a member who has the required permission", async () => {
    getAllAndOverride.mockReturnValue(PermissionKey.TaskDelete);
    getUserCompanyPermissionKeys.mockResolvedValue([
      PermissionKey.TaskView,
      PermissionKey.TaskDelete,
    ]);

    await expect(guard.canActivate(createContext(memberRequest))).resolves.toBe(true);
    expect(getUserCompanyPermissionKeys).toHaveBeenCalledWith(3, 7);
  });

  it("rejects a member who lacks the required permission", async () => {
    getAllAndOverride.mockReturnValue(PermissionKey.TaskDelete);
    getUserCompanyPermissionKeys.mockResolvedValue([PermissionKey.TaskView]);

    await expect(guard.canActivate(createContext(memberRequest))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it("rejects a user who is not a member of the company", async () => {
    getAllAndOverride.mockReturnValue(PermissionKey.TaskView);
    getUserCompanyPermissionKeys.mockResolvedValue([]);

    await expect(guard.canActivate(createContext(memberRequest))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it("allows any member when no permission is required", async () => {
    getAllAndOverride.mockReturnValue(undefined);
    getUserCompanyPermissionKeys.mockResolvedValue([PermissionKey.TaskView]);

    await expect(guard.canActivate(createContext(memberRequest))).resolves.toBe(true);
  });

  it.each(["", "abc", "-1"])("rejects an invalid company id %p", async (companyId) => {
    const context = createContext({ headers: { "x-company-id": companyId }, userId: 3 });

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
    expect(getUserCompanyPermissionKeys).not.toHaveBeenCalled();
  });

  it("rejects a request without a user", async () => {
    const context = createContext({ headers: { "x-company-id": "7" } });

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it("stores the user's permissions on the request", async () => {
    const request: TestRequest = { ...memberRequest };
    getUserCompanyPermissionKeys.mockResolvedValue([PermissionKey.TaskView]);

    await guard.canActivate(createContext(request));

    expect(request.permissions).toEqual([PermissionKey.TaskView]);
  });

  describe("project scoped routes", () => {
    const projectRequest = { ...memberRequest, params: { projectId: "11" } };

    it("allows a project member", async () => {
      getUserCompanyPermissionKeys.mockResolvedValue([PermissionKey.TaskView]);
      isProjectMember.mockResolvedValue(true);

      await expect(guard.canActivate(createContext(projectRequest))).resolves.toBe(true);
      expect(isProjectMember).toHaveBeenCalledWith(3, 7, 11);
    });

    it("rejects a user outside the project", async () => {
      getUserCompanyPermissionKeys.mockResolvedValue([PermissionKey.TaskView]);
      isProjectMember.mockResolvedValue(false);

      await expect(guard.canActivate(createContext(projectRequest))).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("skips the membership check for roles that can view all projects", async () => {
      getUserCompanyPermissionKeys.mockResolvedValue([PermissionKey.ProjectViewAll]);

      await expect(guard.canActivate(createContext(projectRequest))).resolves.toBe(true);
      expect(isProjectMember).not.toHaveBeenCalled();
    });
  });
});
