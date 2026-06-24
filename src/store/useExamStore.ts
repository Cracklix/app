import { create } from "zustand"
import { ExamLanguage, LanguageDisplayMode } from "@/types"

interface ExamStoreState {
  selectedLanguage: ExamLanguage | LanguageDisplayMode | null
  setSelectedLanguage: (lang: ExamLanguage | LanguageDisplayMode) => void
  examMode: "SINGLE" | "MULTIPLE" | "AUTHORITY"
  setExamMode: (mode: "SINGLE" | "MULTIPLE" | "AUTHORITY") => void
}

/**
 * @fileOverview Exam Store v2.2 - Production Ready
 * FIXED: Corrected language type initialization and removed type conflicts
 */

export const useExamStore = create<ExamStoreState>((set) => ({
  selectedLanguage: null,
  setSelectedLanguage: (lang: ExamLanguage | LanguageDisplayMode) =>
    set({ selectedLanguage: lang }),

  examMode: "SINGLE",
  setExamMode: (mode: "SINGLE" | "MULTIPLE" | "AUTHORITY") =>
    set({ examMode: mode }),
}))

export default useExamStore
