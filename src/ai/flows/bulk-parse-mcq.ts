
'use server';
/**
 * @fileOverview Expert Bilingual MCQ Data-Formatting AI.
 * 
 * - bulkParseMCQ - AI flow to extract, clean, and map bilingual MCQs.
 * - BulkParseInput - Raw text input for parsing.
 * - BulkParseOutput - Structured JSON array of questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionOutputSchema = z.object({
  question_number: z.number().describe('The sequential index of the question.'),
  question_english: z.string().describe('Clean English question text without prefixes.'),
  question_punjabi: z.string().describe('Clean Punjabi question text without prefixes or slashes.'),
  option_a_english: z.string(),
  option_a_punjabi: z.string(),
  option_b_english: z.string(),
  option_b_punjabi: z.string(),
  option_c_english: z.string(),
  option_c_punjabi: z.string(),
  option_d_english: z.string(),
  option_d_punjabi: z.string(),
  correct_option: z.enum(['A', 'B', 'C', 'D']),
  explanation_english: z.string().describe('Step-by-step English rationale.'),
  explanation_punjabi: z.string().describe('Step-by-step Punjabi rationale.'),
});

const BulkParseInputSchema = z.object({
  rawText: z.string().describe('The large block of raw bilingual MCQ text.'),
});

const BulkParseOutputSchema = z.array(QuestionOutputSchema);

export async function bulkParseMCQ(input: { rawText: string }): Promise<z.infer<typeof BulkParseOutputSchema>> {
  return bulkParseMCQFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bulkParseMCQ',
  input: { schema: BulkParseInputSchema },
  output: { schema: BulkParseOutputSchema },
  prompt: `You are an expert bilingual data-formatting AI specializing in bulk ingestion for competitive exams. 

### DATA EXTRACTION RULES:
1. NO DUAL NUMBERING OR SLASHES IN QUESTIONS: Extract the English question text and Punjabi question text cleanly. Remove prefixes like "ਪ੍ਰਸ਼ਨ 1." or "ਪ੍ਰਸ਼ਨ 01" and any dividing slashes.
2. CLEAN OPTIONS: Separate the English and Punjabi options. Do not include internal brackets or redundant text (e.g., convert "Geometry / ਰੇਖਾਗਣਿਤ (Geometry)" to English: "Geometry", Punjabi: "ਰੇਖਾਗਣਿਤ").
3. SOLUTION EXPLANATIONS: Do not drop the explanations. Extract them completely and map them to their respective language explanation fields.

---
### INPUT DATA FOR BULK INGESTION:
{{{rawText}}}
---

Please parse the entire dataset at once without omitting any questions or solutions. 
Return a valid JSON array of objects matching the specified schema.`,
});

const bulkParseMCQFlow = ai.defineFlow(
  {
    name: 'bulkParseMCQFlow',
    inputSchema: BulkParseInputSchema,
    outputSchema: BulkParseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
