
'use server';
/**
 * @fileOverview Expert Bilingual MCQ Data-Formatting AI v10.0.
 * 
 * - bulkParseMCQ - AI flow to extract, clean, and map bilingual MCQs.
 * - Rules: No prefixes, No slashes in questions, 1-line space between logic blocks.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionOutputSchema = z.object({
  question_number: z.number().describe('The sequential index of the question.'),
  question_english: z.string().describe('Clean English question text. STRIP ALL PREFIXES like "Q1.", "Question 1.", etc.'),
  question_punjabi: z.string().describe('Clean Punjabi question text. STRIP ALL PREFIXES like "ਪ੍ਰਸ਼ਨ 1.", "ਪ੍ਰਸ਼ਨ 01", or "ਸਵਾਲ 1". NO DUAL NUMBERING.'),
  option_a_english: z.string().describe('Clean English text for Option A.'),
  option_a_punjabi: z.string().describe('Clean Punjabi text for Option A.'),
  option_b_english: z.string().describe('Clean English text for Option B.'),
  option_b_punjabi: z.string().describe('Clean Punjabi text for Option B.'),
  option_c_english: z.string().describe('Clean English text for Option C.'),
  option_c_punjabi: z.string().describe('Clean Punjabi text for Option C.'),
  option_d_english: z.string().describe('Clean English text for Option D.'),
  option_d_punjabi: z.string().describe('Clean Punjabi text for Option D.'),
  correct_option: z.enum(['A', 'B', 'C', 'D']),
  explanation_english: z.string().describe('Full Step-by-step English logic. Use clear sentences.'),
  explanation_punjabi: z.string().describe('Full Step-by-step Punjabi logic.'),
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
  prompt: `You are an expert bilingual data-formatting AI specializing in bulk ingestion for competitive exams. 

### DATA EXTRACTION RULES (STRICT):
1. IMAGE PATTERN MATCHING: Follow this pattern exactly:
   Q24. [English Question Statement]
   [Punjabi Question Statement]
   (A) [Option EN] / [Option PA]
   Correct Answer: (A) ...
2. PREFIX PURGE: You MUST strip prefixes like "Q24.", "ਪ੍ਰਸ਼ਨ 24.", "ਪ੍ਰਸ਼ਨ 01" from the content. The fields should contain ONLY the statement text.
3. NO DUAL NUMBERING: Do not include numbers inside the question text fields. 
4. NO SLASHES IN STATEMENTS: Extract English and Punjabi statements into their separate database fields cleanly.
5. OPTION SEPARATION: Split combined strings like "84 cm² / 84 cm²" into the English and Punjabi fields respectively.
6. EXPLANATION SPACING: Capture the full step-by-step logic. The renderer will handle the visual gap, so just provide clean text for both fields.

---
### INPUT DATA FOR BULK INGESTION:
{{{rawText}}}
---

Return ONLY a valid JSON array of objects. No markdown wrappers.`,
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
