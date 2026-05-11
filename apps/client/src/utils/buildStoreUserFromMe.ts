import type { MeResponse } from "@syncr/packages";

import type { StoreUser } from "@/store/useAuthStore";

export const buildStoreUserFromMe = (response: MeResponse): StoreUser => {
  return {
    id: response.id,
    email: response.email,
  };
};
