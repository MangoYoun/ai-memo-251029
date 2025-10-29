# 📝 메모 앱 (Memo App)

**핸즈온 실습용 Next.js 메모 애플리케이션**

Supabase 데이터베이스 기반의 완전한 CRUD 기능을 갖춘 메모 앱으로, MCP 연동 및 GitHub PR 생성 실습의 기반이 되는 프로젝트입니다.

> 🎉 **최신 업데이트**: LocalStorage에서 Supabase로 성공적으로 마이그레이션되었습니다! 자세한 내용은 [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)를 참고하세요.

## 🚀 주요 기능

- ✅ 메모 생성, 읽기, 수정, 삭제 (CRUD)
- 📂 카테고리별 메모 분류 (개인, 업무, 학습, 아이디어, 기타)
- 🏷️ 태그 시스템으로 메모 태깅
- 🔍 제목, 내용, 태그 기반 실시간 검색
- 🤖 Google Gemini AI 기반 메모 자동 요약 기능
- 📱 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 💾 Supabase 클라우드 데이터베이스 기반 저장
- 🔄 서버 액션을 통한 타입 안전한 데이터 처리
- 🎨 모던한 UI/UX with Tailwind CSS

## 🛠 기술 스택

- **Framework**: Next.js 15.4.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase JS Client
- **AI**: Google Gemini 2.0 Flash (gemini-2.0-flash-001)
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Server Actions**: Next.js Server Actions
- **Package Manager**: npm

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 필요한 API 키를 설정하세요:

```bash
# .env.local 파일 생성
cp .env.example .env.local

# .env.local 파일 편집
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

**Supabase 프로젝트 설정:**
1. [Supabase](https://supabase.com) 계정 생성 및 로그인
2. 새 프로젝트 생성
3. 프로젝트 설정 > API에서 Project URL과 anon public 키 복사
4. Supabase CLI로 로컬에서 연결:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

**Gemini API 키 발급 방법:**
1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Create API Key" 버튼 클릭
4. 생성된 API 키를 복사하여 `.env.local` 파일에 입력

> **참고:** AI 요약 기능을 사용하지 않는다면 Gemini API 키 설정을 건너뛸 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 브라우저 접속

```
http://localhost:3000
```

## 📁 프로젝트 구조

```
memo-app/
├── src/
│   ├── app/
│   │   ├── globals.css          # 글로벌 스타일
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   └── page.tsx             # 메인 페이지
│   ├── actions/
│   │   └── memoActions.ts       # 서버 액션 (CRUD)
│   ├── components/
│   │   ├── MemoForm.tsx         # 메모 생성/편집 폼
│   │   ├── MemoItem.tsx         # 개별 메모 카드
│   │   ├── MemoList.tsx         # 메모 목록 및 필터
│   │   └── MemoViewer.tsx       # 메모 상세보기 및 AI 요약
│   ├── hooks/
│   │   └── useMemos.ts          # 메모 관리 커스텀 훅
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts        # 클라이언트 사이드 Supabase
│   │       ├── server.ts        # 서버 사이드 Supabase
│   │       └── types.ts         # 데이터베이스 타입
│   ├── types/
│   │   └── memo.ts              # 메모 타입 정의
│   └── utils/
│       ├── geminiClient.ts      # Google Gemini API 클라이언트
│       ├── localStorage.ts      # LocalStorage 유틸리티 (레거시)
│       └── seedData.ts          # 샘플 데이터 시딩 (레거시)
├── .env.example                 # 환경 변수 템플릿
├── SUPABASE_MIGRATION.md        # Supabase 마이그레이션 문서
└── README.md                    # 프로젝트 문서
```

## 💡 주요 컴포넌트

### MemoItem

- 개별 메모를 카드 형태로 표시
- 편집/삭제 액션 버튼
- 카테고리 배지 및 태그 표시
- 날짜 포맷팅 및 텍스트 클램핑

### MemoForm

- 메모 생성/편집을 위한 모달 폼
- 제목, 내용, 카테고리, 태그 입력
- 태그 추가/제거 기능
- 폼 검증 및 에러 처리

### MemoViewer

- 메모 상세보기 모달
- Markdown 렌더링 지원
- AI 기반 메모 요약 기능 (Google Gemini 2.0 Flash)
- 편집/삭제 액션 버튼
- 요약 로딩 상태 및 에러 처리

### MemoList

- 메모 목록 그리드 표시
- 실시간 검색 및 카테고리 필터링
- 통계 정보 및 빈 상태 처리
- 반응형 그리드 레이아웃

## 📊 데이터 구조

```typescript
interface Memo {
  id: string // 고유 식별자
  title: string // 메모 제목
  content: string // 메모 내용
  category: string // 카테고리 (personal, work, study, idea, other)
  tags: string[] // 태그 배열
  createdAt: string // 생성 날짜 (ISO string)
  updatedAt: string // 수정 날짜 (ISO string)
}
```

## 🎯 실습 시나리오

이 프로젝트는 다음 3가지 실습의 기반으로 사용됩니다:

### 실습 1: Supabase MCP 마이그레이션 (45분) ✅

- ✅ LocalStorage → Supabase 데이터베이스 전환 완료
- ✅ MCP를 통한 자동 스키마 생성 완료
- ✅ 서버 액션으로 CRUD 재구현 완료
- 자세한 내용: [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)

### 실습 2: 기능 확장 + GitHub PR (60분)

- 메모 즐겨찾기 기능 추가
- Cursor Custom Modes로 PR 생성
- 코드 리뷰 및 협업 실습

### 실습 3: Playwright MCP 테스트 (45분)

- E2E 테스트 작성
- 브라우저 자동화 및 시각적 테스트
- 성능 측정 및 리포트

자세한 실습 가이드는 강의자료를 참고하세요.

## 🎨 샘플 데이터

앱 첫 실행 시 6개의 샘플 메모가 자동으로 생성됩니다:

- 프로젝트 회의 준비 (업무)
- React 18 새로운 기능 학습 (학습)
- 새로운 앱 아이디어: 습관 트래커 (아이디어)
- 주말 여행 계획 (개인)
- 독서 목록 (개인)
- 성능 최적화 아이디어 (아이디어)

## 🔧 개발 가이드

### 메모 CRUD 작업

```typescript
// useMemos 훅 사용 예시
const {
  memos, // 필터링된 메모 목록
  loading, // 로딩 상태
  createMemo, // 메모 생성
  updateMemo, // 메모 수정
  deleteMemo, // 메모 삭제
  searchMemos, // 검색
  filterByCategory, // 카테고리 필터링
  stats, // 통계 정보
} = useMemos()
```

### AI 메모 요약 기능

```typescript
import { summarizeMemo } from '@/utils/geminiClient'

// 메모 요약 생성
try {
  const summary = await summarizeMemo(memoContent)
  console.log('요약 결과:', summary)
} catch (error) {
  console.error('요약 실패:', error.message)
}
```

**특징:**
- Google Gemini 2.0 Flash 모델 사용
- 3-4문장으로 핵심 내용 요약
- 자동 오류 처리 및 사용자 피드백
- 요약 중 로딩 상태 표시

### Supabase 서버 액션 사용

```typescript
import {
  getMemos,
  createMemo,
  updateMemo,
  deleteMemo,
  searchMemos,
} from '@/actions/memoActions'

// 모든 메모 가져오기
const memos = await getMemos()

// 메모 추가
const newMemo = await createMemo({
  title: '새 메모',
  content: '내용',
  category: 'personal',
  tags: ['tag1'],
})

// 메모 검색
const results = await searchMemos('React')
```

## 🚀 배포

### 배포 전 준비

배포 플랫폼에서 환경 변수를 설정해야 합니다:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon 키
- `NEXT_PUBLIC_GEMINI_API_KEY`: Google Gemini API 키

### Vercel 배포

```bash
npm run build
npx vercel --prod
```

Vercel 대시보드에서 Environment Variables에 필요한 키들을 추가

### Netlify 배포

```bash
npm run build
# dist 폴더를 Netlify에 드래그 앤 드롭
```

Netlify 사이트 설정의 Environment Variables에 필요한 키들을 추가

## 📄 라이선스

MIT License - 학습 및 실습 목적으로 자유롭게 사용 가능합니다.

## 🤝 기여

이 프로젝트는 교육용으로 제작되었습니다. 개선사항이나 버그 리포트는 이슈나 PR로 제출해 주세요.

---

**Made with ❤️ for hands-on workshop**
