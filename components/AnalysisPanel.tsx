'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, BarChart3, Clock, Type, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { saveContent, updateContent } from '@/lib/content/appwrite'
import { getUser } from '@/lib/user/appwrite';
import { clearAuthSession } from '@/lib/user/session';
import { ANALYSIS_MIN_PLAIN_CHARS, htmlToPlainText } from '@/lib/content/plainText'
import { useCompanyId } from '@/hooks/useCompany'
import DashboardPanelLoading from '@/components/dashboard/DashboardPanelLoading'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'
import DashboardResultCard from '@/components/dashboard/DashboardResultCard'
import { dashboardBullet, dashboardListItem, dashboardMetricValue } from '@/components/dashboard/dashboardLayout'
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
  analysisRunId?: number
  dataFromChild: string
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  content,
  triggerAnalysis,
  analysisRunId = 0,
  dataFromChild
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { companyId, companyloading } = useCompanyId()
  const router = useRouter()
  const lastAnalyzedRef = useRef<string | null>(null)

  const sourceContent = (dataFromChild || content).trim()
  const plainContent = htmlToPlainText(sourceContent)

  useEffect(() => {
    if (!plainContent) {
      setWordCount(0)
      setReadingTime(0)
      return
    }

    const words = plainContent.split(/\s+/).filter(Boolean)
    const count = words.length
    const time = Math.ceil(count / 150)

    setWordCount(count)
    setReadingTime(time)
  }, [plainContent])

  useEffect(() => {
    if (companyloading) return

    const analyzeContent = async () => {
      if (!triggerAnalysis || !plainContent) {
        if (!triggerAnalysis) {
          lastAnalyzedRef.current = null
        }
        setAnalysis(null)
        return
      }

      if (plainContent.length < ANALYSIS_MIN_PLAIN_CHARS) {
        setAnalysis(null)
        setError(
          `Add at least ${ANALYSIS_MIN_PLAIN_CHARS} characters of text before running analysis.`
        )
        return
      }

      const runKey = `${analysisRunId}:${plainContent}`
      if (lastAnalyzedRef.current === runKey) return
      lastAnalyzedRef.current = runKey

      setIsLoading(true)
      setError(null)

      const words = plainContent.split(/\s+/).filter(Boolean)
      const count = words.length
      const time = Math.ceil(count / 150)

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: sourceContent }),
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          const message =
            typeof result?.error === 'string'
              ? result.error
              : 'Failed to analyze content. Please try again.'
          throw new Error(message)
        }

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
            input: sourceContent,
            analysis: sourceContent,
            contentScore: result.contentScore,
            readability: result.readability,
            tone: result.tone,
            keyInsights: result.keyInsights,
            improvements: result.improvements,
            wordCount: count,
            readingTime: time,
            companyId: companyId ?? undefined,
          })
        } else {
          const sessionToken = localStorage.getItem('sessionToken')
          if (!sessionToken) {
            router.push('/auth/login')
            throw new Error('No session found')
          }
          const user = await getUser(sessionToken)
          if (!user) {
            clearAuthSession()
            router.push('/auth/login')
            return
          }
          await saveContent(
            sourceContent,
            user.$id,
            sourceContent,
            'analyze',
            result.contentScore,
            result.readability,
            result.tone,
            result.keyInsights,
            result.improvements,
            count,
            time,
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
      } catch (err) {
        console.error('Error analyzing content:', err)
        lastAnalyzedRef.current = null
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to analyze content. Please try again.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    void analyzeContent()
  }, [plainContent, sourceContent, triggerAnalysis, analysisRunId, companyId, companyloading, router])

  if ((companyloading && triggerAnalysis) || isLoading) {
    return <DashboardPanelLoading label={companyloading ? 'Preparing analysis…' : 'Analyzing content…'} />
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <p className="text-center text-sm text-red-300" role="alert">{error}</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <DashboardEmptyState
        icon={BarChart3}
        title="Ready to analyze"
        description='Click "Run analysis" in the editor to score your content and get insights.'
      />
    )
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardResultCard title="Content score" icon={<Zap className="h-4 w-4 text-violet-400" />}>
        <div className="flex items-center justify-center py-2">
          <motion.div
            className="relative h-40 w-40"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <svg className="h-full w-full" viewBox="0 0 100 100" aria-hidden>
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle className="text-slate-200" cx="50" cy="50" r="40" fill="transparent" strokeWidth="8" stroke="currentColor" />
              <motion.circle
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                transform="rotate(-90 50 50)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: analysis.contentScore / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-900">
              {Math.round(analysis.contentScore)}
            </div>
          </motion.div>
        </div>
      </DashboardResultCard>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={<Type className="h-4 w-4 text-violet-400" />} label="Word count" value={wordCount} />
        <MetricCard icon={<Clock className="h-4 w-4 text-violet-400" />} label="Reading time" value={`${readingTime} min`} />
        <MetricCard icon={<Type className="h-4 w-4 text-violet-400" />} label="Readability" value={`${Math.round(analysis.readability)}%`} />
        <MetricCard icon={<AlertCircle className="h-4 w-4 text-violet-400" />} label="Tone" value={analysis.tone} />
      </div>

      <DashboardResultCard title="Key insights" icon={<AlertCircle className="h-4 w-4 text-violet-400" />}>
        <ul className="space-y-3">
          {analysis.keyInsights.map((insight, index) => (
            <motion.li key={index} className={dashboardListItem} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.05 }}>
              <span className={dashboardBullet}>•</span>
              <span>{insight}</span>
            </motion.li>
          ))}
        </ul>
      </DashboardResultCard>

      <DashboardResultCard title="Suggested improvements" icon={<Zap className="h-4 w-4 text-violet-400" />}>
        <ul className="space-y-3">
          {analysis.improvements.map((improvement, index) => (
            <motion.li key={index} className={dashboardListItem} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.05 }}>
              <span className={dashboardBullet}>•</span>
              <span>{improvement}</span>
            </motion.li>
          ))}
        </ul>
      </DashboardResultCard>
    </motion.div>
  )
}

const MetricCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: number | string
}> = ({ icon, label, value }) => (
  <DashboardResultCard title={label} icon={icon}>
    <p className={dashboardMetricValue}>{value}</p>
  </DashboardResultCard>
)

export default AnalysisPanel