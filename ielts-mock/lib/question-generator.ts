"use server"

import type { Question } from "./types"

// Templates for Task 1 questions
const task1Templates = [
  "The {chart} below shows {dataDescription} between {timeStart} and {timeEnd} in {location}. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
  "The {chart} illustrates {dataDescription} in {location} during the period {timeStart}-{timeEnd}. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
  "The {chart} gives information about {dataDescription} from {timeStart} to {timeEnd}. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
  "The {chart} compares {dataDescription} in {location} over the period from {timeStart} to {timeEnd}. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
  "The {chart} provides information on {dataDescription} between {timeStart} and {timeEnd}. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
]

// Templates for Task 2 questions
const task2Templates = [
  "Some people believe that {topic1}. Others feel that {topic2}. Discuss both these views and give your own opinion.",
  "{statement}. To what extent do you agree or disagree with this statement?",
  "Some people think that {topic1}, while others believe {topic2}. Discuss both sides and give your opinion.",
  "{question}? Discuss the advantages and disadvantages of this development.",
  "In many countries, {observation}. What are the causes of this problem? What solutions can you suggest?",
  "{statement}. What are the causes of this trend and what measures could be taken to address it?",
]

// Variables for Task 1
const chartTypes = [
  "graph",
  "bar chart",
  "line graph",
  "pie chart",
  "table",
  "diagram",
  "map",
  "flowchart",
  "process diagram",
]

const dataDescriptions = [
  "the percentage of people using different types of transportation",
  "the proportion of the population aged 65 and over",
  "changes in average house prices",
  "the amount of money spent on research and development",
  "the number of tourists visiting different countries",
  "the consumption of renewable energy",
  "the literacy rates for men and women",
  "the sales figures for different types of electronic devices",
  "the average working hours per week",
  "the percentage of household income spent on different categories",
  "the number of students enrolled in different university courses",
  "the production and consumption of coffee",
  "the water usage in different sectors",
  "the changes in land use",
  "the rates of recycling for different materials",
]

const timeStartOptions = ["1980", "1990", "2000", "2005", "2010", "January", "February", "March", "April", "May"]

const timeEndOptions = ["2010", "2015", "2020", "2022", "present", "June", "July", "August", "September", "December"]

const locations = [
  "several countries",
  "four different countries",
  "five major cities",
  "different regions",
  "selected developed countries",
  "developing nations",
  "urban and rural areas",
  "various age groups",
  "different income brackets",
  "six European countries",
  "Australia",
  "the United States",
  "the United Kingdom",
  "Canada",
  "Japan",
  "global markets",
]

// Variables for Task 2
const task2Topics = [
  {
    topic1: "universities should focus on academic skills",
    topic2: "universities should prepare students for employment",
  },
  {
    topic1: "governments should spend money on public services",
    topic2: "governments should reduce taxes",
  },
  {
    topic1: "children should learn practical skills in school",
    topic2: "children should focus on academic subjects",
  },
  {
    topic1: "technology has improved communication between people",
    topic2: "technology has made people more isolated",
  },
  {
    topic1: "international tourism benefits local communities",
    topic2: "international tourism damages local cultures and environments",
  },
]

const task2Statements = [
  "The most effective way to reduce crime is to give longer prison sentences",
  "The best way to improve public health is to increase tax on unhealthy foods",
  "In the future, all cars, buses and trucks will be driverless vehicles",
  "The internet has transformed the way we work and communicate",
  "Traditional skills and ways of life are being lost because people no longer practice them",
  "The government should control the amount of violence shown in films and on television",
  "In the modern world, it is not necessary to have many different languages",
  "The most important aspect of a job is the money a person earns",
  "People should be encouraged to use public transportation instead of personal vehicles",
  "The main environmental problem facing the world today is the loss of particular species of plants and animals",
]

const task2Questions = [
  "Should governments spend money on art when they have other important issues to address",
  "Should developing countries focus on environmental protection or economic development",
  "Should children be taught at home by their parents rather than at school by teachers",
  "Should companies be required to hire equal numbers of men and women",
  "Should people be allowed to work from home instead of commuting to an office every day",
]

const task2Observations = [
  "people are living in large cities rather than in the countryside",
  "the number of people who are overweight is increasing",
  "traditional shops are being replaced by online shopping",
  "young people are less interested in learning about history and culture",
  "fewer people are reading books and newspapers",
  "more people are choosing not to get married",
  "children are spending less time outdoors",
  "people are working longer hours than in the past",
  "the gap between rich and poor is widening",
  "many traditional skills and crafts are disappearing",
]

// Helper function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Function to generate a unique Task 1 question
export function generateTask1Question(): Question {
  const template = getRandomItem(task1Templates)
  const chart = getRandomItem(chartTypes)
  const dataDescription = getRandomItem(dataDescriptions)
  const timeStart = getRandomItem(timeStartOptions)
  const timeEnd = getRandomItem(timeEndOptions)
  const location = getRandomItem(locations)

  const prompt = template
    .replace("{chart}", chart)
    .replace("{dataDescription}", dataDescription)
    .replace("{timeStart}", timeStart)
    .replace("{timeEnd}", timeEnd)
    .replace("{location}", location)

  return {
    id: Date.now(),
    title: "Task 1: Academic Writing",
    description: "You should spend about 20 minutes on this task. Write at least 150 words.",
    prompt,
    timeLimit: 20 * 60, // 20 minutes in seconds
  }
}

// Function to generate a unique Task 2 question
export function generateTask2Question(): Question {
  const templateIndex = Math.floor(Math.random() * task2Templates.length)
  const template = task2Templates[templateIndex]

  let prompt = ""

  // Different logic based on template type
  switch (templateIndex) {
    case 0: // "Some people believe that {topic1}. Others feel that {topic2}."
    case 2: // "Some people think that {topic1}, while others believe {topic2}."
      const topicPair = getRandomItem(task2Topics)
      prompt = template.replace("{topic1}", topicPair.topic1).replace("{topic2}", topicPair.topic2)
      break
    case 1: // "{statement}. To what extent do you agree or disagree with this statement?"
    case 5: // "{statement}. What are the causes of this trend and what measures could be taken to address it?"
      prompt = template.replace("{statement}", getRandomItem(task2Statements))
      break
    case 3: // "{question}? Discuss the advantages and disadvantages of this development."
      prompt = template.replace("{question}", getRandomItem(task2Questions))
      break
    case 4: // "In many countries, {observation}. What are the causes of this problem? What solutions can you suggest?"
      prompt = template.replace("{observation}", getRandomItem(task2Observations))
      break
    default:
      prompt =
        "Some people believe that universities should focus on academic skills rather than preparing students for employment. To what extent do you agree or disagree?"
  }

  return {
    id: Date.now(),
    title: "Task 2: Essay",
    description: "You should spend about 40 minutes on this task. Write at least 250 words.",
    prompt,
    timeLimit: 40 * 60, // 40 minutes in seconds
  }
}

// Main function to generate a question based on task type
export async function generateQuestion(taskType: string): Promise<Question> {
  if (taskType === "task1") {
    return generateTask1Question()
  } else {
    return generateTask2Question()
  }
}
