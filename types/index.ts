export interface AnalysisResult {
  summary: string
  textContent: {
    title: string
    metaDescription: string
    headings: string[]
    paragraphs: string[]
  }
  heroScreenshot: string
  fullPageScreenshot: string
}

export interface DesignResult {
  imageUrl: string
  style: string
  description: string
  prompt: string
}

export interface GenerateResult {
  designs: DesignResult[]
}