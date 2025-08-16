import { create } from "zustand";


//출발일 및 소요시간
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


//2번 이동수단 
type MoveState = {
  car: string;
  setCar: (v:string) => void;
}

export const useMoveState = create<MoveState>((set)=> ({
  car: "",

  setCar: (v) => set({car:v}),
}));

//3번 인원수
type PeopleState = {
  people: number;
  setPeople: (v:number) => void;
}

export const usePeopleState = create<PeopleState>((set) => ({
  people: 1,

  setPeople: (v) => set({ people: v }),
}));

//4번 예산
type BudgetState = {
  budget: number;
  setBudget: (v:number) => void;
}

export const useBudgetState = create<BudgetState>((set) => ({
  budget: 0,

  setBudget: (v) => set({ budget: v }),
}));

//5번 나들이 테마
type ThemeState = {
  theme: string;
  setTheme: (v:string) => void;
}

export const useThemeState = create<ThemeState>((set) => ({
  theme: "",

  setTheme: (v) => set({ theme: v }),
}));