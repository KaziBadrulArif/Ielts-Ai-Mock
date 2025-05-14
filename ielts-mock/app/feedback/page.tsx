"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateFeedback } from "@/lib/generate-feedback"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type FeedbackCriteria = {
  score: number
  feedback: string
}

type FeedbackResult = {
  taskAchievement: FeedbackCriteria
  coherenceAndCohesion: FeedbackCriteria
  lexicalResource: FeedbackCriteria
  grammaticalRangeAndAccuracy: FeedbackCriteria
  overallScore: number
  overallFeedback: string
  improvedVersion: string
}

export default function FeedbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const taskType = searchParams?.get("taskType")
  const response = searchParams?.get("response") || ""

  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if we have the required parameters
  const missingParams = !taskType || !response

  useEffect(() => {
    // If we're missing required parameters, don't try to generate feedback
    if (missingParams) {
      setLoading(false)
      setError("Missing required parameters. Please submit a test response first.")
      return
    }

    const getFeedback = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await generateFeedback(taskType, response)
        setFeedback(result)
      } catch (error) {
        console.error("Error generating feedback:", error)
        setError("An error occurred while generating feedback. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    getFeedback()
  }, [taskType, response, missingParams])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Analyzing Your Response</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Your writing is being evaluated based on IELTS criteria. This may take a moment...
        </p>
      </div>
    )
  }

  if (missingParams) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              No Test Response Found
            </CardTitle>
            <CardDescription>You need to complete a test before viewing feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Please select a test type from the home page and submit your response to receive feedback.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button>Go to Home Page</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Error Generating Feedback</CardTitle>
            <CardDescription>We encountered an issue while analyzing your response.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try again or contact support if the problem persists.</p>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Error Generating Feedback</CardTitle>
            <CardDescription>We encountered an issue while analyzing your response.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try again or contact support if the problem persists.</p>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Your IELTS Writing Feedback</h1>
        <p className="text-muted-foreground">
          Detailed analysis of your {taskType === "task1" ? "Task 1" : "Task 2"} response
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Score</span>
            <span className="text-2xl">{feedback.overallScore.toFixed(1)} / 9.0</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={feedback.overallScore * 11.1} className="h-3" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Task Achievement</span>
                <span className="font-medium">{feedback.taskAchievement.score.toFixed(1)}</span>
              </div>
              <Progress value={feedback.taskAchievement.score * 11.1} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Coherence & Cohesion</span>
                <span className="font-medium">{feedback.coherenceAndCohesion.score.toFixed(1)}</span>
              </div>
              <Progress value={feedback.coherenceAndCohesion.score * 11.1} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Lexical Resource</span>
                <span className="font-medium">{feedback.lexicalResource.score.toFixed(1)}</span>
              </div>
              <Progress value={feedback.lexicalResource.score * 11.1} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Grammatical Range & Accuracy</span>
                <span className="font-medium">{feedback.grammaticalRangeAndAccuracy.score.toFixed(1)}</span>
              </div>
              <Progress value={feedback.grammaticalRangeAndAccuracy.score * 11.1} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="detailed">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detailed">Detailed Feedback</TabsTrigger>
          <TabsTrigger value="improved">Improved Version</TabsTrigger>
          <TabsTrigger value="original">Your Response</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Achievement</CardTitle>
              <CardDescription>How well you addressed all parts of the task</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{feedback.taskAchievement.feedback}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coherence & Cohesion</CardTitle>
              <CardDescription>How well your ideas are organized and connected</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{feedback.coherenceAndCohesion.feedback}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lexical Resource</CardTitle>
              <CardDescription>Your vocabulary range and accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{feedback.lexicalResource.feedback}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grammatical Range & Accuracy</CardTitle>
              <CardDescription>Your grammar usage and sentence structures</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{feedback.grammaticalRangeAndAccuracy.feedback}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{feedback.overallFeedback}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Improved Version</CardTitle>
              <CardDescription>A revised version of your response that addresses the feedback points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">{feedback.improvedVersion}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="original" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Original Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">{response}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-center">
        <Link href="/">
          <Button>Try Another Test</Button>
        </Link>
      </div>
    </div>
  )
}
