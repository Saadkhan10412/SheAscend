import { ID } from "appwrite";
import { appwriteStorage } from "../appwrite";

const bucketId = "main";

// Upload a single file (e.g., from an <input type="file" />)
export async function uploadFile(file) {
  return appwriteStorage.createFile(bucketId, ID.unique(), file);
}

// Get a public/preview URL for a file
export function getFilePreview(fileId) {
  return appwriteStorage.getFilePreview(bucketId, fileId).href;
}

// Delete a file
export async function deleteFile(fileId) {
  return appwriteStorage.deleteFile(bucketId, fileId);
}
