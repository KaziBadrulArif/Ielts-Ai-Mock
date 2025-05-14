"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeedbackDemoPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Demo Page</CardTitle>
          <CardDescription>
            This is a demo page for the feedback feature. To get real feedback, you need to complete a test first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The feedback page is designed to be accessed after completing a writing test. It analyzes your response and
            provides detailed feedback based on IELTS criteria.
          </p>
          <p>To try it out, please go to the home page and select a test type.</p>
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
