import { ID, Query } from "appwrite";
import { appwriteDatabases } from "../appwrite";

const databaseId = "main";

// Generic helpers for a collection; you can wrap them further

export async function createDocument({ collectionId, data }) {
  return appwriteDatabases.createDocument(databaseId, collectionId, ID.unique(), data);
}

export async function updateDocument({ collectionId, documentId, data }) {
  return appwriteDatabases.updateDocument(databaseId, collectionId, documentId, data);
}

export async function deleteDocument({ collectionId, documentId }) {
  return appwriteDatabases.deleteDocument(databaseId, collectionId, documentId);
}

export async function listDocuments({ collectionId, queries = [Query.orderDesc("$createdAt")] }) {
  return appwriteDatabases.listDocuments(databaseId, collectionId, queries);
}
