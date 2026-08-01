export interface AiProvider {
  generateText(prompt: string): Promise<string>;
}