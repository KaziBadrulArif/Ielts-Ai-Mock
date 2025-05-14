import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">IELTS Writing Mock Test</h1>
          <p className="text-lg text-muted-foreground">
            Practice your IELTS writing skills and receive instant feedback - 100% Free
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Task 1: Academic</CardTitle>
              <CardDescription>
                Describe visual information (graph/table/chart/diagram) in your own words
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>You should spend about 20 minutes on this task. Write at least 150 words.</p>
            </CardContent>
            <CardFooter>
              <Link href="/test/task1" className="w-full">
                <Button className="w-full">Start Task 1</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task 2: Essay</CardTitle>
              <CardDescription>Write an essay in response to a point of view, argument or problem</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You should spend about 40 minutes on this task. Write at least 250 words.</p>
            </CardContent>
            <CardFooter>
              <Link href="/test/task2" className="w-full">
                <Button className="w-full">Start Task 2</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select a task type (Task 1 or Task 2)</li>
            <li>Get a uniquely generated question based on IELTS standards</li>
            <li>Write your response within the time limit</li>
            <li>Submit your answer when finished</li>
            <li>Receive detailed feedback based on IELTS criteria</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Our system generates unique questions each time, so you can practice with new content on every attempt!
          </p>
        </div>
      </div>
    </div>
  )
}
