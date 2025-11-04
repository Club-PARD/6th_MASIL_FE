import {
  GuideDetailResponse,
  GuideRequestPayload,
  GuideResultResponse,
} from "@/types/guide";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const guideApi = {
  // 가이드 요청
  async requestGuide(
    payload: GuideRequestPayload
  ): Promise<GuideResultResponse> {
    try {
      const response = await axios.post<GuideResultResponse>(
        `${API_BASE_URL}/api/plans`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `서버 오류: ${error.response.status} - ${
              error.response.data?.message || error.response.statusText
            }`
          );
        } else if (error.request) {
          throw new Error(
            "서버에 연결할 수 없습니다. 네트워크를 확인해주세요."
          );
        } else {
          throw new Error("요청 설정 중 오류가 발생했습니다.");
        }
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : "가이드 상세 정보를 불러오는데 실패했습니다."
      );
    }
  },
  // 가이드 상세 정보 (GET)
  async getGuideDetail(planId: number | null): Promise<GuideDetailResponse> {
    try {
      const response = await axios.get<GuideDetailResponse>(
        `${API_BASE_URL}/api/plans/planDetails/${planId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10초
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `서버 오류: ${error.response.status} - ${
              error.response.data?.message || error.response.statusText
            }`
          );
        } else if (error.request) {
          throw new Error(
            "서버에 연결할 수 없습니다. 네트워크를 확인해주세요."
          );
        } else {
          throw new Error("요청 설정 중 오류가 발생했습니다.");
        }
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : "가이드 상세 정보를 불러오는데 실패했습니다."
      );
    }
  },
  async getNewGuide(plansId: number): Promise<GuideResultResponse> {
    try {
      const response = await axios.get<GuideResultResponse>(
        `${API_BASE_URL}/api/plans/${plansId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `서버 오류: ${error.response.status} - ${
              error.response.data?.message || error.response.statusText
            }`
          );
        } else if (error.request) {
          throw new Error(
            "서버에 연결할 수 없습니다. 네트워크를 확인해주세요."
          );
        } else {
          throw new Error("요청 설정 중 오류가 발생했습니다.");
        }
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : "가이드 상세 정보를 불러오는데 실패했습니다."
      );
    }
  },
};
