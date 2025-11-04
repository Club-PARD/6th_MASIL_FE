import { create } from "zustand";
import { ResponsePlanDto, GuideDetailItem } from "@/types/guide";

export type GuideState = {
  guideResults: ResponsePlanDto[] | null;
  guideDetail: GuideDetailItem[] | null;
  plansId: number | null;
  isLoading: boolean;
  error: string | null;

  setGuideResults: (results: ResponsePlanDto[]) => void; // data.responsePlanDtos 가 저장될거임
  setGuideDetail: (detail: GuideDetailItem[]) => void;
  setPlansId: (plansId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
};

export const useGuideStore = create<GuideState>((set) => ({
  // 초기값
  guideResults: [],
  guideDetail: null,
  plansId: 0,
  isLoading: false,
  error: null,

  // 액션
  setGuideResults: (results) =>
    set({
      guideResults: Array.isArray(results) ? results : [],
      error: null,
    }),

  setGuideDetail: (detail) =>
    set({ guideDetail: detail, isLoading: false, error: null }),

  setPlansId: (plansId) => set({ plansId: 0 }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  clearAll: () =>
    set({
      guideResults: [],
      guideDetail: null,
      isLoading: false,
      error: null,
    }),
}));
