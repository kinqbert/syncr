import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcrypt";

import { hash } from "../../common/utils/hash";
import { generateRefreshToken } from "../../common/utils/jwt";
import { AuthRepository } from "../../repositories/auth.repository";
import { UsersRepository } from "../../repositories/users.repository";
import { AuthService } from "./auth.service";

const PASSWORD = "Secret123";

describe("AuthService", () => {
  const usersRepository = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const authRepository = {
    createSession: jest.fn(),
    findSessionById: jest.fn(),
    updateRefreshTokenHash: jest.fn(),
  };

  const service = new AuthService(
    usersRepository as unknown as UsersRepository,
    authRepository as unknown as AuthRepository,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    authRepository.createSession.mockResolvedValue({ id: "session-1" });
  });

  describe("register", () => {
    const registerDto = {
      email: "jane@syncr.cc",
      password: PASSWORD,
      name: "Jane",
      surname: "Doe",
    };

    it("rejects an email that is already taken", async () => {
      usersRepository.findUserByEmail.mockResolvedValue({ id: 1 });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(usersRepository.createUser).not.toHaveBeenCalled();
    });

    it("stores a hashed password and opens a session", async () => {
      usersRepository.findUserByEmail.mockResolvedValue(undefined);
      usersRepository.createUser.mockResolvedValue({ id: 5 });

      const result = await service.register(registerDto);

      const [{ password }] = usersRepository.createUser.mock.calls[0] as [{ password: string }];
      expect(password).not.toBe(PASSWORD);
      await expect(bcrypt.compare(PASSWORD, password)).resolves.toBe(true);

      expect(authRepository.createSession).toHaveBeenCalledWith(
        5,
        hash(result.refreshToken),
        expect.any(Date),
      );
      expect(result.sessionId).toBe("session-1");
    });
  });

  describe("login", () => {
    it("rejects an unknown email and a wrong password with the same error", async () => {
      usersRepository.findUserByEmail.mockResolvedValueOnce(undefined);
      await expect(service.login({ email: "x@syncr.cc", password: PASSWORD })).rejects.toThrow(
        new NotFoundException("Wrong email or password"),
      );

      usersRepository.findUserByEmail.mockResolvedValueOnce({
        id: 1,
        password: await bcrypt.hash(PASSWORD, 4),
      });
      await expect(service.login({ email: "x@syncr.cc", password: "Wrong123" })).rejects.toThrow(
        new NotFoundException("Wrong email or password"),
      );
    });

    it("returns tokens for valid credentials", async () => {
      usersRepository.findUserByEmail.mockResolvedValue({
        id: 1,
        password: await bcrypt.hash(PASSWORD, 4),
      });

      const result = await service.login({ email: "x@syncr.cc", password: PASSWORD });

      expect(result).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        sessionId: "session-1",
      });
    });
  });

  describe("refreshTokens", () => {
    const refreshToken = generateRefreshToken({ userId: 1 });
    const futureDate = new Date(Date.now() + 60_000);

    it("rejects a token that does not match the session", async () => {
      authRepository.findSessionById.mockResolvedValue({
        id: "session-1",
        userId: 1,
        refreshTokenHash: hash("another-token"),
        expiresAt: futureDate,
      });

      await expect(service.refreshTokens(refreshToken, "session-1")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("rejects an expired session", async () => {
      authRepository.findSessionById.mockResolvedValue({
        id: "session-1",
        userId: 1,
        refreshTokenHash: hash(refreshToken),
        expiresAt: new Date(Date.now() - 60_000),
      });

      await expect(service.refreshTokens(refreshToken, "session-1")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("rotates the refresh token for a valid session", async () => {
      authRepository.findSessionById.mockResolvedValue({
        id: "session-1",
        userId: 1,
        refreshTokenHash: hash(refreshToken),
        expiresAt: futureDate,
      });

      const result = await service.refreshTokens(refreshToken, "session-1");

      expect(authRepository.updateRefreshTokenHash).toHaveBeenCalledWith(
        "session-1",
        hash(result.refreshToken),
      );
    });
  });
});
