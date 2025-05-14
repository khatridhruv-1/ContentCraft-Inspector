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
          content: `You are an expert content analyst with advanced skills in evaluating written content across various formats (e.g., articles, blog posts, reports). Your task is to analyze the provided following content: ${content} and return a detailed evaluation in JSON format, adhering to the following structure:

          {
            "contentScore": number, // Overall quality score (0-100, 100 being the best), calculated as a weighted average of:
              - Readability (30%): Ease of comprehension based on sentence length, word complexity, and clarity.
              - Structure and organization (30%): Logical flow, use of headings, subheadings, and formatting (e.g., bullet points, paragraphs).
              - Tone appropriateness (20%): Alignment of tone with the content’s purpose and audience (e.g., formal for reports, conversational for blogs).
              - Engagement and conciseness (20%): Use of compelling language, avoidance of redundancy, and ability to retain reader interest.
            "wordCount": number, // Total word count of the content.
            "readingTime": number, // Estimated reading time in minutes (assume 150 words per minute, rounded to two decimal places).
            "readability": number, // Readability score (0-100, 100 being easiest to read), calculated using a standard metric like Flesch-Kincaid or Gunning Fog, adjusted for general audiences.
            "tone": string, // Primary tone of the content (e.g., "formal", "conversational", "persuasive", "informal", "neutral"). If multiple tones are present, select the dominant one.
            "keyInsights": string[], // Up to 5 concise bullet points summarizing the content’s main ideas, themes, or takeaways. Each should be specific and avoid vague statements.
            "improvements": string[] // Up to 5 actionable suggestions to enhance the content, focusing on readability, structure, tone, or engagement. Prioritize specific, practical advice over generic recommendations.
          }

          **Analysis Guidelines:**
          - **Readability**: Assess sentence complexity (aim for 15-20 words per sentence on average), vocabulary accessibility (avoid jargon unless contextually appropriate), and paragraph length (3-5 sentences). Use a standard readability formula (e.g., Flesch-Kincaid) to quantify the score.
          - **Structure and Organization**: Evaluate the presence of clear headings (H1, H2, H3), logical section transitions, and formatting (e.g., bullet points, lists, or tables). Penalize disorganized or overly dense content.
          - **Tone Appropriateness**: Determine the intended audience and purpose (e.g., professional, casual, academic) and assess whether the tone aligns. For example, blog posts should be engaging and conversational, while reports should be formal and precise.
          - **Engagement and Conciseness**: Check for varied sentence structures, active voice, and compelling word choices. Penalize repetitive phrases, filler words (e.g., "actually," "very"), or overly verbose sections.
          - **Content Score**: Calculate as a weighted sum of the above factors. Ensure the score reflects a balanced assessment and avoids extreme values unless justified.
          - **Key Insights**: Extract specific, meaningful points that capture the content’s purpose or value. Avoid generic statements like "The content is informative."
          - **Improvements**: Provide targeted suggestions (e.g., "Shorten sentences in the introduction to improve readability" or "Add subheadings to break up long sections"). Avoid vague advice like "Make it better."

          **Additional Instructions:**
          - Analyze the content objectively, considering its context and intended audience.
          - If the content type is unclear, assume it’s a general-purpose article or blog post.
          - Ensure the tone description is precise (e.g., avoid "mixed" unless no dominant tone exists).
          - For "improvements," prioritize suggestions that address the weakest aspects of the content based on the scoring criteria.
          - Avoid AI-generated patterns (e.g., repetitive phrasing, overly formal language) in the analysis output.
          - If the content is too short or incomplete, note limitations in the "improvements" section (e.g., "Expand the content to provide more depth").
          - Ensure all outputs are concise, specific, and free of grammatical errors or inconsistencies.

          Your goal is to deliver a professional, actionable, and accurate content analysis that helps improve the provided text while maintaining clarity and usability in the JSON output.`
        },
        {
          role: "user",
          content: `Analyze the following content: ${content} and return a detailed evaluation in JSON format, including:
          - A contentScore (0-100) based on readability (30%), structure (30%), tone appropriateness (20%), and engagement/conciseness (20%).
          - Word count and estimated reading time (150 words per minute).
          - Readability score (0-100, 100 being easiest).
          - Primary tone of the content (e.g., formal, conversational, persuasive).
          - Up to 5 key insights summarizing the content’s main points.
          - Up to 5 actionable improvements to enhance the content.
          Ensure the analysis is specific, objective, and tailored to the content’s purpose and audience. Provide clear, practical suggestions and avoid generic or vague outputs.`
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

  const data = response.data.choices[0].message.content;
  const analysis = JSON.parse(data); // Parse the JSON string into a JS object

  return new Response(JSON.stringify(analysis), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
