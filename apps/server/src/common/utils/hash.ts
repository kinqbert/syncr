import { sha256 } from "js-sha256";

export const hash = (data: string) => {
  return sha256(data);
};
