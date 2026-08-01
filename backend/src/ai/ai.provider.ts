import { Provider } from '@nestjs/common';
import { AI_PROVIDER } from './ai.constants';
import { GeminiProvider } from './providers/gemini.provider';

export const AiProviderDefinition: Provider = {
  provide: AI_PROVIDER,
  useClass: GeminiProvider,
};