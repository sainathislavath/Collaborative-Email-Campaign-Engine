import { create } from "zustand";

const useStore = create((set) => ({
  schema: {
    steps: [],
  },
  setSchema: (newSchema) => set({ schema: newSchema }),
}));

export default useStore;
