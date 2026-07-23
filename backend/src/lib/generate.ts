// AI 초안 생성기 — 인터페이스 뒤에 mock을 두고, 나중에 Anthropic SDK로 교체.
export interface Draft {
  title: string
  description: string
  content: string // 마크다운
  tags: string[]
}

export interface DraftGenerator {
  generate(notes: string): Promise<Draft>
}

// mock: 메모에서 제목·태그를 뽑고 마크다운 스캐폴드를 만든다(외부 호출 없음).
export const mockGenerator: DraftGenerator = {
  async generate(notes: string): Promise<Draft> {
    const firstLine = (notes.split('\n').find((l) => l.trim()) ?? '무제').trim()
    const title = firstLine.slice(0, 60)
    const words = notes.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
    const tags = [...new Set(words.filter((w) => w.length >= 4))].slice(0, 5)
    const description = `${title}에 대한 기술 노트 초안입니다.`
    const content = [
      `# ${title}`,
      '',
      '## 개요',
      notes.trim(),
      '',
      '## 핵심',
      '- (요점 1)',
      '- (요점 2)',
      '',
      '## 정리',
      '이 초안을 다듬어 발행하세요.',
    ].join('\n')
    return { title, description, content, tags }
  },
}

// 교체 지점: Phase 5 실연동 시 mockGenerator 대신 Anthropic SDK 기반 구현을 주입.
export const draftGenerator: DraftGenerator = mockGenerator
