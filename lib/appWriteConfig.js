export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  Platform: "com.mohe.aora",
  projectId: "662e27e8002fa633b302",
  databaseId: "662e2b25003be0d18a4e",
  userCollectionId: "662e2b6f000ff871057e",
  videoCollectionId: "662e2ba500212535c009",
  storageId: "662e314200338f4b2ed6",
};

import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage,
  ID,
  Query,
} from "react-native-appwrite";
import SignIn from "../app/(auth)/sign-in";
// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.Platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);
  } catch (error) {
    throw Error(error);
  }
}
export const createUser = async (email, password, username) => {
  // Register User

  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    console.log(newAccount);
    if (!newAccount) throw Error;
    console.log(newAccount);

    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newuser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avater: avatarUrl,
      }
    );
    return newuser;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currAccount = await account.get();
    if (!currAccount) throw Error;
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const signOut = async () => {
  try {
    const sesion = await account.deleteSession("current");
    return sesion;
  } catch (error) {
    throw new Error(error);
  }
};

export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const uploadFile = async (file, type) => {
  if (!file) return;

  const assets = {
    name: file.fileName,
    type: file.mimeType,
    size: file.filesize,
    uri: file.uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      assets
    );
    console.log(assets);
    console.log("first", uploadedFile);
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    console.log(fileUrl);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};
export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    console.log({
      title: form.title,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      prompt: form.prompt,
      creator: form.userId,
    });
    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};
