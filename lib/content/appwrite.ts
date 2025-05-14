import { ID } from "appwrite";
import { Query } from "appwrite";
import { Databases } from 'appwrite';
import { Client } from 'appwrite';
import { log } from "node:console";

const client = new Client()
    .setEndpoint('https://appwrite.appunik-team.com/v1')
    .setProject('679a3be3000b571ae49b'); 

const databases = new Databases(client);

export async function saveContent(
  content: string,
  userId: string,
  analysis?: string,
  mode?: string,
  contentScore?: number,
  readability?: number,
  tone?: string,
  keyInsights?: string[],
  improvements?: string[],
  wordCount?: number,
  readingTime?: number,
  aiScore?: number,
  humanScore?: number,
  humanizedVersion?: string,
  outline?: { level: number; text: string }[], 
  suggestions?: string[],
  contentGaps?: string[],
  summary?: string,
  relatedLinks?: { title: string; url: string; description: string }[],
  companyId?: string
) {
  try {
    const response = await databases.createDocument(
      '679d05d40027f6fec541',   // Database ID
      '679d05dd0028c7b34c31',   // Collection ID
      ID.unique(),
      {
        userId,
        content,
        analysis,
        mode,
        contentScore: contentScore ?? null,
        readability: readability ?? null,
        tone: tone ?? null,
        keyInsights: keyInsights ?? [],
        improvements: improvements ?? [],
        wordCount: wordCount ?? null,
        readingTime: readingTime ?? null,
        aiScore: aiScore ?? null,
        humanScore: humanScore ?? null,
        humanizedVersion: humanizedVersion ?? null,
        outline: outline ? JSON.stringify(outline) : null,
        suggestions: suggestions ?? [],
        contentGaps: contentGaps ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyId: companyId,
      }
    );
    
    return response;
  } catch (error) {
    console.error("Error saving content:", error);
    throw error;
  }
}

export async function deleteHistoryItem(documentId: string) {
  try {
    await databases.deleteDocument(
      '679d05d40027f6fec541',   // Database ID
      '679d05dd0028c7b34c31',   // Collection ID
      documentId
    );
    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}

export async function updateContent(
  documentId: string,
  {
    input,
    analysis,
    contentScore,
    readability,
    tone,
    keyInsights,
    improvements,
    wordCount,
    readingTime,
    aiScore,
    humanScore,
    humanizedVersion,
    outline,
    suggestions,
    contentGaps,
    summary,
    relatedLinks,
    companyId,
  }: {
    input?: string;
    analysis?: string;
    contentScore?: number;
    readability?: string;
    tone?: string;
    keyInsights?: string[];
    improvements?: string[];
    wordCount?: number;
    readingTime?: number;
    aiScore?: number;
    humanScore?: number;
    humanizedVersion?: string;
    outline?: { level: number; text: string }[];
    suggestions?: string[];
    contentGaps?: string[];
    summary?: string;
    relatedLinks?: {
      url: string;
      title: string;
      content: string;
      score: number;
      raw_content: string | null;
    }[];
    companyId?: any;
  }
) {
  try {
    const response = await databases.updateDocument(
      '679d05d40027f6fec541',   // Database ID
      '679d05dd0028c7b34c31',   // Collection ID
      documentId,
      {
        ...(input && { content: input }),
        ...(analysis && { analysis }),
        ...(contentScore !== undefined && {
          contentScore: Math.round(contentScore),
        }),
        ...(readability && { readability }),
        ...(tone && { tone }),
        ...(keyInsights && { keyInsights }),
        ...(improvements && { improvements }),
        ...(wordCount !== undefined && { wordCount }),
        ...(readingTime !== undefined && { readingTime }),
        ...(aiScore !== undefined && { aiScore }),
        ...(humanScore !== undefined && { humanScore }),
        ...(humanizedVersion && { humanizedVersion }),
        ...(outline && {
          outline: outline.map(
            (item) => `Level ${item.level}: ${item.text}`
          ),
        }),
        ...(suggestions && { suggestions }),
        ...(contentGaps && { contentGaps }),
        ...(summary && { summary }),
        ...(companyId && { companyId }),
        relatedLinks: relatedLinks
          ? relatedLinks.map((link) => JSON.stringify(link))
          : [],
        updatedAt: new Date().toISOString(),
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating content:", error);
    throw error;
  }
}

export async function fetchContent(documentId: string) {
  try {
    const response = await databases.getDocument(
      '679d05d40027f6fec541',   // Database ID
      '679d05dd0028c7b34c31',   // Collection ID
      documentId
    );

    return response;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
}

export async function fetchHistory(userId: string, page: number = 1, limit: number = 5) {
  try {
    const offset = (page - 1) * limit;

    const response = await databases.listDocuments(
      '679d05d40027f6fec541',   // Database ID
      '679d05dd0028c7b34c31',   // Collection ID
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ]
    );

    return response.documents || null;
  } catch (error) {
    console.error("Error fetching history:", error);
    return null;
  }
}
