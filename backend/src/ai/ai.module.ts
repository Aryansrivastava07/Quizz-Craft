import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AI_PROVIDER } from './ai.constants';
import { AiProviderDefinition } from './ai.provider';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    GeminiProvider,
    AiProviderDefinition,
  ],
  exports: [AI_PROVIDER],
})
export class AiModule {}