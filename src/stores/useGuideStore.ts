import { create } from "zustand";

type GuidePlan = {
  order: number;
  planId: number;
  itemDtos: GuideDetailItem[];
};

type GuideDetailItem = { 
  title: string;
  orderNum: number;
  duration?: string;
  startTime?: string;
  endTime?: string;
  cost?: number;
  isTransportation?: boolean;
  linkUrl?: string;
  description?: string;
};

type GuideState = {
  guideResults: GuidePlan[];
  selectedPlanId: number | null;
  guideDetail: GuideDetailItem[] | null;
  isLoading: boolean;
  error: string | null;

  setGuideResults: (results: GuidePlan[]) => void; // data.responsePlanDtos 가 저장될거임
  setSelectedPlanId: (planId: number | null) => void;
  setGuideDetail: (detail: GuideDetailItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
};

export const useGuideStore = create<GuideState>((set) => ({
  guideResults: [],
  selectedPlanId: null,
  guideDetail: null,
  isLoading: false,
  error: null,

  setGuideResults: (results) =>
    set({
      guideResults: Array.isArray(results) ? results : [],
      error: null,
    }),

  setSelectedPlanId: (planId) => set({ selectedPlanId: planId }),

  setGuideDetail: (detail) =>
    set({ guideDetail: detail, isLoading: false, error: null }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  clearAll: () =>
    set({
      guideResults: [],
      selectedPlanId: null,
      guideDetail: null,
      isLoading: false,
      error: null,
    }),
}));
