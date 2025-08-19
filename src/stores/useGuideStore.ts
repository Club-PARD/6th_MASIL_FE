import { create } from "zustand";

export type GuidePlan = {
  order: number | null;
  planId: number | null;
  itemDtos: GuideDetailItem[] | null;
};

export type GuideDetailItem = {
  title: string;
  order_num: number;
  duration?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  cost?: number | null;
  transport?: boolean | null;
  link_url?: string | null;
  description?: string | null;
  place_name?: string | null;
};

export type GuideState = {
  guideResults: GuidePlan[] | null;
  guideDetail: GuideDetailItem[] | null;
  isLoading: boolean;
  error: string | null;

  setGuideResults: (results: GuidePlan[]) => void; // data.responsePlanDtos 가 저장될거임
  setGuideDetail: (detail: GuideDetailItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
};

export const useGuideStore = create<GuideState>((set) => ({
  // 초기값
  guideResults: [],
  guideDetail: null,
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
