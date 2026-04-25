import type { LoginBody, RegisterBody } from "@syncr/packages";
import { IsEmail, IsNumber, IsString, Matches, MinLength } from "class-validator";
import { users } from "src/db/schema";

export class RegisterDto implements RegisterBody {
  @IsEmail({}, { message: "Email has to be valid." })
  email: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
  })
  password: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;
}

export class LoginDto implements LoginBody {
  @IsEmail({}, { message: "Email has to be valid." })
  email: string;

  @IsString()
  password: string;
}

type User = typeof users.$inferSelect;
export class UserDto implements User {
  @IsNumber()
  id: number;

  @IsEmail({}, { message: "Email has to be valid." })
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;
}
