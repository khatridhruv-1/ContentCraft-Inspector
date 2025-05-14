import axios from "axios";
import { NextResponse } from "next/server";

// Function to call OpenAI API
const callGPT = async (messages: any) => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};

// Main API Route
export async function POST(req: Request) {
  try {
    const { title, keywords, tone } = await req.json();

    // **Step 1: Ask GPT to determine an expert for the given topic**
    // const expertResponse = await callGPT([
    //   {
    //     role: "system",
    //     content:
    //       "You are an expert finder. Your task is to identify a credible expert, researcher, or authority on a specific topic. Provide the expert's name and a brief description of their expertise in the format: name: 'Name', description: 'Description'.",
    //   },
    //   {
    //     role: "user",
    //     content: `Who is a leading expert in the field of "${title}"? Please provide their name and a brief description of their research focus and accomplishments.`,
    //   },
    // ]);

    // **Step 2: Use the identified expert in the next GPT call to generate content**
    let keywordPrompt = "";
    if (keywords && keywords.trim().length > 0) {
      keywordPrompt = `Ensure that the article focuses on the following key terms and concepts: ${keywords}. Use these keywords naturally throughout the text.`;
    }

    let tonePrompt = "";
    if (tone && tone.trim().length > 0) {
      tonePrompt = `Write the content in a ${tone} tone to match the expected audience style.`;
    }

    const contentResponse = await callGPT([
      {
        role: "system",
        content: `You are an expert content writer with a deep understanding of creating engaging, informative, and human-like articles for diverse audiences. Your task is to generate a well-structured article on the topic "${title}". Follow these guidelines to ensure the content is high-quality, natural, and optimized for readability and engagement:

        **Content Requirements:**
        - Write a detailed article exceeding 1000 words, with a clear introduction, main sections, and a conclusion.
        - Use descriptive headings (H1, H2, H3) and subheadings to organize content logically.
        - Incorporate bullet points, numbered lists, or tables where appropriate to enhance readability.
        - Break content into short paragraphs (3-5 sentences) to maintain reader attention.
        - Include actionable insights, practical tips, or real-world examples to add value.
        - Use transitions (e.g., "Let's explore," "Next," "Here's why") to ensure a smooth flow between sections.

        **Tone and Style:**
        - Adopt a ${tonePrompt || "conversational yet professional"} tone that resonates with the target audience.
        - Write in active voice, avoiding passive constructions unless contextually necessary.
        - Vary sentence lengths and structures to mimic human writing and maintain engagement.
        - Avoid repetitive phrases, clichés, or overly technical jargon unless specified.
        - Ensure the content feels authentic, as if written by an experienced human writer, by including subtle humor, anecdotes, or relatable metaphors where appropriate.

        **SEO and Keyword Optimization:**
        - Naturally incorporate the primary keyword "${title}" and related secondary keywords throughout the article, maintaining a keyword density of 1-2%.
        - Use keywords in the introduction, at least one H2 heading, and the conclusion, ensuring they feel organic.
        - Optimize for reader intent by addressing common questions or pain points related to the topic.
        - Include internal linking opportunities (e.g., suggest linking to related topics or resources) without creating actual links.

        **Avoiding AI-Generated Characteristics:**
        - Do not use predictable AI patterns, such as starting with "In today's fast-paced world" or ending with "In conclusion, the importance of...".
        - Avoid overusing adverbs (e.g., "truly," "absolutely") or filler words (e.g., "actually," "basically").
        - Ensure content is specific, avoiding vague or generic statements (e.g., "Technology is important").
        - Randomize word choices and phrasing to prevent repetitive language patterns.

        **Structure Guidelines:**
        - **Introduction (150-200 words):** Hook the reader with a compelling question, statistic, or anecdote. Clearly state the article's purpose and what readers will gain. Include the primary keyword naturally.
        - **Main Sections (700-800 words):** Divide the content into 3-5 logical sections with H2 headings. Each section should explore a unique aspect of the topic, supported by facts, examples, or data. Use H3 subheadings for deeper insights and bullet points or lists for clarity.
        - **Conclusion (100-150 words):** Summarize key takeaways, reinforce the article's value, and include a call-to-action (e.g., "Try these tips," "Share your thoughts"). Restate the primary keyword naturally.
        - **Optional Elements:** Add a FAQ section (3-5 questions) at the end to address common reader queries, or include a sidebar with quick tips or statistics if relevant.

        **Additional Notes:**
        - If the topic requires research, cite credible sources (e.g., studies, experts) without quoting verbatim unless necessary.
        - Tailor the content to the target audience's knowledge level (e.g., beginners, professionals) based on the topic's context.
        - If ${keywordPrompt} or ${tonePrompt} is not provided, infer appropriate keywords and tone from the title and context.
        - Ensure the article is free of grammatical errors, typos, or inconsistencies.

        Your goal is to create an article that informs, engages, and feels like it was crafted by a skilled human writer, optimized for both readers and search engines.`
      },
      {
        role: "user",
        content: `Generate a detailed, informative article based on the title "${title}". The article should exceed 1000 words and include a compelling introduction, well-organized main sections with headings and subheadings, and a strong conclusion. Use bullet points, lists, or tables to improve readability. Ensure the content is engaging, human-like, and optimized for SEO with the primary keyword "${title}". Avoid AI-generated patterns and make the tone ${tonePrompt || "conversational yet professional"}. Include practical tips, examples, or anecdotes to add value, and consider adding a FAQ section or quick tips if relevant.`
      },
    ]);


    return NextResponse.json({ content: contentResponse });
  } catch (error) {
    console.error("Error in AI content generation:", error);
    return NextResponse.json(
      { error: "Error generating content" },
      { status: 500 }
    );
  }
}
