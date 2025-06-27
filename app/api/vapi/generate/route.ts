export const runtime = 'nodejs';

import { getRandomInterviewCover } from '@/lib/utils';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { db } from '@/firebase/admin';

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  if (!userid || !role || !level || !techstack || !amount) {
    return Response.json(
      { success: false, error: 'Missing required fields.' },
      { status: 400 }
    );
  }

  try {
    const prompt = `Respond ONLY with a valid JSON array of strings, and nothing else.

Prepare ${amount} interview questions for a job interview.
The job role is: ${role}.
The experience level is: ${level}.
The tech stack used in the job is: ${techstack}.
`;

    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    console.log("🧪 Gemini raw response:", rawQuestions); // for debugging

    let questions: string[] = [];

    try {
      const match = rawQuestions.match(/\[[\s\S]*\]/);
      if (!match) {
        throw new Error("No valid JSON array found in Gemini response.");
      }

      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) {
        questions = parsed.slice(0, Number(amount));
      } else {
        throw new Error("Parsed Gemini output is not an array.");
      }
    } catch (error) {
      console.error("❌ Error parsing AI response:", error, rawQuestions);
      return Response.json(
        { success: false, error: 'Failed to parse AI response as JSON array.' },
        { status: 500 }
      );
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(',').map((s: string) => s.trim()),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    // 🔽 Firestore write and validation log
    const savedRef = await db.collection("interviews").add(interview);
    console.log("✅ Interview saved to Firestore with ID:", savedRef.id); // <--- This line confirms Firestore access

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error saving interview:", error);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
