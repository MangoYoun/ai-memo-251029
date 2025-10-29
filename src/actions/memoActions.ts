'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Memo, MemoFormData } from '@/types/memo'

/**
 * 모든 메모 가져오기
 */
export async function getMemos(): Promise<Memo[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching memos:', error)
      throw new Error(error.message)
    }

    // Supabase의 created_at, updated_at을 ISO 문자열로 변환
    return (
      data?.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags || [],
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      })) || []
    )
  } catch (error) {
    console.error('Failed to get memos:', error)
    return []
  }
}

/**
 * 특정 메모 가져오기
 */
export async function getMemoById(id: string): Promise<Memo | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('memos').select('*').eq('id', id).single()

    if (error) {
      console.error('Error fetching memo:', error)
      return null
    }

    if (!data) return null

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error('Failed to get memo by id:', error)
    return null
  }
}

/**
 * 메모 생성
 */
export async function createMemo(formData: MemoFormData): Promise<Memo | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('memos')
      .insert({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating memo:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error('Failed to create memo:', error)
    return null
  }
}

/**
 * 메모 업데이트
 */
export async function updateMemo(id: string, formData: MemoFormData): Promise<Memo | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('memos')
      .update({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating memo:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error('Failed to update memo:', error)
    return null
  }
}

/**
 * 메모 삭제
 */
export async function deleteMemo(id: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('memos').delete().eq('id', id)

    if (error) {
      console.error('Error deleting memo:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Failed to delete memo:', error)
    return false
  }
}

/**
 * 카테고리별 메모 필터링
 */
export async function getMemosByCategory(category: string): Promise<Memo[]> {
  try {
    const supabase = await createClient()

    let query = supabase.from('memos').select('*').order('created_at', { ascending: false })

    if (category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching memos by category:', error)
      throw new Error(error.message)
    }

    return (
      data?.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags || [],
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      })) || []
    )
  } catch (error) {
    console.error('Failed to get memos by category:', error)
    return []
  }
}

/**
 * 메모 검색
 */
export async function searchMemos(query: string): Promise<Memo[]> {
  try {
    const supabase = await createClient()
    const lowercaseQuery = query.toLowerCase()

    // Supabase에서 검색 (제목, 내용, 태그)
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .or(
        `title.ilike.%${lowercaseQuery}%,content.ilike.%${lowercaseQuery}%,tags.cs.{${lowercaseQuery}}`
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching memos:', error)
      throw new Error(error.message)
    }

    return (
      data?.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags || [],
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      })) || []
    )
  } catch (error) {
    console.error('Failed to search memos:', error)
    return []
  }
}

/**
 * 모든 메모 삭제
 */
export async function clearAllMemos(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('memos').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) {
      console.error('Error clearing all memos:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Failed to clear all memos:', error)
    return false
  }
}

