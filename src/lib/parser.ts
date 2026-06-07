/**
 * @fileOverview Institutional High-Fidelity Explicit Parser v46.0.
 * UPDATED: Supports multi-line bilingual patterns and explicit language markers.
 * 
 * Format Supported:
 * Q15. English Question
 * Punjabi Question
 * A. Padma Shri
 * ਪਦਮ ਸ਼੍ਰੀ
 * Answer: C. Bharat Ratna
 * ਉੱਤਰ: C. ਭਾਰਤ ਰਤਨ
 * Explanation (English): Text...
 * ਵਿਆਖਿਆ (Punjabi): Text...
 */

export interface ParsedResults {
  questions: any[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  const secondaryLang = metadata.secondaryLanguage || 'punjabi';
  const text = "\n" + rawText.replace(/\r\n/g, '\n').trim() + "\n";
  
  // Split by Q1., Question 1., etc.
  const blocks = text.split(/\n(?=Q\s*\d+[\.\s]|Question\s*\d*[\.\s\:]|Question\s*\(English\s*Box\)\:)/i).filter(b => b.trim().length > 10);
  
  const results: any[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    try {
      const fullText = block.trim();
      const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      const q: any = { 
        ...metadata,
        id: `q-node-${Date.now()}-${index}`,
        status: metadata.status || "PUBLISHED",
        isStandalone: true,
        debug: {}
      };

      const qField = secondaryLang === 'hindi' ? 'hindiQuestion' : 'punjabiQuestion';
      const expField = secondaryLang === 'hindi' ? 'hindiExplanation' : 'punjabiExplanation';

      // 1. EXTRACT BILINGUAL QUESTIONS
      // English is line 0
      q.englishQuestion = lines[0].replace(/^(?:Q|Question)\s*\d+[\.\s]*/i, '').trim();
      
      // Punjabi/Hindi is usually line 1, but we check if line 1 starts an option
      if (lines[1] && !lines[1].match(/^[A-D][\.\)\s]/)) {
        q[qField] = lines[1].trim();
      }

      // 2. EXTRACT BILINGUAL OPTIONS (Multi-line or Interleaved)
      const getOptionBlock = (letter: string, next: string | null) => {
        const regex = next 
          ? new RegExp(`\\n${letter}[\\.\\)]\\s*([\\s\\S]*?)(?=\\n${next}[\\.\\)]|\\nAnswer|\\nਉੱਤਰ|\\nExplanation|\\nਵਿਆਖਿਆ|$)`, 'i')
          : new RegExp(`\\n${letter}[\\.\\)]\\s*([\\s\\S]*?)(?=\\nAnswer|\\nਉੱਤਰ|\\nExplanation|\\nਵਿਆਖਿਆ|$)`, 'i');
        
        const match = ("\n" + fullText).match(regex);
        if (!match) return ["", ""];
        
        const content = match[1].trim();
        const contentLines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        // If interleaved: "Option En / Option Pa"
        if (content.includes('/')) {
           const parts = content.split('/').map(s => s.trim());
           return [parts[0] || "", parts[1] || parts[0] || ""];
        }
        
        // If multi-line: Line 0 is En, Line 1 is Pa
        if (contentLines.length >= 2) {
           return [contentLines[0], contentLines[1]];
        }
        
        return [contentLines[0] || "", contentLines[0] || ""];
      };

      const optSuffix = secondaryLang === 'hindi' ? 'Hindi' : 'Punjabi';
      [q.optionAEnglish, q[`optionA${optSuffix}`]] = getOptionBlock('A', 'B');
      [q.optionBEnglish, q[`optionB${optSuffix}`]] = getOptionBlock('B', 'C');
      [q.optionCEnglish, q[`optionC${optSuffix}`]] = getOptionBlock('C', 'D');
      [q.optionDEnglish, q[`optionD${optSuffix}`]] = getOptionBlock('D', null);

      // 3. CORRECT ANSWER
      const ansMatch = fullText.match(/(?:Correct Answer|Answer|Answer Key|ਉੱਤਰ|Sahi Uttar)[:\s]*\(?([A-D])\)?/i);
      if (ansMatch) q.correctAnswer = ansMatch[1].toUpperCase();

      // 4. BILINGUAL EXPLANATIONS
      const enExpMatch = fullText.match(/(?:Explanation\s*\(English\)|Explanation|Rationale)[:\s]*([\s\S]*?)(?=\n(?:ਵਿਆਖਿਆ|Punjabi|Hindi|ਉੱਤਰ)|$)/i);
      const secExpMatch = fullText.match(/(?:ਵਿਆਖਿਆ\s*\(Punjabi\)|Explanation\s*\(Punjabi\)|Explanation\s*\(Hindi\))[:\s]*([\s\S]*?)(?=$)/i);

      if (enExpMatch) q.englishExplanation = enExpMatch[1].trim();
      if (secExpMatch) q[expField] = secExpMatch[1].trim();

      // Fallback for older interleaved explanations
      if (!q.englishExplanation) {
        const expMarkerIndex = lines.findIndex(l => /^(?:English\s+)?Explanation|Logic|Rationale/i.test(l));
        if (expMarkerIndex !== -1) {
          q.englishExplanation = lines[expMarkerIndex].replace(/^(?:English\s+)?Explanation|Logic|Rationale[:\s]*/i, '').trim();
          if (lines[expMarkerIndex + 1] && !lines[expMarkerIndex + 1].match(/^(?:ਵਿਆਖਿਆ|ਉੱਤਰ|Answer)/i)) {
             q[expField] = lines[expMarkerIndex + 1].trim();
          }
        }
      }

      // Debugging Matrix
      q.debug = {
        EN_Q: q.englishQuestion ? 'YES' : 'NO',
        SEC_Q: q[qField] ? 'YES' : 'NO',
        OPT: (q.optionAEnglish && q[`optionA${optSuffix}`]) ? 'YES' : 'NO',
        KEY: q.correctAnswer ? 'YES' : 'NO'
      };

      // Validation
      if (q.englishQuestion && q.optionAEnglish && q.correctAnswer) {
        results.push(q);
      } else {
        errors.push(`Block ${index + 1} incomplete structure.`);
      }
    } catch (err: any) {
      errors.push(`Block ${index + 1} Error: ${err.message}`);
    }
  });

  return { questions: results, errors };
}
