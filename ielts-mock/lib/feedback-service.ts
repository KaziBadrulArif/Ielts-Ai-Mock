"use server"

import type { FeedbackResult } from "./types"

// This function simulates using a free API for text analysis
// In a real implementation, you would call an actual API
export async function analyzeText(
  text: string,
  taskType: string,
): Promise<{
  grammarScore: number
  grammarFeedback: string
  coherenceScore: number
  coherenceFeedback: string
  lexicalScore: number
  lexicalFeedback: string
  taskScore: number
  taskFeedback: string
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Count words
  const wordCount = text.trim().split(/\s+/).length
  const minWords = taskType === "task1" ? 150 : 250

  // Basic text analysis (in a real app, this would call an API)
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length
  const avgWordsPerSentence = wordCount / sentenceCount
  const uniqueWords = new Set(text.toLowerCase().match(/\b[a-z]+\b/g)).size
  const lexicalDiversity = uniqueWords / wordCount

  // Calculate scores based on our analysis
  const grammarScore = calculateGrammarScore(text, avgWordsPerSentence)
  const coherenceScore = calculateCoherenceScore(text, sentenceCount)
  const lexicalScore = calculateLexicalScore(text, lexicalDiversity, uniqueWords)
  const taskScore = calculateTaskScore(text, wordCount, minWords)

  return {
    grammarScore,
    grammarFeedback: generateGrammarFeedback(grammarScore),
    coherenceScore,
    coherenceFeedback: generateCoherenceFeedback(coherenceScore),
    lexicalScore,
    lexicalFeedback: generateLexicalFeedback(lexicalScore),
    taskScore,
    taskFeedback: generateTaskFeedback(taskScore, taskType, wordCount, minWords),
  }
}

// In a real implementation, these functions would use data from API calls
function calculateGrammarScore(text: string, avgWordsPerSentence: number): number {
  // Simple grammar scoring based on sentence length and basic patterns
  let score = 6.0 // Base score

  // Adjust based on sentence complexity
  if (avgWordsPerSentence > 20) score += 1.0
  else if (avgWordsPerSentence > 15) score += 0.5
  else if (avgWordsPerSentence < 8) score -= 0.5

  // Check for common grammar issues (very simplified)
  const grammarIssues = [
    /\bi am\b/gi, // Informal contraction
    /\byou are\b/gi, // Informal contraction
    /\bthey are\b/gi, // Informal contraction
    /\bis not\b/gi, // Informal contraction
    /\bare not\b/gi, // Informal contraction
    /\bvery\b/gi, // Overused intensifier
    /\breally\b/gi, // Overused intensifier
    /\ba lot\b/gi, // Informal phrase
    /\bin conclusion\b/gi, // Overused phrase
    /\bto sum up\b/gi, // Overused phrase
  ]

  let issueCount = 0
  grammarIssues.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) issueCount += matches.length
  })

  // Adjust score based on issues found
  score -= Math.min(2, issueCount * 0.1)

  // Ensure score is within bounds
  return Math.min(9, Math.max(4, score))
}

function calculateCoherenceScore(text: string, sentenceCount: number): number {
  // Simple coherence scoring based on paragraph structure and transitions
  let score = 6.0 // Base score

  // Check for paragraph breaks
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean)
  if (paragraphs.length >= 3) score += 0.5
  if (paragraphs.length >= 4) score += 0.5

  // Check for transition words
  const transitionWords = [
    /\bfirstly\b/i,
    /\bsecondly\b/i,
    /\bthirdly\b/i,
    /\bfurthermore\b/i,
    /\bmoreover\b/i,
    /\bin addition\b/i,
    /\bhowever\b/i,
    /\bnevertheless\b/i,
    /\bon the other hand\b/i,
    /\bconsequently\b/i,
    /\btherefore\b/i,
    /\bas a result\b/i,
    /\bin conclusion\b/i,
    /\bto summarize\b/i,
    /\bin summary\b/i,
  ]

  let transitionCount = 0
  transitionWords.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) transitionCount += matches.length
  })

  // Adjust score based on transition words
  if (transitionCount >= 5) score += 1.0
  else if (transitionCount >= 3) score += 0.5

  // Ensure score is within bounds
  return Math.min(9, Math.max(4, score))
}

function calculateLexicalScore(text: string, lexicalDiversity: number, uniqueWords: number): number {
  // Simple lexical scoring based on vocabulary diversity
  let score = 6.0 // Base score

  // Adjust based on lexical diversity
  if (lexicalDiversity > 0.7) score += 1.5
  else if (lexicalDiversity > 0.6) score += 1.0
  else if (lexicalDiversity > 0.5) score += 0.5
  else if (lexicalDiversity < 0.4) score -= 0.5

  // Adjust based on unique word count
  if (uniqueWords > 120) score += 1.0
  else if (uniqueWords > 100) score += 0.5
  else if (uniqueWords < 70) score -= 0.5

  // Check for advanced vocabulary (simplified)
  const advancedWords = [
    /\bconsequently\b/i,
    /\bnevertheless\b/i,
    /\bfurthermore\b/i,
    /\bsignificant\b/i,
    /\bsubstantial\b/i,
    /\bconsiderable\b/i,
    /\bbeneficial\b/i,
    /\bdetrimental\b/i,
    /\bcrucial\b/i,
    /\bimperative\b/i,
    /\bfundamental\b/i,
    /\bphenomenon\b/i,
  ]

  let advancedCount = 0
  advancedWords.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) advancedCount += matches.length
  })

  // Adjust score based on advanced vocabulary
  if (advancedCount >= 5) score += 1.0
  else if (advancedCount >= 3) score += 0.5

  // Ensure score is within bounds
  return Math.min(9, Math.max(4, score))
}

function calculateTaskScore(text: string, wordCount: number, minWords: number): number {
  // Simple task achievement scoring based on word count and content
  let score = 6.0 // Base score

  // Adjust based on word count
  if (wordCount >= minWords * 1.2) score += 0.5
  if (wordCount >= minWords * 1.5) score += 0.5
  if (wordCount < minWords) score -= 1.0
  if (wordCount < minWords * 0.8) score -= 1.0

  // Ensure score is within bounds
  return Math.min(9, Math.max(4, score))
}

// Generate feedback based on scores
function generateGrammarFeedback(score: number): string {
  const feedbackOptions = [
    {
      range: [8, 9],
      feedback: [
        "You use a wide range of structures with full flexibility and accuracy. Rare minor errors occur only as 'slips'.",
        "Your writing demonstrates a wide range of grammatical structures used accurately and appropriately with only very occasional errors.",
        "You produce error-free sentences with a wide variety of grammatical structures and punctuation is consistently accurate.",
      ],
    },
    {
      range: [7, 7.9],
      feedback: [
        "You use a variety of complex structures with good control of grammar and punctuation, though there may be a few errors.",
        "Your writing shows good use of grammar and punctuation but may have occasional errors or minor problems with complex structures.",
        "You produce frequent error-free sentences and use a variety of grammatical structures flexibly.",
      ],
    },
    {
      range: [6, 6.9],
      feedback: [
        "You use a mix of simple and complex sentence forms but with limited flexibility. Errors occur in complex structures but meaning is generally clear.",
        "Your writing has a reasonable range of structures with some errors that do not impede communication.",
        "You make some errors in grammar and punctuation but they rarely reduce communication.",
      ],
    },
    {
      range: [5, 5.9],
      feedback: [
        "You use only a limited range of structures with frequent grammatical errors that cause some difficulty for the reader.",
        "Your writing shows an overuse of simple sentences with some complex sentences containing errors.",
        "You make frequent grammatical errors and punctuation may be faulty; errors cause the reader problems with understanding.",
      ],
    },
    {
      range: [0, 4.9],
      feedback: [
        "Your writing contains numerous grammatical errors that severely impede communication.",
        "You use only a very limited range of structures with only rare use of subordinate clauses.",
        "Your errors in grammar and punctuation predominate and distort the meaning of the text.",
      ],
    },
  ]

  // Find the appropriate feedback range
  const feedbackRange = feedbackOptions.find((option) => score >= option.range[0] && score <= option.range[1])

  // Select a random feedback from the range
  const randomIndex = Math.floor(Math.random() * feedbackRange!.feedback.length)

  return feedbackRange!.feedback[randomIndex]
}

function generateCoherenceFeedback(score: number): string {
  const feedbackOptions = [
    {
      range: [8, 9],
      feedback: [
        "Your response is cohesive with skillful use of cohesive devices. Information and ideas are logically organized with clear progression throughout.",
        "You demonstrate excellent paragraph organization with a wide range of cohesive devices used accurately and appropriately.",
        "Your writing flows seamlessly with sophisticated use of cohesive devices and logical paragraph structure.",
      ],
    },
    {
      range: [7, 7.9],
      feedback: [
        "Your ideas are logically organized with effective use of cohesive devices, though there may be occasional lapses in cohesion.",
        "You use a range of cohesive devices appropriately with good paragraph organization, though there may be occasional overuse.",
        "Your response shows logical progression with a clear central topic in each paragraph, using cohesive devices effectively.",
      ],
    },
    {
      range: [6, 6.9],
      feedback: [
        "Your writing is generally coherent with some effective use of cohesive devices, though not always accurate or appropriate.",
        "You present information with some organization but there may be a lack of overall progression or some repetition.",
        "Your paragraphing is generally logical but may lack internal consistency in places.",
      ],
    },
    {
      range: [5, 5.9],
      feedback: [
        "Your response shows limited organization with inadequate, inaccurate or overuse of cohesive devices.",
        "Your ideas are not arranged coherently and there may be frequent problems with referencing and substitution.",
        "Your paragraphing may be inadequate or not well-developed, affecting the overall coherence.",
      ],
    },
    {
      range: [0, 4.9],
      feedback: [
        "Your writing lacks coherence and there is little use of cohesive devices.",
        "Your ideas are poorly organized with very limited use of cohesive devices.",
        "Your response lacks paragraphing or paragraphs are not logically arranged.",
      ],
    },
  ]

  // Find the appropriate feedback range
  const feedbackRange = feedbackOptions.find((option) => score >= option.range[0] && score <= option.range[1])

  // Select a random feedback from the range
  const randomIndex = Math.floor(Math.random() * feedbackRange!.feedback.length)

  return feedbackRange!.feedback[randomIndex]
}

function generateLexicalFeedback(score: number): string {
  const feedbackOptions = [
    {
      range: [8, 9],
      feedback: [
        "You use a wide range of vocabulary with very natural and sophisticated control of lexical features. Rare minor errors occur only as 'slips'.",
        "Your vocabulary is precise and sophisticated with very good awareness of style and collocation. Errors are rare and insignificant.",
        "You demonstrate an extensive vocabulary with precise word choice and awareness of less common meanings. Spelling and word formation are almost always accurate.",
      ],
    },
    {
      range: [7, 7.9],
      feedback: [
        "You use a sufficient range of vocabulary to allow some flexibility and precision. There are occasional errors in word choice but these rarely impede communication.",
        "Your vocabulary is appropriate for the task with good awareness of collocation, though there may be some inappropriate word choices.",
        "You use less common vocabulary with awareness of style and collocation, though there may be occasional inaccuracies in word choice and spelling.",
      ],
    },
    {
      range: [6, 6.9],
      feedback: [
        "You have an adequate range of vocabulary for the task, though there may be some inaccuracies in word choice and collocation.",
        "Your vocabulary is generally appropriate but lacks precision in places. Some errors in word formation and spelling occur.",
        "You attempt to use less common vocabulary but with some inaccuracy. Word formation and spelling errors do not impede communication.",
      ],
    },
    {
      range: [5, 5.9],
      feedback: [
        "You have a limited range of vocabulary, with a noticeable tendency to use a narrow range of words.",
        "Your vocabulary is restricted and repetitive, with frequent errors in word choice, spelling and word formation.",
        "You make noticeable errors in spelling and word formation that may cause some difficulty for the reader.",
      ],
    },
    {
      range: [0, 4.9],
      feedback: [
        "Your vocabulary is very limited with little variety and frequent errors that impede communication.",
        "You use only basic vocabulary with significant problems in word formation and spelling.",
        "Your limited vocabulary resources make it difficult to convey precise meaning.",
      ],
    },
  ]

  // Find the appropriate feedback range
  const feedbackRange = feedbackOptions.find((option) => score >= option.range[0] && score <= option.range[1])

  // Select a random feedback from the range
  const randomIndex = Math.floor(Math.random() * feedbackRange!.feedback.length)

  return feedbackRange!.feedback[randomIndex]
}

function generateTaskFeedback(score: number, taskType: string, wordCount: number, minWords: number): string {
  const feedbackOptions = [
    {
      range: [8, 9],
      feedback: [
        "You've fully addressed all parts of the task with well-developed ideas and appropriate examples.",
        "Your response demonstrates a thorough understanding of the task requirements with relevant, extended and supported ideas.",
        "You've presented a fully developed position with relevant, fully extended and well-supported ideas.",
      ],
    },
    {
      range: [7, 7.9],
      feedback: [
        "You've addressed all parts of the task, though some aspects could be more fully developed.",
        "Your response covers the requirements of the task with relevant ideas that are generally well-developed.",
        "You present a clear position throughout the response with relevant supporting ideas.",
      ],
    },
    {
      range: [6, 6.9],
      feedback: [
        "You've addressed the task, though some parts may be more fully covered than others.",
        "Your response generally addresses the requirements with relevant ideas, but development may be uneven.",
        "Your position is clear but supporting ideas may lack development in places.",
      ],
    },
    {
      range: [5, 5.9],
      feedback: [
        "You've addressed the task only partially, with limited development of ideas.",
        "Your response addresses some requirements of the task but may miss key aspects.",
        "Your position is not always clear and supporting ideas are limited.",
      ],
    },
    {
      range: [0, 4.9],
      feedback: [
        "You've only minimally addressed the task with inadequate development of ideas.",
        "Your response fails to address key requirements of the task.",
        "Your position is difficult to identify and supporting ideas are minimal.",
      ],
    },
  ]

  // Add word count feedback
  let wordCountFeedback = ""
  if (wordCount < minWords) {
    wordCountFeedback = ` Note that your response contains ${wordCount} words, which is below the minimum requirement of ${minWords} words. This affects your Task Achievement score.`
  } else if (wordCount >= minWords && wordCount < minWords * 1.2) {
    wordCountFeedback = ` Your response meets the minimum word count requirement of ${minWords} words.`
  } else {
    wordCountFeedback = ` Your response exceeds the minimum word count requirement, which allows for good development of your ideas.`
  }

  // Find the appropriate feedback range
  const feedbackRange = feedbackOptions.find((option) => score >= option.range[0] && score <= option.range[1])

  // Select a random feedback from the range
  const randomIndex = Math.floor(Math.random() * feedbackRange!.feedback.length)

  return feedbackRange!.feedback[randomIndex] + wordCountFeedback
}

// Main function to generate feedback
export async function generateEnhancedFeedback(taskType: string, response: string): Promise<FeedbackResult> {
  try {
    // Get text analysis from our simulated API
    const analysis = await analyzeText(response, taskType)

    // Calculate overall score
    const overallScore = Number.parseFloat(
      ((analysis.grammarScore + analysis.coherenceScore + analysis.lexicalScore + analysis.taskScore) / 4).toFixed(1),
    )

    // Generate overall feedback
    const overallFeedback = generateOverallFeedback(overallScore, taskType)

    // Generate improved version
    const improvedVersion = await generateImprovedVersion(response, taskType)

    return {
      taskAchievement: {
        score: analysis.taskScore,
        feedback: analysis.taskFeedback,
      },
      coherenceAndCohesion: {
        score: analysis.coherenceScore,
        feedback: analysis.coherenceFeedback,
      },
      lexicalResource: {
        score: analysis.lexicalScore,
        feedback: analysis.lexicalFeedback,
      },
      grammaticalRangeAndAccuracy: {
        score: analysis.grammarScore,
        feedback: analysis.grammarFeedback,
      },
      overallScore,
      overallFeedback,
      improvedVersion,
    }
  } catch (error) {
    console.error("Error generating enhanced feedback:", error)
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
      improvedVersion: response,
    }
  }
}

function generateOverallFeedback(score: number, taskType: string): string {
  const taskSpecific = taskType === "task1" ? "data interpretation and description" : "essay writing and argumentation"

  if (score >= 8) {
    return `Excellent work! Your writing demonstrates a very high level of proficiency in ${taskSpecific}. You've addressed all aspects of the task with well-developed ideas, logical organization, and a wide range of vocabulary and grammatical structures. To maintain this level, continue practicing with complex topics and refining your advanced language skills.`
  } else if (score >= 7) {
    return `Good job! Your writing shows a good command of English with effective ${taskSpecific}. You've addressed the task well with mostly well-developed ideas and good organization. Your vocabulary and grammar are generally strong with only occasional errors. To improve further, work on developing more sophisticated language use and ensuring all aspects of the task are fully developed.`
  } else if (score >= 6) {
    return `Your writing demonstrates a generally effective command of English for ${taskSpecific}, despite some errors and limitations. You've addressed the main requirements of the task, though some aspects could be more fully developed. To improve your score, focus on developing more complex sentence structures, expanding your vocabulary range, and organizing your ideas more coherently.`
  } else if (score >= 5) {
    return `Your writing shows a modest command of English for ${taskSpecific}. While you've attempted to address the task, your response is underdeveloped in places with limitations in organization, vocabulary, and grammar that affect clarity. To improve, practice developing your ideas more fully, using a wider range of vocabulary and grammatical structures, and organizing your writing more effectively.`
  } else {
    return `Your writing demonstrates a limited command of English for ${taskSpecific}. There are significant issues with task achievement, organization, vocabulary, and grammar that impede communication. To improve, focus on understanding task requirements better, developing basic paragraph structure, expanding your vocabulary, and practicing fundamental grammatical structures.`
  }
}

async function generateImprovedVersion(response: string, taskType: string): Promise<string> {
  // If no response was provided, return a sample response
  if (!response || response.trim() === "") {
    return taskType === "task1"
      ? "The graph illustrates the proportion of elderly population aged 65 and over across three different countries between 1940 and 2040. [No original response was provided to improve upon.]"
      : "The question of whether universities should prioritize academic skills or employment preparation is a matter of significant debate in educational circles. [No original response was provided to improve upon.]"
  }

  // Split the response into paragraphs
  const paragraphs = response.split(/\n+/)

  // Process each paragraph with substantial improvements
  const improvedParagraphs = paragraphs.map((paragraph, index) => {
    if (!paragraph.trim()) return ""

    // Make more substantial improvements to each paragraph
    let improved = paragraph

    // Apply more significant transformations based on paragraph position
    if (index === 0) {
      // Introduction improvements
      improved = improveIntroduction(improved, taskType)
    } else if (index === paragraphs.length - 1 && paragraphs.length > 1) {
      // Conclusion improvements
      improved = improveConclusion(improved, taskType)
    } else {
      // Body paragraph improvements
      improved = improveBodyParagraph(improved)
    }

    return improved
  })

  // Join the improved paragraphs
  let finalImproved = improvedParagraphs.filter((p) => p.trim()).join("\n\n")

  // If the response is very short or has too few paragraphs, restructure it completely
  if (finalImproved.length < 150 || paragraphs.filter((p) => p.trim()).length < 2) {
    finalImproved = restructureResponse(response, taskType)
  }

  return finalImproved
}

// Helper function to improve introductions
function improveIntroduction(text: string, taskType: string): string {
  // Replace common weak introductions with stronger ones
  let improved = text

  // Task 1 specific improvements
  if (taskType === "task1") {
    // Replace generic starts with more specific academic language
    improved = improved
      .replace(/^The (chart|graph|table|diagram) shows/i, "The $1 illustrates")
      .replace(/^The (chart|graph|table|diagram) gives information about/i, "The $1 provides a detailed breakdown of")
      .replace(/^The (chart|graph|table|diagram) is about/i, "The $1 presents data regarding")
      .replace(/^This (chart|graph|table|diagram)/i, "The provided $1")
      .replace(/^(In|On) this (chart|graph|table|diagram)/i, "The presented $2")

    // Add academic phrases if they're missing
    if (!improved.match(/compare|contrast|illustrate|demonstrate|depict|present|show|portray/i)) {
      improved = improved.replace(/\.$/, ", illustrating the key trends and patterns.")
    }
  }
  // Task 2 specific improvements
  else {
    // Replace informal opinion statements with academic ones
    improved = improved
      .replace(/^I (think|believe|feel) that/i, "It is widely acknowledged that")
      .replace(/^In my opinion,?/i, "From my perspective,")
      .replace(/^Nowadays,?/i, "In contemporary society,")
      .replace(/^These days,?/i, "In the modern era,")

    // Add context if it seems to be missing
    if (!improved.match(/debate|discuss|controversy|perspective|viewpoint|opinion|argument/i)) {
      improved += " This issue warrants careful consideration of multiple perspectives."
    }
  }

  // General improvements for both tasks
  improved = improved
    // Enhance vocabulary
    .replace(/very important/gi, "crucial")
    .replace(/big problem/gi, "significant challenge")
    .replace(/a lot of/gi, "a substantial number of")
    .replace(/many people/gi, "a considerable proportion of individuals")
    .replace(/good thing/gi, "beneficial aspect")
    .replace(/bad thing/gi, "detrimental factor")

    // Fix grammar issues
    .replace(/they is/g, "they are")
    .replace(/there is many/g, "there are many")
    .replace(/have went/g, "have gone")
    .replace(/didn't/g, "did not")
    .replace(/don't/g, "do not")
    .replace(/can't/g, "cannot")
    .replace(/won't/g, "will not")

  return improved
}

// Helper function to improve body paragraphs
function improveBodyParagraph(text: string): string {
  let improved = text

  // Add transition phrases at the beginning if they're missing
  if (
    !text.match(/^(Furthermore|Moreover|In addition|Additionally|Secondly|Another|Next|Subsequently|Following this)/i)
  ) {
    // Randomly select a transition phrase
    const transitions = [
      "Furthermore, ",
      "Moreover, ",
      "In addition, ",
      "Additionally, ",
      "What is more, ",
      "Another significant point is that ",
    ]
    const randomTransition = transitions[Math.floor(Math.random() * transitions.length)]

    // Only add if it doesn't create awkward phrasing
    if (!text.match(/^(The|This|These|Those|It|They)/i)) {
      improved = randomTransition + improved.charAt(0).toLowerCase() + improved.slice(1)
    }
  }

  // Enhance vocabulary with more academic alternatives
  const vocabularyReplacements = [
    { from: /\bgood\b/gi, to: "beneficial" },
    { from: /\bbad\b/gi, to: "detrimental" },
    { from: /\bbig\b/gi, to: "substantial" },
    { from: /\blot\b/gi, to: "significant amount" },
    { from: /\bsmall\b/gi, to: "minimal" },
    { from: /\bproblem\b/gi, to: "challenge" },
    { from: /\bhelp\b/gi, to: "facilitate" },
    { from: /\bhard\b/gi, to: "challenging" },
    { from: /\beasy\b/gi, to: "straightforward" },
    { from: /\bimportant\b/gi, to: "crucial" },
    { from: /\bshow\b/gi, to: "demonstrate" },
    { from: /\btell\b/gi, to: "indicate" },
    { from: /\buse\b/gi, to: "utilize" },
    { from: /\bmake\b/gi, to: "produce" },
    { from: /\bget\b/gi, to: "obtain" },
    { from: /\bstart\b/gi, to: "commence" },
    { from: /\bend\b/gi, to: "conclude" },
    { from: /\bpeople\b/gi, to: "individuals" },
    { from: /\bthink\b/gi, to: "consider" },
    { from: /\bsee\b/gi, to: "observe" },
  ]

  // Apply vocabulary replacements (limit to 3-4 per paragraph to avoid overuse)
  let replacementCount = 0
  for (const replacement of vocabularyReplacements) {
    if (replacementCount >= 4) break

    if (improved.match(replacement.from)) {
      improved = improved.replace(replacement.from, replacement.to)
      replacementCount++
    }
  }

  // Improve sentence structure by combining short sentences
  const shortSentences = improved.match(/[^.!?]+[.!?]+\s+[^.!?]+[.!?]+/g)
  if (shortSentences && shortSentences.length > 0) {
    for (const sentencePair of shortSentences) {
      const sentences = sentencePair.match(/[^.!?]+[.!?]+/g)
      if (sentences && sentences.length >= 2) {
        const firstSentence = sentences[0].trim()
        const secondSentence = sentences[1].trim()

        // Only combine if they're both short
        if (firstSentence.split(" ").length < 10 && secondSentence.split(" ").length < 10) {
          const combined = `${firstSentence.slice(0, -1)}, which ${secondSentence.charAt(0).toLowerCase() + secondSentence.slice(1)}`
          improved = improved.replace(sentencePair, combined)
        }
      }
    }
  }

  return improved
}

// Helper function to improve conclusions
function improveConclusion(text: string, taskType: string): string {
  let improved = text

  // Replace weak conclusion starters with stronger ones
  if (improved.match(/^(In conclusion|To conclude|To sum up|In summary|Finally|Lastly)/i)) {
    const conclusionStarters = [
      "In conclusion, ",
      "To conclude, ",
      "In light of the above discussion, ",
      "Having considered the various aspects, ",
      "Based on the evidence presented, ",
      "Taking all factors into account, ",
    ]
    const randomStarter = conclusionStarters[Math.floor(Math.random() * conclusionStarters.length)]
    improved = improved.replace(/^(In conclusion|To conclude|To sum up|In summary|Finally|Lastly),?\s+/i, randomStarter)
  } else {
    // Add a conclusion starter if missing
    improved = "In conclusion, " + improved.charAt(0).toLowerCase() + improved.slice(1)
  }

  // Task-specific conclusion enhancements
  if (taskType === "task1") {
    // Add summary statement if missing
    if (!improved.match(/overall|summary|summarize|trend|pattern|significant|noteworthy/i)) {
      improved +=
        " Overall, the data reveals significant patterns that highlight important trends in the subject matter."
    }
  } else {
    // Add a balanced perspective for Task 2 if missing
    if (!improved.match(/balance|weigh|consider|although|however|nevertheless|despite|future|recommend/i)) {
      improved +=
        " While there are valid arguments on both sides, a balanced approach that considers multiple perspectives would be most effective in addressing this issue."
    }
  }

  return improved
}

// Helper function to completely restructure a response
function restructureResponse(text: string, taskType: string): string {
  // Extract key content words from the original text
  const contentWords = text.match(/\b[a-zA-Z]{4,}\b/g) || []
  const uniqueWords = [...new Set(contentWords.map((word) => word.toLowerCase()))]

  // Create a completely new response based on task type
  if (taskType === "task1") {
    return `The graph illustrates ${uniqueWords.slice(0, 3).join(", ")} over a specific time period. The data reveals several significant trends and patterns.

First and foremost, there is a notable trend in ${uniqueWords.slice(3, 6).join(", ")}. This demonstrates important changes that occurred during the period shown.

Furthermore, when comparing different categories, it is evident that ${uniqueWords.slice(6, 9).join(", ")} exhibited the most significant variations. This highlights the dynamic nature of the subject being analyzed.

In conclusion, the data presents a comprehensive overview of ${uniqueWords.slice(0, 3).join(", ")}. The most noteworthy finding is the relationship between ${uniqueWords.slice(9, 12).join(", ")}, which provides valuable insights into the overall patterns.`
  } else {
    return `In contemporary society, the issue of ${uniqueWords.slice(0, 3).join(", ")} has become increasingly significant. This essay will examine multiple perspectives on this matter.

From one perspective, ${uniqueWords.slice(3, 6).join(", ")} play a crucial role in shaping how we approach this issue. Proponents of this view argue that these factors contribute substantially to addressing the challenges at hand.

Conversely, others maintain that ${uniqueWords.slice(6, 9).join(", ")} should be the primary focus. This alternative approach emphasizes different priorities and methodologies for tackling the same problems.

In my view, while both perspectives offer valuable insights, a balanced approach that incorporates elements from both sides would be most effective. This would involve careful consideration of ${uniqueWords.slice(9, 12).join(", ")} to develop comprehensive solutions.

In conclusion, the complex nature of ${uniqueWords.slice(0, 3).join(", ")} necessitates a multifaceted approach. By integrating diverse perspectives and acknowledging various factors, we can develop more effective strategies for addressing this important issue.`
  }
}
