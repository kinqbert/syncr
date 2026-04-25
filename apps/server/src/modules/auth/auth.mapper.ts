import { User } from "@syncr/packages";

import { MeResponseDto } from "./auth.dto";

export const mapMeResponseDto = (user: User): MeResponseDto => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  };
};
