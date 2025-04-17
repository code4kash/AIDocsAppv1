export interface IAIService {
  /**
   * Analyzes a document and generates insights
   * @param documentText - The text content of the document to analyze
   * @returns Promise containing the analysis results
   */
  analyzeDocument(documentText: string): Promise<DocumentAnalysis>;

  /**
   * Generates a summary of the document
   * @param documentText - The text content to summarize
   * @returns Promise containing the generated summary
   */
  generateSummary(documentText: string): Promise<string>;

  /**
   * Extracts key information from the document
   * @param documentText - The text content to extract information from
   * @returns Promise containing the extracted information
   */
  extractInformation(documentText: string): Promise<DocumentInfo>;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  recommendations: string[];
}

export interface DocumentInfo {
  title?: string;
  author?: string;
  date?: string;
  keywords: string[];
  entities: {
    name: string;
    type: string;
  }[];
} 