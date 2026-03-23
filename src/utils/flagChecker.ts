export interface Challenge {
  id: string;
  title: string;
  description: string;
}

// 비밀 정답 맵
const FLAG_MAP: Record<string, string> = {
  challenge_1: "HACTOR{정성훈_선배님_짱이에요!!}",
  challenge_2: "HACTOR{w3b_d1sc0v3ry_yay}"
};

// 클라이언트에 노출될 문제 목록 (정답 제외)
export const CHALLENGES: Challenge[] = [
  {
    id: "challenge_1",
    title: "1. PNG, ZIP 파일 구조 이해하기",
    description: "PNG 파일과 ZIP 파일의 구조를 이해하고, 이해한 내용을 바탕으로 문제를 해결하기."
  },
  {
    id: "challenge_2",
    title: "2. 웹 탐색기",
    description: "응답 헤더(Response Headers)에 단서가 숨어 있습니다."
  },
];

export async function verifyFlag(challengeId: string, input: string): Promise<boolean> {
  // 모의 지연 (검증 느낌)
  await new Promise(resolve => setTimeout(resolve, 600));

  const correctFlag = FLAG_MAP[challengeId];
  if (!correctFlag) return false;
  
  return input === correctFlag;
}
