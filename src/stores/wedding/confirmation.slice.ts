import { StateCreator } from "zustand";

export interface ConfirmationSlice {
  isConfirmed: boolean;
  setIsConfirmed: (confirmation: boolean) => void;
}

export const createConfirmationSlice: StateCreator<ConfirmationSlice> = (set) => ({
  isConfirmed: false,
  setIsConfirmed: (confirmation: boolean) => set({ isConfirmed: confirmation }),
});
