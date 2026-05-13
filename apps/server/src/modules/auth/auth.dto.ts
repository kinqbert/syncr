import {
  type LoginBody,
  type MeResponse,
  type RegisterBody,
  type UpdatePasswordBody,
  type UpdateProfileBody,
} from "@syncr/packages";
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from "class-validator";

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

export class MeResponseDto implements MeResponse {
  @IsNumber()
  id: number;

  @IsEmail({}, { message: "Email has to be valid." })
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsDateString()
  birthday: string | null;

  @IsNumber()
  weeklyLoadMinutes: number;
}

export class UpdateProfileDto implements UpdateProfileBody {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsDateString()
  birthday: string | null;

  @IsInt()
  @Min(60)
  @Max(10080)
  weeklyLoadMinutes: number;
}

export class UpdatePasswordDto implements UpdatePasswordBody {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
  })
  newPassword: string;
}
