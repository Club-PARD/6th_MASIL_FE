import { create } from "zustand";

type TripState = {
  // 날짜/시간
  date: string;             // 2025-08-15
  startTime: string;        // 10:00
  endTime: string;          // 20:00
  // 편도/왕복
  guideType: string;
  
  // Setter
  setDate: (v: string) => void;
  setStartTime: (v: string) => void;
  setEndTime: (v: string) => void;
  setGuideType: (v: string) => void;
};

export const useTripStore = create<TripState>((set) => ({
  date: "",
  startTime: "",
  endTime: "",
  guideType: "",

  setDate: (v) => set({ date: v }),
  setStartTime: (v) => set({ startTime: v }),
  setEndTime: (v) => set({ endTime: v }),
  setGuideType: (v) => set({ guideType: v }),
}));
