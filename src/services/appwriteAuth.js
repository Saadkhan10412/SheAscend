import { ID, Query } from "appwrite";
import { appwriteAccount, appwriteDatabases } from "../appwrite";

// Sign up a new user with email + password
export async function signUpWithEmail({ email, password, name }) {
  const account = await appwriteAccount.create(ID.unique(), email, password, name);
  // Optionally create a session right after sign-up
  await appwriteAccount.createEmailPasswordSession(email, password);
  return account;
}

// Create user profile document in "users" collection
export async function createUserProfileDocument({ userId, name, email, goal, dob, duration, dailyDuration, personalityPrompt }) {
  const databaseId = "main";
  const collectionId = "users"; // fixed as per requirement

  if (!databaseId) {
    throw new Error("Missing VITE_APPWRITE_DATABASE_ID env var for creating user profile.");
  }

  const doc = await appwriteDatabases.createDocument(databaseId, collectionId, userId, {
    name,
    email,
    goal,
    dob,
    duration,
    dailyDuration,
    personalityPrompt
  });

  return doc;
}

// Get current user's profile document from "users" collection
export async function getCurrentUserProfile(userId) {
  const databaseId = "main";
  const collectionId = "users";

  try {
    const res = await appwriteDatabases.listDocuments(databaseId, collectionId, [
      Query.equal("$id", userId),
    ]);

    if (res.documents && res.documents.length > 0) {
      return res.documents[0];
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch current user profile:", err);
    return null;
  }
}

// Login existing user
export async function loginWithEmail({ email, password }) {
  return appwriteAccount.createEmailPasswordSession(email, password);
}

// Get currently logged-in account (or null if none)
export async function getCurrentUser() {
  try {
    const user = await appwriteAccount.get();
    return user;
  } catch (err) {
    return null;
  }
}

// Logout current session
export async function logoutCurrentSession() {
  return appwriteAccount.deleteSession("current");
}

// Get user's roadmaps (one-to-many relationship with weekly_tasks)
export async function getUserRoadmaps(userId) {
  const databaseId = "main";
  const collectionId = "roadmaps";

  try {
    const response = await appwriteDatabases.listDocuments(databaseId, collectionId);
    return response.documents;
  } catch (err) {
    console.error("Failed to fetch roadmaps:", err);
    return [];
  }
}

// Get weekly tasks for a user
export async function getWeeklyTasks(userId) {
  const databaseId = "main";
  const collectionId = "weekly_tasks";

  try {
    const response = await appwriteDatabases.listDocuments(databaseId, collectionId);
    return response.documents;
  } catch (err) {
    console.error("Failed to fetch weekly tasks:", err);
    return [];
  }
}

// Get daily tasks for a user
export async function getDailyTasks(userId) {
  const databaseId = "main";
  const collectionId = "daily_tasks";

  try {
    const response = await appwriteDatabases.listDocuments(databaseId, collectionId);
    return response.documents;
  } catch (err) {
    console.error("Failed to fetch daily tasks:", err);
    return [];
  }
}

// Get all tasks for a user
export async function getAllTasks(userId) {
  const databaseId = "main";
  const collectionId = "tasks";

  try {
    const response = await appwriteDatabases.listDocuments(databaseId, collectionId);
    return response.documents;
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return [];
  }
}

// Update task status
export async function updateTaskStatus(taskId, status) {
  const databaseId = "main";
  const collectionId = "tasks";

  try {
    const doc = await appwriteDatabases.updateDocument(databaseId, collectionId, taskId, {
      status,
    });
    return doc;
  } catch (err) {
    console.error("Failed to update task status:", err);
    throw err;
  }
}

/**
 * AISlave - send an instruction and data to the AI webhook and return the output string
 * @param {string} instruction - instruction for the remote workflow, e.g. "replace all , and black space with -"
 * @param {string} data - the data to transform, e.g. "one,two,three ,four"
 * @returns {Promise<string>} - the transformed output (first item 'output' field)
 */
export async function AISlave(instruction, data) {
  const url = "https://saadkhan1004.app.n8n.cloud/webhook/7a45a1e8-328f-4544-b7d6-aa2615f4c278";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction, data }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AISlave request failed: ${res.status} ${res.statusText} ${text}`);
    }

    const json = await res.json();

    // Expected response: [ { output: "..." } ]
    if (Array.isArray(json) && json.length > 0 && typeof json[0].output === "string") {
      return json[0].output;
    }

    // If webhook returns an object with 'output' directly
    if (json && typeof json.output === "string") {
      return json.output;
    }

    throw new Error("AISlave: unexpected response format from webhook");
  } catch (err) {
    console.error("AISlave error:", err);
    throw err;
  }
}

// Get interviews from weekly_interviews collection
export async function getInterviews(userId) {
  const databaseId = "main";
  const collectionId = "weekly_interviews";

  try {
    const response = await appwriteDatabases.listDocuments(databaseId, collectionId);
    return response.documents;
  } catch (err) {
    console.error("Failed to fetch interviews:", err);
    return [];
  }
}

// Start an interview by sending phone number to webhook
export async function startInterview(phoneNumber) {
  const url = "https://saadkhan1004.app.n8n.cloud/webhook/8de4e8df-cbc7-4452-90d9-ad5723129eb4";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+91${phoneNumber}` }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Start interview request failed: ${res.status} ${res.statusText} ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Start interview error:", err);
    throw err;
  }
}
