'use client'

import OpenAI from 'openai'

export function getDeepseekClient() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('deepseek_api_key') : null
  
  if (!apiKey) {
    throw new Error('Deepseek API key not found. Please add your API key in settings.')
  }
  
  return new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.deepseek.com',
    dangerouslyAllowBrowser: true // Required for client-side usage
  })
}

export function hasApiKey() {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('deepseek_api_key')
}