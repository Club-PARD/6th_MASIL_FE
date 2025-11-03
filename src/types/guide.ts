// 가이드 요청 타입
export interface GuideRequestPayload {
  origin: string;
  budget: number;
  headcount: number;
  transportation: string;
  date: string;
  timeTable: string;
  theme: string;
  oneWay: boolean;
}

export interface ItemDto {
  title: string;
  order_num: number;
}

export interface ResponsePlanDto {
  order: number;
  planId: number;
  itemDtos: ItemDto[];
}

// 가이드 결과 타입
export interface GuideResultResponse {
  responsePlanDtos: ResponsePlanDto[];
}

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

// 가이드 상세 타입
export interface GuideDetailResponse {
  itemDtos: GuideDetailItem[];
}
