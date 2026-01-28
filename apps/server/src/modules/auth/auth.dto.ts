import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Email has to be valid." })
  email: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
  })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: "Email has to be valid." })
  email: string;

  @IsString()
  password: string;
}
