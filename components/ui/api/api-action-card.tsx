'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronDown, ChevronUp, Play } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface Param {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object'
  required: boolean
  description: string
}

interface APIAction {
  name: string
  description: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  params: Param[]
}

export function APIActionCard({ action }: { action: APIAction }) {
  const [params, setParams] = useState<Record<string, any>>({})
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleParamChange = (name: string, value: any) => {
    setParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setResponse(null)
    setError(null)

    try {
      const url = new URL(`/api/v1${action.endpoint}`, window.location.origin)
      const options: RequestInit = {
        method: action.method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (action.method !== 'GET') {
        options.body = JSON.stringify(params)
      } else {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            url.searchParams.append(key, String(value))
          }
        })
      }

      const res = await fetch(url.toString(), options)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'An error occurred while fetching the data')
      }

      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const renderParamInput = (param: Param) => {
    switch (param.type) {
      case 'boolean':
        return (
          <Switch
            checked={params[param.name] || false}
            onCheckedChange={(checked) => handleParamChange(param.name, checked)}
          />
        )
      case 'object':
        return (
          <Textarea
            id={param.name}
            placeholder="Enter JSON object"
            value={params[param.name] || ''}
            onChange={(e) => {
              try {
                const parsedValue = JSON.parse(e.target.value)
                handleParamChange(param.name, parsedValue)
              } catch {
                handleParamChange(param.name, e.target.value)
              }
            }}
            className="font-mono"
          />
        )
      case 'number':
        return (
          <Input
            id={param.name}
            type="number"
            placeholder={`Enter ${param.name}`}
            value={params[param.name] || ''}
            onChange={(e) => handleParamChange(param.name, e.target.valueAsNumber)}
          />
        )
      default:
        return (
          <Input
            id={param.name}
            placeholder={`Enter ${param.name}`}
            value={params[param.name] || ''}
            onChange={(e) => handleParamChange(param.name, e.target.value)}
          />
        )
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{action.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardTitle>
        <CardDescription>{action.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500">Endpoint</p>
          <p className="font-mono text-sm">{action.endpoint}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500">Method</p>
          <p className="font-mono text-sm">{action.method}</p>
        </div>
        {isExpanded && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="params">
              <AccordionTrigger>Parameters</AccordionTrigger>
              <AccordionContent>
                {action.params.map((param) => (
                  <div key={param.name} className="mb-4">
                    <Label htmlFor={param.name} className="mb-1 block">
                      {param.name}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderParamInput(param)}
                    <p className="text-xs text-gray-500 mt-1">{param.description}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <Button onClick={handleSubmit} disabled={isLoading} className="mb-4">
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Test API Action
            </>
          )}
        </Button>
        {error && (
          <div className="w-full mb-4">
            <p className="text-sm font-medium text-red-500 mb-2">Error</p>
            <pre className="bg-red-50 p-4 rounded-md overflow-x-auto text-sm text-red-500">
              <code>{error}</code>
            </pre>
          </div>
        )}
        {response && (
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500 mb-2">Response</p>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>{response}</code>
            </pre>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}