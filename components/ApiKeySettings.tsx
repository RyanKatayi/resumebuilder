'use client'

import { useState, useEffect } from 'react'
import { Settings, Key, Save, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AIProvider } from '@/lib/openai-client'

export function ApiKeySettings() {
  const [provider, setProvider] = useState<AIProvider>('openai')
  const [openaiKey, setOpenaiKey] = useState('')
  const [deepseekKey, setDeepseekKey] = useState('')
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [showDeepseekKey, setShowDeepseekKey] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    const savedProvider = localStorage.getItem('ai_provider') as AIProvider || 'openai'
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || ''
    const savedDeepseekKey = localStorage.getItem('deepseek_api_key') || ''
    
    setProvider(savedProvider)
    setOpenaiKey(savedOpenaiKey)
    setDeepseekKey(savedDeepseekKey)
  }, [])

  const handleSave = () => {
    const currentKey = provider === 'openai' ? openaiKey : deepseekKey
    
    if (!currentKey.trim()) {
      addToast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive'
      })
      return
    }

    // Save provider choice
    localStorage.setItem('ai_provider', provider)
    
    // Save API keys
    if (openaiKey.trim()) {
      localStorage.setItem('openai_api_key', openaiKey.trim())
    }
    if (deepseekKey.trim()) {
      localStorage.setItem('deepseek_api_key', deepseekKey.trim())
    }
    
    addToast({
      title: 'Success',
      description: `AI provider set to ${provider === 'openai' ? 'OpenAI' : 'Deepseek'}`,
      variant: 'success'
    })
    setIsOpen(false)
  }

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key
    return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          API Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>
            Choose your AI provider and add your API key
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as AIProvider)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-3.5)</SelectItem>
                <SelectItem value="deepseek">Deepseek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* OpenAI Configuration */}
          {provider === 'openai' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  OpenAI API Key
                </CardTitle>
                <CardDescription>
                  Used for AI-powered resume generation with GPT-3.5
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="openai-key"
                      type={showOpenaiKey ? "text" : "password"}
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder="sk-..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    >
                      {showOpenaiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-blue-900">
                    Don&apos;t have an API key? Get one from OpenAI:
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      platform.openai.com <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li>2. Sign up or log in to your account</li>
                    <li>3. Navigate to API Keys section</li>
                    <li>4. Create a new API key</li>
                    <li>5. Copy and paste it here</li>
                  </ol>
                </div>

                {openaiKey && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      Current key: <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                        {maskApiKey(openaiKey)}
                      </code>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Deepseek Configuration */}
          {provider === 'deepseek' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Deepseek API Key
                </CardTitle>
                <CardDescription>
                  Alternative AI provider for resume generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deepseek-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="deepseek-key"
                      type={showDeepseekKey ? "text" : "password"}
                      value={deepseekKey}
                      onChange={(e) => setDeepseekKey(e.target.value)}
                      placeholder="sk-..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowDeepseekKey(!showDeepseekKey)}
                    >
                      {showDeepseekKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-blue-900">
                    Don&apos;t have an API key? Get one from Deepseek:
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>1. Visit <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      platform.deepseek.com <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li>2. Sign up or log in to your account</li>
                    <li>3. Navigate to API Keys section</li>
                    <li>4. Create a new API key</li>
                    <li>5. Copy and paste it here</li>
                  </ol>
                </div>

                {deepseekKey && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      Current key: <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                        {maskApiKey(deepseekKey)}
                      </code>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}