import { GoogleGenAI } from '@google/genai'

/**
 * Gemini API 클라이언트 초기화
 */
function getGeminiClient() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.')
  }

  return new GoogleGenAI({ apiKey })
}

/**
 * 메모 내용을 요약하는 함수
 * @param memoContent - 요약할 메모 내용
 * @returns 요약된 텍스트
 */
export async function summarizeMemo(memoContent: string): Promise<string> {
  try {
    const ai = getGeminiClient()

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: `다음 메모의 핵심 내용을 3-4문장으로 간결하게 요약해주세요. 요약문만 작성하고 다른 설명은 포함하지 마세요.\n\n메모 내용:\n${memoContent}`,
      config: {
        maxOutputTokens: 500,
        temperature: 0.3,
        topP: 0.9,
        topK: 40,
      },
    })

    const summary = response.text

    if (!summary) {
      throw new Error('요약 결과를 생성하지 못했습니다.')
    }

    return summary.trim()
  } catch (error) {
    console.error('메모 요약 중 오류 발생:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('API 키가 올바르지 않습니다. 환경 변수를 확인해주세요.')
      }
      throw new Error(`요약 생성 실패: ${error.message}`)
    }
    
    throw new Error('알 수 없는 오류가 발생했습니다.')
  }
}

