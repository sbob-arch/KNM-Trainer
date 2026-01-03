import { Question, MistakeRecord } from '../types';

export const generateQuestions = async (topicContext: string, count: number, key: string): Promise<Question[]> => {
  try {
    const prompt = `
      You are an expert tutor for the Dutch Civic Integration Exam (Inburgeringsexamen), specifically the KNM (Kennis van de Nederlandse Maatschappij) module.
      
      Your task is to generate ${count} multiple-choice questions in DUTCH.
      
      Topic Focus: ${topicContext}
      
      Style Guide:
      - Similar to real CBR exams and practice materials.
      - Use simple B1 level Dutch suitable for exam candidates.
      - Questions should be a mix of situational ("Wat doe je?") and factual knowledge.
      
      Output Requirements:
      - Return a JSON Array of objects.
      - Each object must have these exact keys:
        - "id" (string)
        - "questionText" (string, in Dutch)
        - "questionTextEn" (string, English translation)
        - "options" (array of 3-4 strings, in Dutch)
        - "optionsEn" (array of 3-4 strings, English translation)
        - "correctOptionIndex" (number, 0-based)
        - "explanation" (string, in Dutch)
        - "explanationEn" (string, English translation)
        - "topic" (string, short category name)
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      const data = JSON.parse(text);
      const questionsArray = Array.isArray(data) ? data : (data.questions || data.items || []);
      
      if (!Array.isArray(questionsArray)) {
         throw new Error("AI response format invalid (not an array)");
      }

      return questionsArray.map((q: Question, idx: number) => ({
        ...q,
        id: `q-${Date.now()}-${idx}`
      }));
    }
    
    throw new Error("No data returned from AI");

  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

export const generateAIStudyPlan = async (mistakes: Record<string, MistakeRecord>, key: string): Promise<string> => {
  try {
    const mistakeSummaries = Object.values(mistakes)
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 5)
      .map(m => `- ${m.question.topic}: ${m.question.questionText} (Failed ${m.errorCount} times)`)
      .join('\n');

    const prompt = `
      Act as a friendly Dutch KNM exam coach.
      Analyze these top mistakes made by the student:
      ${mistakeSummaries || "The student has no recorded mistakes yet."}

      Create a short, personalized, bulleted study plan (max 150 words) in English.
      Focus on the specific cultural themes they are missing (e.g., if they miss health questions, explain why that's important).
      Be encouraging and use emojis.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    if (!response.ok) throw new Error("AI Busy");
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate plan.";
  } catch (e) {
    console.error(e);
    return "Our AI coach is currently offline. Please try again later.";
  }
};

export const getAIDeepDive = async (q: Question, key: string): Promise<string> => {
  try {
    const prompt = `
      For the Dutch KNM exam question: "${q.questionText}" (Topic: ${q.topic})
      
      Provide a "Deep Dive" cultural context snippet (max 3 sentences) in English. 
      Explain the *why* behind this Dutch rule or norm. 
      Start with "🇳🇱 In the Netherlands..."
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    if (!response.ok) throw new Error("AI Busy");
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "No info available.";
  } catch (e) {
    return "Context currently unavailable.";
  }
};