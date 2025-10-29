'use client'

import { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Memo, MEMO_CATEGORIES } from '@/types/memo'
import { summarizeMemo } from '@/utils/geminiClient'

interface MemoViewerProps {
  isOpen: boolean
  memo: Memo | null
  onClose: () => void
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => Promise<void>
}

export default function MemoViewer({ isOpen, memo, onClose, onEdit, onDelete }: MemoViewerProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // 메모가 변경되면 요약 초기화
  useEffect(() => {
    setSummary(null)
    setSummaryError(null)
    setShowSummary(false)
  }, [memo?.id])

  if (!isOpen || !memo) return null

  const handleSummarize = async () => {
    if (!memo.content.trim()) {
      setSummaryError('요약할 내용이 없습니다.')
      return
    }

    setIsLoadingSummary(true)
    setSummaryError(null)

    try {
      const result = await summarizeMemo(memo.content)
      setSummary(result)
      setShowSummary(true)
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : '요약 생성에 실패했습니다.')
      setShowSummary(true)
    } finally {
      setIsLoadingSummary(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      study: 'bg-purple-100 text-purple-800',
      idea: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return (colors as any)[category] || colors.other
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="memo-viewer-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 id="memo-viewer-title" className="text-xl font-semibold text-gray-900 mb-2">
                {memo.title}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(memo.category)}`}
                >
                  {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] || memo.category}
                </span>
                <span className="text-xs text-gray-500">수정 {formatDate(memo.updatedAt)}</span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(memo)}
                className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="편집"
              >
                편집
              </button>
              <button
                onClick={() => {
                  if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
                    onDelete(memo.id)
                  }
                }}
                className="px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="삭제"
              >
                삭제
              </button>
              <button
                onClick={handleSummarize}
                disabled={isLoadingSummary}
                className="px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="AI 요약"
              >
                {isLoadingSummary ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    요약 중...
                  </span>
                ) : (
                  '요약'
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="닫기"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* AI 요약 결과 */}
          {showSummary && (
            <div className="mt-6 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI 요약
                </h3>
                <button
                  onClick={() => setShowSummary(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                  title="요약 닫기"
                >
                  닫기
                </button>
              </div>
              {summaryError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {summaryError}
                  </p>
                </div>
              ) : summary ? (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
                </div>
              ) : null}
            </div>
          )}

          <div className="prose max-w-none">
            <div data-color-mode="light">
              <MDEditor.Markdown 
                source={memo.content} 
                style={{ 
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'transparent',
                  color: '#374151'
                }}
              />
            </div>
          </div>

          {memo.tags.length > 0 && (
            <div className="mt-6 flex gap-2 flex-wrap">
              {memo.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


