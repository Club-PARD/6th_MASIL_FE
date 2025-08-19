import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

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

// 가이드 결과 타입
export interface GuideResultResponse {
  responsePlanDtos: {
    order: number;
    planId: number;
    itemDtos: {
      title: string;
      orderNum: number;
    }[];
  }[];
}

// 가이드 상세 타입
export interface GuideDetailResponse {
  itemDtos: {
    title: string;
    orderNum: number;
    duration: string;
    startTime: string;
    endTime: string;
    cost?: number;
    isTransportation?: boolean;
    linkUrl?: string;
    description?: string;
  }[];
}

export const guideApi = {

  // 가이드 상세 정보 (GET)
  async getGuideDetail(planId: number): Promise<GuideDetailResponse> {
    try {
      const response = await axios.get<GuideDetailResponse>(
        `${API_BASE_URL}/plan/${planId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10초
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`서버 오류: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
        } else {
          throw new Error('요청 설정 중 오류가 발생했습니다.');
        }
      }
      throw new Error(error instanceof Error ? error.message : '가이드 상세 정보를 불러오는데 실패했습니다.');
    }
  },
};