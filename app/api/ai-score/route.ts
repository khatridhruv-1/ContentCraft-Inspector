import axios from "axios";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const wordCount = content.trim().split(/\s+/).length;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert content analyst and writer specializing in evaluating and humanizing written content. Your task is to analyze the following content: ${content} for AI-generated and human-written characteristics and return a detailed report in JSON format, including a rewritten humanized version. The output must adhere to the following structure:

            {
              "aiScore": number, // Score (0-100, 100 being highly AI-generated) indicating the likelihood of AI-generated content, based on factors like repetitive phrasing, formulaic structures, and lack of personal voice.
              "humanScore": number, // Score (0-100, 100 being highly human-written) indicating the likelihood of human-written content, based on natural flow, personal insights, and varied language.
              "analysis": {
                "aiCharacteristics": string[], // Up to 5 specific AI-generated traits (e.g., "Overuse of adverbs like 'truly'," "Generic opening like 'In today’s world'").
                "humanCharacteristics": string[], // Up to 5 specific human-written traits (e.g., "Anecdotal references," "Varied sentence lengths").
                "tone": string, // Primary tone of the content (e.g., "formal," "conversational," "persuasive").
                "style": string, // Writing style (e.g., "narrative," "informative," "argumentative").
                "overallAssessment": string // Brief summary (2-3 sentences) of the content’s AI vs. human balance and quality.
              },
              "humanizedVersion": string // Rewritten version of the content that:
                - Maintains a word count within ±10% of the original content’s ${wordCount || "unspecified"} words.
                - Preserves the core message, key points, and intended tone.
                - Enhances readability and engagement with natural, human-like elements, including:
                  * Personal insights, anecdotes, or relatable examples (1-2 instances, contextually appropriate).
                  * Casual transitions (e.g., "Here’s the thing," "Let’s dive in") for smooth flow.
                  * Varied sentence structures and lengths to mimic human writing.
                  * Active voice and compelling word choices, avoiding clichés or filler words (e.g., "actually," "very").
                - Eliminates AI-generated patterns (e.g., repetitive phrases, overly formal language).
                - Improves formatting with short paragraphs (3-5 sentences), bullet points, or headings where appropriate.
            }

            **Analysis Guidelines:**
            - **aiScore**: Calculate based on:
              * Repetitive language or predictable patterns (e.g., starting with "In today’s fast-paced world").
              * Overuse of adverbs, filler words, or formulaic phrases (e.g., "crucial," "revolutionary").
              * Lack of personal voice, anecdotes, or emotional depth.
              * Uniform sentence structures or unnatural keyword stuffing.
            - **humanScore**: Calculate based on:
              * Presence of personal insights, anecdotes, or unique perspectives.
              * Varied sentence lengths (e.g., mixing short and long sentences) and structures.
              * Natural transitions and conversational elements.
              * Contextual humor, metaphors, or relatable examples.
            - **Analysis**:
              * **aiCharacteristics**: List specific examples from the content (e.g., quote a repetitive phrase or generic sentence).
              * **humanCharacteristics**: Highlight specific human-like elements (e.g., quote an anecdote or varied sentence).
              * **tone**: Identify the dominant tone, ensuring it aligns with the content’s purpose (e.g., conversational for blogs, formal for reports).
              * **style**: Describe the writing approach (e.g., descriptive, analytical) based on structure and intent.
              * **overallAssessment**: Summarize the balance of AI and human traits, noting strengths and weaknesses.
            - Ensure scores are complementary (e.g., aiScore + humanScore should generally sum to ~100, though slight deviations are acceptable if justified).

            **Humanized Version Guidelines:**
            - Rewrite the content to feel authentic and engaging, as if written by a skilled human writer.
            - Maintain the original tone and purpose but enhance with human elements (e.g., a brief personal story or relatable analogy).
            - Use conversational transitions to connect ideas (e.g., "Now, let’s talk about," "Here’s why this matters").
            - Vary sentence structures (e.g., combine declarative, interrogative, and compound sentences) and avoid repetitive phrasing.
            - Optimize readability with short paragraphs, bullet points, or subheadings for clarity.
            - Eliminate AI-generated patterns (e.g., generic openings, overused adverbs) and replace with natural language.
            - If the original content is too short or vague, expand slightly within the ±10% word count tolerance to add depth.
            - Ensure the word count is approximately ${wordCount || "the original content’s word count"}, calculated after rewriting.
            - Proofread the humanized version for grammatical accuracy, flow, and consistency.

            **Additional Instructions:**
            - Analyze objectively, considering the content’s context, audience, and purpose (e.g., blog, report, marketing copy).
            - If the content type is unclear, assume it’s a general-purpose article or blog post.
            - Avoid vague outputs (e.g., "The content is good") in the analysis or humanized version.
            - Ensure the humanized version feels distinct from the original while preserving its intent.
            - Prevent AI-like patterns in the analysis and rewritten content (e.g., repetitive phrasing, overly formal tone).
            - If ${wordCount} is not provided, aim for a word count within ±10% of the original content.
            - Deliver a professional, actionable report that helps users understand and improve their content.

            Your goal is to provide a precise, insightful analysis and a humanized rewrite that enhances engagement, readability, and authenticity while maintaining the original message and tone.`
          },
          {
            role: "user",
            content: `Analyze the provided content and return a detailed report in JSON format, including:
            - aiScore (0-100) indicating the likelihood of AI-generated content.
            - humanScore (0-100) indicating the likelihood of human-written content.
            - Analysis with specific AI and human characteristics, tone, style, and an overall assessment.
            - A humanized version of the content (~${wordCount || "same as original"} words, ±10% tolerance) that:
              * Preserves the core message, key points, and tone.
              * Uses natural, conversational language with personal insights, anecdotes, varied sentence structures, and casual transitions.
              * Enhances readability and engagement, eliminating AI-generated patterns.
            Ensure the analysis is specific, objective, and tailored to the content’s purpose and audience. Provide a humanized version that feels authentic and engaging, as if written by a skilled human writer. Content to analyze: ${content}`
          },
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const data = response.data.choices[0].message.content;
    const analysis = JSON.parse(data); // Parse the JSON string into a JS object

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in AI score analysis:', error);
    return NextResponse.json(
      { error: 'Error analyzing content' },
      { status: 500 }
    );
  }
}