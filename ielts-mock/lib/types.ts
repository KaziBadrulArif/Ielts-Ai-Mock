export type FeedbackCriteria = {
  score: number
  feedback: string
}

export type FeedbackResult = {
  taskAchievement: FeedbackCriteria
  coherenceAndCohesion: FeedbackCriteria
  lexicalResource: FeedbackCriteria
  grammaticalRangeAndAccuracy: FeedbackCriteria
  overallScore: number
  overallFeedback: string
  improvedVersion: string
}

export type Question = {
  id: number
  title: string
  description: string
  prompt: string
  timeLimit: number
}
