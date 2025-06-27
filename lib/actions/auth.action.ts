"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  const cookieStore = await cookies(); // ✅ FIXED: await here

  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// Create a new user
export async function signUp(params: {
  uid: string;
  name: string;
  email: string;
}) {
  const { uid, name, email } = params;

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnapshot = await userRef.get();

    if (userSnapshot.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    await userRef.set({
      name,
      email,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "auth/email-already-exists"
    ) {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// Sign in user and set session cookie
export async function signIn(params: { email: string; idToken: string }) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Please sign up.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error: unknown) {
    console.error("Error signing in:", error);
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by deleting session cookie
export async function signOut() {
  const cookieStore = await cookies(); // ✅ FIXED: await here
  cookieStore.delete("session");
}

// Get current logged-in user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies(); // ✅ FIXED: await here
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userDoc.exists) return null;

    return {
      ...userDoc.data(),
      id: userDoc.id,
    } as User;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

// Fetch interviews created by a specific user
export async function getInterviewsByUserId(userId: string) {
  try {
    const snapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
}


// Helper to check if user is logged in
export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}
