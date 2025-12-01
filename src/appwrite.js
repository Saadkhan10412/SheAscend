// dotenv

import { Client, Account, Databases, Storage } from "appwrite";
const client = new Client();

client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const appwriteClient = client;
export const appwriteAccount = new Account(client);
export const appwriteDatabases = new Databases(client);
export const appwriteStorage = new Storage(client);

export function assertAppwriteConfigured() {
  const missing = [];
  if (!import.meta.env.VITE_APPWRITE_ENDPOINT) missing.push("APPWRITE_ENDPOINT");
  if (!import.meta.env.VITE_APPWRITE_PROJECT_ID) missing.push("APPWRITE_PROJECT_ID");
  if (!import.meta.env.VITE_APPWRITE_DATABASE_ID) missing.push("APPWRITE_DATABASE_ID");
  if (!import.meta.env.VITE_APPWRITE_BUCKET_ID) missing.push("APPWRITE_BUCKET_ID");

  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn(
      `Appwrite env vars missing: ${missing.join(", ")}. Auth/DB/Storage calls may fail until they are set.`
    );
  }
}

export async function checkAppwriteConnection() {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  if (!endpoint) {
    // eslint-disable-next-line no-console
    console.warn("Appwrite: APPWRITE_ENDPOINT not set; skipping connectivity check.");
    return false;
  }

  try {
    console.log("tested v3");
    const res = await fetch(endpoint, { method: "GET", mode: "cors" });
    if (res) {
  
      console.log("Appwrite has started");
      return true;
    }

    console.warn(`Appwrite: unexpected response ${res.status} from ${endpoint}`);
    return false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Appwrite: could not connect to backend", err);
    return false;
  }
}

checkAppwriteConnection();
