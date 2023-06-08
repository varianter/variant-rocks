import { create } from "zustand";
import { persist } from "zustand/middleware";
import { queryMeta } from "../utils";

export interface AccessControlStore {
  accessCode: string;
  token: string;
  context: string;

  updateToken: (_: string) => void;
  updateCode: (_: string) => void;
  updateContext: (_: string) => void;
  enabledAccessControl: () => boolean;
}

export const ACCESS_KEY = "access-control";

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      accessCode: "",
      context: "",
      enabledAccessControl() {
        return queryMeta("access") === "enabled";
      },
      updateCode(code: string) {
        set((state) => ({ accessCode: code }));
      },
      updateContext(context: string) {
        set((state) => ({ context: context }));
      },
      updateToken(token: string) {
        set((state) => ({ token }));
      },
    }),
    {
      name: ACCESS_KEY,
      version: 1,
    },
  ),
);
