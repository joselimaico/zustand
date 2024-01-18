import { StateCreator } from "zustand";

export interface GuestSlice {
  guestCount: number;
  setGestCount: (guestCount: number) => void;
}

export const createGuestSlice: StateCreator<GuestSlice> = (set) => ({
  guestCount: 0,
  setGestCount: (guestCount: number) => {
    const value = guestCount < 0 ? 0 : guestCount;
    set({ guestCount: value });
  },
});
