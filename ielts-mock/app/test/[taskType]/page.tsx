"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Clock, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getRandomQuestion } from "@/lib/question-service"
import type { Question } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function TestPage({ params }: { params: { taskType: string } }) {
  const router = useRouter()
  const taskType = params.taskType

  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const fetchQuestion = async () => {
    try {
      setLoading(true)
      const questionData = await getRandomQuestion(taskType)
      setQuestion(questionData)
      setTimeLeft(questionData.timeLimit)
    } catch (error) {
      console.error("Error fetching question:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestion()
  }, [taskType])

  useEffect(() => {
    if (!timeLeft || !question) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, question])

  useEffect(() => {
    if (timeLeft <= 300 && !showWarning && timeLeft > 0) {
      // 5 minutes warning
      setShowWarning(true)
    }
  }, [timeLeft, showWarning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async () => {
    if (response.trim().length < 50) {
      alert("Your response is too short. Please write more before submitting.")
      return
    }

    setIsSubmitting(true)

    try {
      // Store the response in sessionStorage instead of passing it in the URL
      sessionStorage.setItem("ieltsResponse", response)
      sessionStorage.setItem("ieltsTaskType", taskType)
      sessionStorage.setItem("ieltsQuestionPrompt", question?.prompt || "")

      // Navigate to the feedback page without query parameters
      router.push("/feedback-result")
    } catch (error) {
      console.error("Navigation error:", error)
      alert("There was an error submitting your response. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleRegenerateQuestion = async () => {
    if (response.trim().length > 0) {
      const confirmChange = window.confirm(
        "Regenerating the question will clear your current response. Are you sure you want to continue?",
      )
      if (!confirmChange) return
    }

    setRegenerating(true)
    setResponse("")
    await fetchQuestion()
    setRegenerating(false)
    setShowWarning(false)
  }

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0
  const minWords = taskType === "task1" ? 150 : 250

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-64 w-full mb-2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Question</CardTitle>
            <CardDescription>We couldn't load the test question. Please try again.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>There was an error loading the test question. Please return to the home page and try again.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{question.title}</CardTitle>
            <div className="flex items-center gap-2 text-lg font-medium">
              <Clock className="h-5 w-5" />
              <span className={timeLeft <= 300 ? "text-red-500" : ""}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <CardDescription>{question.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md mb-6">
            <div className="flex justify-between items-start">
              <p className="font-medium">{question.prompt}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRegenerateQuestion}
                disabled={regenerating || isSubmitting}
                title="Generate a new question"
                className="ml-2 flex-shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
                <span className="sr-only">Regenerate Question</span>
              </Button>
            </div>
          </div>

          {showWarning && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Time Warning</AlertTitle>
              <AlertDescription>You have less than 5 minutes remaining. Please finish your response.</AlertDescription>
            </Alert>
          )}

          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your response here..."
            className="min-h-[300px] mb-2"
          />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Word count: {wordCount}</span>
            <span>Minimum: {minWords} words</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting || wordCount < 50} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit for Feedback"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
