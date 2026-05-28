'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Type, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { saveContent, updateContent } from '@/lib/content/appwrite'
import { getUser } from '@/lib/user/appwrite'
import { useRouter } from 'next/navigation'
import { useCompanyId } from '@/hooks/useCompany'
interface AnalysisResult {
  contentScore: number
  readability: number
  tone: string
  keyInsights: string[]
  improvements: string[]
}

interface AnalysisPanelProps {
  content: string
  triggerAnalysis: boolean
  dataFromChild: string
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  content,
  triggerAnalysis,
  dataFromChild
}) => {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { companyId, companyloading } = useCompanyId()
  
   // Calculate word count and reading time whenever dataFromChild changes
   useEffect(() => {
    if (!dataFromChild) return;
  
    const words = dataFromChild.split(/\s+/).filter(Boolean);
    const count = words.length;
    const time = Math.ceil(count / 150); // Assuming 150 wpm reading speed
  
    setWordCount(count);
    setReadingTime(time);
  }, [dataFromChild]);

  // Trigger content analysis when dataFromChild and triggerAnalysis are present
  // AND companyId is loaded (important change)
  useEffect(() => {
    // Only proceed if companyId is loaded and not null
    if (companyloading) return;
    
    const analyzeContent = async () => {
      if (dataFromChild && dataFromChild.trim().length > 0 && triggerAnalysis) {
        setIsLoading(true)
        setError(null)

        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: dataFromChild }),
          })

          if (!response.ok) {
            throw new Error('Failed to analyze content')
          }
          
          const result = await response.json()

          setAnalysis({
            contentScore: result.contentScore || 0,
            readability: result.readability || 0,
            tone: result.tone || 'neutral',
            keyInsights: result.keyInsights || [],
            improvements: result.improvements || [],
          })

          const documentId = localStorage.getItem('documentId')
          if (documentId) {
            await updateContent(documentId, {
              input: dataFromChild,
              analysis: dataFromChild,
              contentScore: result.contentScore,
              readability: result.readability,
              tone: result.tone,
              keyInsights: result.keyInsights,
              improvements: result.improvements,
              wordCount: wordCount,
              readingTime: readingTime,
              companyId: companyId
            })
          } else {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
              router.push('/auth/login');
              return;
            }
            const user = await getUser(sessionToken)
            await saveContent(
              dataFromChild,
              user.$id,
              dataFromChild,
              'analyze',
              result.contentScore,
              result.readability,
              result.tone,
              result.keyInsights,
              result.improvements,
              wordCount,
              readingTime,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              companyId ?? undefined
            )
          }
        } catch (error) {
          console.error('Error analyzing content:', error)
          setError(
            "I'm sorry, but the content provided is incomplete. Please provide more information or the full content to proceed with the analysis"
          )
        } finally {
          setIsLoading(false)
        }
      } else {
        setAnalysis(null)
      }
    }

    analyzeContent()
  }, [dataFromChild, triggerAnalysis, wordCount, readingTime, companyId, companyloading])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-xs text-muted-foreground">Analyzing content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Deep Analysis</h2>
          <p className="text-xs text-muted-foreground max-w-xs">Click &quot;Analyze&quot; to get readability score, tone, insights and improvement suggestions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

            {/* Score ring */}
            <div className="flex flex-col items-center py-4 mb-2">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: 'hsl(250,84%,60%)', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: 'hsl(280,84%,70%)', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" fill="transparent" strokeWidth="8" stroke="hsl(var(--border))" />
                  <motion.circle
                    stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                    cx="50" cy="50" r="40" fill="transparent"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: analysis.contentScore / 100 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                >
                  <span className="text-2xl font-bold text-foreground">{Math.round(analysis.contentScore)}</span>
                  <span className="text-[10px] text-muted-foreground">Score</span>
                </motion.div>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Words', value: wordCount, icon: <Type className="h-3.5 w-3.5" /> },
                { label: 'Read Time', value: `${readingTime}m`, icon: <Clock className="h-3.5 w-3.5" /> },
                { label: 'Readability', value: `${Math.round(analysis.readability)}%`, icon: <Zap className="h-3.5 w-3.5" /> },
                { label: 'Tone', value: analysis.tone, icon: <AlertCircle className="h-3.5 w-3.5" /> },
              ].map(({ label, value, icon }) => (
                <motion.div
                  key={label}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-secondary border border-border rounded-xl p-3"
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    {icon}
                    <span className="text-[11px] font-medium">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-primary truncate block">{value}</span>
                </motion.div>
              ))}
            </div>

            {/* Key Insights */}
            <div className="bg-secondary border border-border rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground">Key Insights</h3>
              </div>
              <ul className="space-y-2">
                {analysis.keyInsights.map((insight, i) => (
                  <motion.li key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <span>{insight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-secondary border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground">Improvements</h3>
              </div>
              <ul className="space-y-2">
                {analysis.improvements.map((item, i) => (
                  <motion.li key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPanel