import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!  
});
export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 },
      );
    }

    console.log("Analyzing transcript:", transcript.substring(0, 100) + "...");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert medical AI assistant. You analyze doctor-patient consultations and extract structured medical information. You ONLY respond with valid JSON, no markdown, no backticks, no explanations.",
        },
        {
          role: "user",
          content: `Analyze this doctor-patient consultation transcript and extract structured medical information.

TRANSCRIPT:
${transcript}

Respond with ONLY valid JSON in this EXACT format (no markdown, no backticks):
{
  "patientInfo": {
    "name": "Patient name if mentioned, otherwise 'Patient'",
    "age": "Age if mentioned, otherwise 'N/A'",
    "gender": "Gender if mentioned, otherwise 'N/A'"
  },
  "symptoms": ["list", "of", "symptoms", "mentioned"],
  "diagnosis": "Primary diagnosis based on the symptoms described",
  "medications": [
    {
      "name": "Medication name",
      "dosage": "Dosage amount (e.g., 500mg)",
      "frequency": "How often (e.g., Three times daily)",
      "duration": "How long (e.g., 5 days)"
    }
  ],
  "instructions": "Patient care instructions, rest recommendations, and follow-up advice"
}

Important: 
- Extract actual information from the transcript
- For medications, use appropriate treatments for the symptoms
- If diagnosis is mentioned, use it; otherwise infer from symptoms
- Keep it medically accurate and professional
- Respond ONLY with the JSON object, nothing else`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2000,
    });

    let text = completion.choices[0]?.message?.content || "";
    console.log("Raw AI response:", text);

    // Clean the response
    text = text.trim();
    text = text.replace(/```json\n?/gi, "");
    text = text.replace(/```\n?/gi, "");
    text = text.trim();

    // Parse JSON
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Cleaned text:", text);

      // Fallback structure
      analysis = {
        patientInfo: {
          name: "Patient",
          age: "N/A",
          gender: "N/A",
        },
        symptoms: ["Please try again - parsing error"],
        diagnosis: "Unable to analyze - please retry",
        medications: [
          {
            name: "Please regenerate",
            dosage: "N/A",
            frequency: "N/A",
            duration: "N/A",
          },
        ],
        instructions: "The AI response was malformed. Please try again.",
      };
    }

    console.log("Parsed analysis:", analysis);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Full analysis error:", error);
    console.error("Error message:", error.message);

    return NextResponse.json(
      {
        error: "Failed to analyze consultation",
        details: error.message || "Unknown error",
        patientInfo: { name: "Error", age: "N/A", gender: "N/A" },
        symptoms: ["API Error occurred"],
        diagnosis: "System error - please try again",
        medications: [],
        instructions: "Please try again",
      },
      { status: 500 },
    );
  }
}
