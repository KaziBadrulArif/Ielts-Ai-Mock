"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateFeedback } from "@/lib/generate-feedback"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { FeedbackResult } from "@/lib/types"

export default function FeedbackResultPage() {
  const router = useRouter()
  const [taskType, setTaskType] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [questionPrompt, setQuestionPrompt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDiff, setShowDiff] = useState(false)

  useEffect(() => {
    // Get the response and taskType from sessionStorage
    const storedResponse = sessionStorage.getItem("ieltsResponse")
    const storedTaskType = sessionStorage.getItem("ieltsTaskType")
    const storedPrompt = sessionStorage.getItem("ieltsQuestionPrompt")

    setResponse(storedResponse)
    setTaskType(storedTaskType)
    setQuestionPrompt(storedPrompt)

    if (!storedResponse || !storedTaskType) {
      setError("No test response found. Please complete a test first.")
      setLoading(false)
      return
    }

    const getFeedback = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await generateFeedback(storedTaskType, storedResponse)
        setFeedback(result)
      } catch (error) {
        console.error("Error generating feedback:", error)
        setError("An error occurred while generating feedback. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    getFeedback()
  }, [])

  const highlightDifferences = (original: string, improved: string) => {
    if (!showDiff) return improved

    // Split into paragraphs
    const originalParagraphs = original.split("\n\n")
    const improvedParagraphs = improved.split("\n\n")

    // If completely different structure, just return the improved version
    if (originalParagraphs.length !== improvedParagraphs.length) {
      return improved
    }

    // Process each paragraph to highlight differences
    const highlightedParagraphs = improvedParagraphs.map((paragraph, i) => {
      // If no corresponding original paragraph, return as is
      if (i >= originalParagraphs.length) return paragraph

      const originalPara = originalParagraphs[i]

      // If paragraphs are identical, return as is
      if (paragraph === originalPara) return paragraph

      // Simple word-by-word comparison (not perfect but gives a visual indication)
      const originalWords = originalPara.split(" ")
      const improvedWords = paragraph.split(" ")

      let highlightedPara = ""
      let j = 0

      for (let i = 0; i < improvedWords.length; i++) {
        const word = improvedWords[i]

        // Check if this word matches the original
        if (
          j < originalWords.length &&
          (word === originalWords[j] || word.toLowerCase() === originalWords[j].toLowerCase())
        ) {
          highlightedPara += word + " "
          j++
        } else {
          // Check if it's a replacement or new word
          let isReplacement = false

          // Look ahead a few words to see if we can find a match
          for (let k = 1; k < 4 && j + k < originalWords.length; k++) {
            if (
              improvedWords[i + k] &&
              (improvedWords[i + k] === originalWords[j] ||
                improvedWords[i + k].toLowerCase() === originalWords[j].toLowerCase())
            ) {
              isReplacement = true
              break
            }
          }

          if (isReplacement) {
            // It's replacing words
            highlightedPara += `<span class="bg-yellow-100 dark:bg-yellow-900">${word}</span> `
          } else {
            // It's a new addition
            highlightedPara += `<span class="bg-green-100 dark:bg-green-900">${word}</span> `
          }
        }
      }

      return highlightedPara.trim()
    })

    return highlightedParagraphs.join("\n\n")
  }

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

  if (error || !response || !taskType) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "No test response found. Please complete a test first."}</AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>No Test Response Found</CardTitle>
            <CardDescription>You need to complete a test before viewing feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please select a test type from the home page and submit your response to receive feedback.</p>
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

      {questionPrompt && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Question Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{questionPrompt}</p>
          </CardContent>
        </Card>
      )}

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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Improved Version</CardTitle>
                  <CardDescription>
                    A revised version of your response that addresses the feedback points
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  <label className="mr-2 text-sm">Highlight changes</label>
                  <input type="checkbox" checked={showDiff} onChange={() => setShowDiff(!showDiff)} className="mr-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="whitespace-pre-wrap bg-muted p-4 rounded-md"
                dangerouslySetInnerHTML={{
                  __html: showDiff
                    ? highlightDifferences(response || "", feedback.improvedVersion)
                    : feedback.improvedVersion,
                }}
              />
              {showDiff && (
                <div className="mt-4 text-sm">
                  <span className="inline-block bg-yellow-100 dark:bg-yellow-900 px-2 py-1 mr-2 rounded">Yellow</span>
                  <span className="mr-4">Modified text</span>
                  <span className="inline-block bg-green-100 dark:bg-green-900 px-2 py-1 mr-2 rounded">Green</span>
                  <span>Added text</span>
                </div>
              )}
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
