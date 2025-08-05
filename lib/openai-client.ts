'use client'

import OpenAI from 'openai'

export type AIProvider = 'openai' | 'deepseek'

export function getAIClient(): OpenAI {
  const provider = localStorage.getItem('ai_provider') || 'openai'
  const apiKey = localStorage.getItem(`${provider}_api_key`)
  
  if (!apiKey) {
    throw new Error(`${provider === 'openai' ? 'OpenAI' : 'Deepseek'} API key not found. Please add your API key in settings.`)
  }
  
  const config = {
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
  }
  
  if (provider === 'deepseek') {
    return new OpenAI({
      ...config,
      baseURL: 'https://api.deepseek.com'
    })
  }
  
  // Default to OpenAI
  return new OpenAI(config)
}

export function getAIModel(): string {
  const provider = localStorage.getItem('ai_provider') || 'openai'
  return provider === 'deepseek' ? 'deepseek-chat' : 'gpt-3.5-turbo'
}

export function hasApiKey(): boolean {
  if (typeof window === 'undefined') return false
  const provider = localStorage.getItem('ai_provider') || 'openai'
  return !!localStorage.getItem(`${provider}_api_key`)
}

export function getCurrentProvider(): AIProvider {
  if (typeof window === 'undefined') return 'openai'
  return (localStorage.getItem('ai_provider') || 'openai') as AIProvider
}