import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { name, birthDate } = await request.json();

    if (!name || !birthDate) {
      return NextResponse.json(
        { error: "이름과 생년월일을 입력해주세요." },
        { status: 400 }
      );
    }

    const prompt = `당신은 신비로운 운세 분석가입니다. 사용자의 이름과 생년월일을 기반으로 2026년을 정의할 3개의 키워드를 생성해주세요.

사용자 정보:
- 이름: ${name}
- 생년월일: ${birthDate}

다음 JSON 형식으로 정확히 응답해주세요 (다른 텍스트 없이 순수 JSON만):
{
  "keywords": [
    {
      "keyword": "한 단어 키워드",
      "emoji": "관련 이모지 1개",
      "description": "이 키워드가 2026년에 왜 중요한지 2-3문장으로 설명. 구체적이고 개인적인 느낌으로."
    },
    {
      "keyword": "한 단어 키워드",
      "emoji": "관련 이모지 1개",
      "description": "이 키워드가 2026년에 왜 중요한지 2-3문장으로 설명. 구체적이고 개인적인 느낌으로."
    },
    {
      "keyword": "한 단어 키워드",
      "emoji": "관련 이모지 1개",
      "description": "이 키워드가 2026년에 왜 중요한지 2-3문장으로 설명. 구체적이고 개인적인 느낌으로."
    }
  ],
  "summary": "2026년 전체 운세를 한 줄로 총평 (희망적이고 긍정적인 톤)",
  "luckyColor": "럭키 컬러 (한국어, 예: 로즈골드)",
  "luckyNumber": 행운의 숫자(1-99 사이 정수),
  "luckyColorHex": "럭키 컬러의 HEX 코드 (예: #E8B4B8)"
}

키워드 생성 기준:
1. 운세(사주, 별자리 기반 운의 흐름)
2. 성격(이름과 생년월일에서 유추되는 성향)
3. 2026년 트렌드(사회/문화적 흐름)
4. 키워드는 긍정적이고 영감을 주는 단어로
5. 설명은 ~해요/~이에요 체로 친근하게
6. 각 키워드는 서로 다른 영역(사랑/일/건강/성장/관계/재물 등)에서`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 신비로운 운세 분석가입니다. 항상 요청된 JSON 형식으로만 응답하세요.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI 응답이 비어있습니다.");
    }

    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Keyword generation error:", error);
    return NextResponse.json(
      { error: "키워드 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
