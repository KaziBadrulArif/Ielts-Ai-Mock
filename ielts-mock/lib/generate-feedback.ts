"use server"

import type { FeedbackResult } from "./types"
import { generateEnhancedFeedback } from "./feedback-service"

export type { FeedbackCriteria, FeedbackResult } from "./types"

export async function generateFeedback(taskType: string, response: string): Promise<FeedbackResult> {
  try {
    // Validate inputs
    if (!taskType || !response) {
      throw new Error("Missing required parameters: taskType and response are required")
    }

    // Normalize taskType
    const normalizedTaskType = taskType.toLowerCase().trim()
    if (normalizedTaskType !== "task1" && normalizedTaskType !== "task2") {
      throw new Error("Invalid task type: must be 'task1' or 'task2'")
    }

    // Use our enhanced feedback service
    return await generateEnhancedFeedback(normalizedTaskType, response)
  } catch (error) {
    console.error("Error generating feedback:", error)
    // Return default feedback in case of error
    return {
      taskAchievement: { score: 6.0, feedback: "Your response addresses the task, but could be more comprehensive." },
      coherenceAndCohesion: {
        score: 6.0,
        feedback: "Your ideas are generally well-organized, but transitions could be improved.",
      },
      lexicalResource: {
        score: 6.0,
        feedback: "You use a reasonable range of vocabulary with some errors in word choice.",
      },
      grammaticalRangeAndAccuracy: {
        score: 6.0,
        feedback: "You demonstrate a mix of simple and complex sentences with some grammatical errors.",
      },
      overallScore: 6.0,
      overallFeedback:
        "Your writing shows competence but needs improvement in several areas to achieve a higher band score.",
      improvedVersion: response || "No response provided.",
    }
  }
}
