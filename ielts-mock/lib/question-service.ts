"use server"

import { generateQuestion } from "./question-generator"
import type { Question } from "./types"

// Sample questions database - as fallback if generation fails
const sampleQuestions = {
  task1: [
    {
      id: 1,
      title: "Task 1: Academic Writing",
      description: "You should spend about 20 minutes on this task. Write at least 150 words.",
      prompt:
        "The graph below shows the proportion of the population aged 65 and over between 1940 and 2040 in three different countries. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      timeLimit: 20 * 60, // 20 minutes in seconds
    },
    {
      id: 2,
      title: "Task 1: Academic Writing",
      description: "You should spend about 20 minutes on this task. Write at least 150 words.",
      prompt:
        "The charts below show the percentage of water used for different purposes in six areas of the world. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      timeLimit: 20 * 60,
    },
    {
      id: 3,
      title: "Task 1: Academic Writing",
      description: "You should spend about 20 minutes on this task. Write at least 150 words.",
      prompt:
        "The table below shows the sales made by a coffee shop in an office building on a typical weekday. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
      timeLimit: 20 * 60,
    },
  ],
  task2: [
    {
      id: 1,
      title: "Task 2: Essay",
      description: "You should spend about 40 minutes on this task. Write at least 250 words.",
      prompt:
        "Some people believe that universities should focus on providing academic skills rather than preparing students for employment. To what extent do you agree or disagree?",
      timeLimit: 40 * 60, // 40 minutes in seconds
    },
    {
      id: 2,
      title: "Task 2: Essay",
      description: "You should spend about 40 minutes on this task. Write at least 250 words.",
      prompt:
        "In some countries, the number of people who are overweight is increasing. What do you think are the causes of this? What solutions can you suggest?",
      timeLimit: 40 * 60,
    },
    {
      id: 3,
      title: "Task 2: Essay",
      description: "You should spend about 40 minutes on this task. Write at least 250 words.",
      prompt:
        "Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both these views and give your own opinion.",
      timeLimit: 40 * 60,
    },
  ],
}

export async function getRandomQuestion(taskType: string): Promise<Question> {
  try {
    // Try to generate a unique question first
    return await generateQuestion(taskType)
  } catch (error) {
    console.error("Error generating question:", error)
    // Fall back to sample questions if generation fails
    const questions = taskType === "task1" ? sampleQuestions.task1 : sampleQuestions.task2
    const randomIndex = Math.floor(Math.random() * questions.length)
    return questions[randomIndex]
  }
}

export async function getAllQuestions(taskType: string) {
  return taskType === "task1" ? sampleQuestions.task1 : sampleQuestions.task2
}
