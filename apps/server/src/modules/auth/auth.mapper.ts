import { users } from "../../db/schema";
import { MeResponseDto } from "./auth.dto";

export const mapMeResponseDto = (user: typeof users.$inferSelect): MeResponseDto => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  };
};
