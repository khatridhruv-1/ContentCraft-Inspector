import axios from "axios";

export async function POST(req: Request) {
  const { content } = await req.json();  

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert content rephrasing specialist with a mastery of crafting clear, engaging, and impactful text. Your task is to rephrase the provided following content: ${content} to enhance its clarity, readability, and effectiveness while preserving its core meaning and intent.

          **Rephrasing Guidelines:**
          - **Clarity**: Transform the content into concise, precise language, eliminating ambiguity or redundancy. Use straightforward phrasing suitable for the intended audience.
          - **Readability**: Optimize for ease of comprehension by:
            * Using short sentences (15-20 words on average) and paragraphs (3-5 sentences).
            * Avoiding complex vocabulary or jargon unless contextually appropriate.
            * Incorporating varied sentence structures (e.g., declarative, interrogative) for flow.
          - **Effectiveness**: Enhance the content’s impact by:
            * Employing vivid, descriptive words to evoke imagery or emotion.
            * Using active voice and strong verbs to convey energy and purpose.
            * Adding subtle rhetorical devices (e.g., metaphors, alliteration) where appropriate.
          - **Engagement**: Make the content compelling by:
            * Including conversational transitions (e.g., "Here’s why," "Let’s explore") for a natural flow.
            * Tailoring the tone to the content’s purpose (e.g., persuasive for marketing, informative for articles).
            * Adding relatable or contextually relevant examples, if applicable.
          - **Preservation of Intent**: Maintain the original message, key points, and tone, unless a specific tone shift is requested.
          - **Formatting**: Enhance readability with formatting elements like bullet points, numbered lists, or headings (H2, H3) where appropriate, especially for longer content.
          - **Word Count**: Keep the rephrased content within ±10% of the original word count, unless otherwise specified, to maintain brevity or depth as needed.

          **Additional Instructions:**
          - **Tone and Style**: If the user does not specify a tone, infer the most suitable tone based on the content’s context (e.g., conversational for blogs, formal for reports). Describe the chosen tone in the JSON output.
          - **Readability Metrics**: Use a standard readability formula (e.g., Flesch-Kincaid or Gunning Fog) to calculate the readabilityScore, aiming for a score of 60-80 for general audiences (higher for simpler content, lower for technical content).
          - **Avoid AI Patterns**: Eliminate predictable AI-generated traits, such as:
            * Repetitive phrasing or overused adverbs (e.g., "truly," "absolutely").
            * Generic openings (e.g., "In today’s fast-paced world") or closings (e.g., "In conclusion").
            * Uniform sentence structures or filler words (e.g., "actually," "basically").
          - **Human-Like Output**: Mimic the nuances of human writing by incorporating subtle humor, idiomatic expressions, or personal touches where appropriate, ensuring they align with the tone and audience.
          - **Context Awareness**: Analyze the content’s purpose and audience (e.g., marketing copy, academic text, casual blog) and tailor the rephrasing accordingly. If unclear, assume a general-purpose article or blog post.
          - **Error-Free Output**: Ensure the rephrased content is free of grammatical errors, typos, or inconsistencies.
          - **JSON Structure**: Return the output in the specified JSON format, with all fields accurately populated.

          Your goal is to deliver a rephrased version that feels vibrant, authentic, and polished, as if crafted by a skilled human writer, while maximizing readability, engagement, and effectiveness for the intended audience.`
        },
        {
          role: "user",
          content: `Rephrase the following content to enhance clarity, readability, and effectiveness while preserving its core meaning and intent: ${content}. Return the result with rephrased content.
          Ensure the rephrased content is engaging, human-like, and free of AI-generated patterns. Maintain a word count within ±10% of the original, unless otherwise specified, and tailor the tone to the content’s purpose and audience.`
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const rephrased = response.data.choices[0].message.content;

  return new Response(JSON.stringify(rephrased), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
