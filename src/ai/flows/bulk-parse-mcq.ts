'use server';
/**
 * @fileOverview Expert Bilingual MCQ Data-Formatting AI v12.0.
 * 
 * - bulkParseMCQ - AI flow to extract, clean, and map bilingual MCQs.
 * - Rules: Strip all prefixes, Split options by '/', 1-line space in logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionOutputSchema = z.object({
  question_number: z.number().describe('The sequential index of the question.'),
  question_english: z.string().describe('Clean English question text. STRIP ALL PREFIXES like "Q1.", "Question 1.", etc.'),
  question_punjabi: z.string().describe('Clean Punjabi question text. STRIP ALL PREFIXES like "ਪ੍ਰਸ਼ਨ 1.", "ਪ੍ਰਸ਼ਨ 01".'),
  option_a_english: z.string().describe('Value only for Option A. STRIP "A)", "(A)" or "Option A".'),
  option_a_punjabi: z.string().describe('Punjabi value only for Option A.'),
  option_b_english: z.string().describe('Value only for Option B.'),
  option_b_punjabi: z.string().describe('Punjabi value only for Option B.'),
  option_c_english: z.string().describe('Value only for Option C.'),
  option_c_punjabi: z.string().describe('Punjabi value only for Option C.'),
  option_d_english: z.string().describe('Value only for Option D.'),
  option_d_punjabi: z.string().describe('Punjabi value only for Option D.'),
  correct_option: z.enum(['A', 'B', 'C', 'D']),
  explanation_english: z.string().describe('Full Step-by-step English logic.'),
  explanation_punjabi: z.string().describe('Full Step-by-step Punjabi logic.')
});

const BulkParseInputSchema = z.object({
  rawText: z.string().describe('The block of raw bilingual MCQ text.'),
});

const BulkParseOutputSchema = z.array(QuestionOutputSchema);

export async function bulkParseMCQ(input: { rawText: string }): Promise<z.infer<typeof BulkParseOutputSchema>> {
  return bulkParseMCQFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bulkParseMCQ',
  input: { schema: BulkParseInputSchema },
  output: { schema: BulkParseOutputSchema },
  prompt: `You are an expert bilingual data-formatting AI. 

### DATA EXTRACTION RULES (STRICT):
1. PATTERN: 
   Q1. English Question
   Punjabi Question
   (A) Option EN / Option PA
   ...
2. PREFIX PURGE: Strip "Q1.", "ਪ੍ਰਸ਼ਨ 1.", "(A)", "A)" from ALL fields. The fields must contain ONLY the content data.
3. BILINGUAL SPLIT: Split strings like "12 days / 12 ਦਿਨ" into English and Punjabi fields respectively.
4. EXPLANATION: Extract the full step-by-step logic for both languages.

---
### INPUT DATA:
{{{rawText}}}
---

Return ONLY valid JSON array. No markdown.`,
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
