import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-2xl font-bold mb-2">Loading Feedback</h2>
      <p className="text-muted-foreground text-center max-w-md">Please wait while we prepare your feedback...</p>
    </div>
  )
}
