
import {  Query } from "appwrite";
import { Databases } from 'appwrite';
import { Client } from 'appwrite';
import { ID } from "appwrite";
    const client = new Client()
        .setEndpoint('https://appwrite.appunik-team.com/v1')
        .setProject('679a3be3000b571ae49b'); 

    export default client;
    const databases = new Databases(client);
export async function checkCompanyDomain(domain: string) {
    try {
      const response = await databases.listDocuments(
        "6810c3d000176c871d20", 
        "6810c3df00360d0ab262",         
        [Query.equal("domain", domain)]
      );
  
      return response.documents[0] || null;
    } catch (error) {
      console.error("Error checking company domain:", error);
      return null;
    }
  }

export async function createCompany(data: { name: string; domain: string; users: string[] }) {
    const id = crypto.randomUUID(); // or let Appwrite auto-generate
    return await databases.createDocument(
        "6810c3d000176c871d20", 
        "6810c3df00360d0ab262",         
      id,
      {
        name: data.name,
        domain: data.domain,
        users: data.users,
      }
    );
  }
  

export async function joinCompany(companyId: string, userId: string) {
    const existing = await databases.getDocument("6810c3d000176c871d20", "6810c3df00360d0ab262", companyId);
    const updatedUsers = [...new Set([...(existing.users || []), userId])] ;
  
    return await databases.updateDocument("6810c3d000176c871d20", "6810c3df00360d0ab262", companyId, {
      users: updatedUsers,
    });
  }
//this below function used in custom hool for get company id by user
export async function getCompanyIdbyUser(userId:string) {
  // debugger
    try {
      const response = await databases.listDocuments(
        "6810c3d000176c871d20", 
        "6810c3df00360d0ab262",         
        [Query.contains("users", userId)]
      );
  
      return response.documents[0].$id || null;
    } catch (error) {
      console.error("Error checking company domain:", error);
      return null;
    }
  
}
export async function getDataByMatchedOrganazationID(companyId: string ) {
  
  try {
    const response = await databases.listDocuments(
      '679d05d40027f6fec541',   // Database ID
      '679d05dd0028c7b34c31',   // Collection ID
      [
        Query.equal('companyId', companyId ),
        Query.orderDesc('$createdAt')
      ]
    );

    return response.documents || null;

  } catch (error) {
    console.error("Error fetching data by companyId:", error);
    return null;
  }
}


export async function deleteCompanyHistoryItem(documentId: string) {
  try {
    await databases.deleteDocument(
      '679d05d40027f6fec541', // Database ID
      '679d05dd0028c7b34c31', // Collection ID
      documentId
    );
    return true;
  } catch (error) {
    console.error("Error deleting company history item:", error);
    throw error;
  }
}



export async function saveContentHistory(
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

    console.log("companyId to be saved:", companyId, typeof companyId);

    const safeInt = (val: any) => (typeof val === 'number' && !isNaN(val) ? Math.round(val) : null);
    debugger
    const documentId = ID.unique();
    const data = {
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
      aiScore: safeInt(aiScore),
      humanScore: safeInt(humanScore),
      humanizedVersion: humanizedVersion ?? null,
      outline: outline ?? [],
      suggestions: suggestions ?? [],
      contentGaps: contentGaps ?? [],
      summary: summary ?? null,
      relatedLinks: relatedLinks ?? [],
      companyId: companyId ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await databases.createDocument(
      '679d05d40027f6fec541', // Database ID
      '679d05dd0028c7b34c31', // Collection ID
      documentId,
      data
    );

    console.log("Content saved:", result);
    return result;
  } catch (error) {
    console.error("Error saving content:", error);
    throw error;
  }
}