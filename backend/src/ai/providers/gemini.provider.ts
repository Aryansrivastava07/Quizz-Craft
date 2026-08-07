import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiError,
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from '@google/genai';
import { AiProvider } from '../interfaces/ai-provider.interface';
import { generateQuizDto } from '../../quiz/dto/quiz.request.dto';
import {
  generateQuizPrompt,
  quizCreationSchema,
} from '../prompts/generateQuiz';
import { getFilesFromDto } from '../../common/utils/genFiles.util';
import { promises as fs } from 'fs';

@Injectable()
export class GeminiProvider implements AiProvider {
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: this.configService.getOrThrow<string>('GEMINI_API_KEY'),
    });

    this.model =
      this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-3.6-flash';
  }

  private async _cleanupFiles(filePaths: string[]): Promise<void> {
    try {
      await Promise.all(filePaths.map((path) => fs.unlink(path)));
    } catch (error) {
      // Log the error but don't throw, as we want the main operation to succeed
      // even if cleanup fails. You might want more robust logging here.
      console.log('Error during file cleanup:', error);
    }
  }

  async generateQuiz(dto: generateQuizDto): Promise<string> {
    let fileParts: any[] = [];
    let geminiUploads: any[] = [];
    let uploads;
    try {
      uploads = [
        ...await (getFilesFromDto(dto.images) ?? []),
        ...await (getFilesFromDto(dto.videos) ?? []),
        ...await (getFilesFromDto(dto.pdfs) ?? []),
      ];
      // console.log(uploads)

      if (uploads && uploads.length > 0) {
        // Use Promise.all with .map to handle asynchronous operations in a loop correctly.
        // .forEach does not wait for async operations to complete.
        const uploadPromises = uploads.map((element) => {
          return this.client.files.upload({
            file: element.path,
            config: { mimeType: element.mimetype },
          });
        })


        geminiUploads = await Promise.all(uploadPromises);

        // Wait for all files to become active. Videos and large files can take time to process.
        const activeFilesPromises = geminiUploads.map(async (uploadedFile) => {
          console.log(
            `File ${uploadedFile.name} uploaded. Waiting for it to be processed...`,
          );
          let file = uploadedFile;
          const startTime = Date.now();
          const timeout = 180000; // 3 minutes timeout for processing
          const pollInterval = 5000; // Poll every 5 seconds

          while (
            file.state === 'PROCESSING' &&
            Date.now() - startTime < timeout
          ) {
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            try {
              file = await this.client.files.get({ name: uploadedFile.name });
              console.log(`Current state of ${file.name}: ${file.state}`);
            } catch (e: any) {
              console.error(
                `Error getting file status for ${uploadedFile.name}`,
                e,
              );
              throw new Error(e.message);
            } // Closes catch block
          } // Closes while loop

          if (file.state !== 'ACTIVE') {
            console.error(
              `File ${file.name} did not become ACTIVE. Final state: ${file.state}`,
            );
            throw new Error(
              `File ${file.name} could not be processed. Its state is ${file.state}.`,
            );
          }

          console.log(`File ${file.name} is now ACTIVE.`);
          return file;
        });
        const activeFiles = await Promise.all(activeFilesPromises);
        fileParts = activeFiles.map((file) =>
          createPartFromUri(file.uri, file.mimeType),
        );
      }
      const countTokensResponse = await this.client.models.countTokens({
        model: this.model,
        contents: createUserContent([
          ...fileParts,
          generateQuizPrompt(dto.prompt),
        ]),
      });
      console.log(countTokensResponse.totalTokens);
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: createUserContent([
          ...fileParts,
          generateQuizPrompt(dto.prompt),
        ]),
        config: {
          responseMimeType: 'application/json',
          responseSchema: quizCreationSchema,
        },
      });

      return response.text ?? '';
    }
    catch (error: any) {
      if (error instanceof ApiError) {
        console.error('API Error:', error.message);
        throw new Error(`API Error: ${error.message}`);
      } else {
        console.error('Unexpected Error:', error);
        throw new Error(`Unexpected Error: ${error.message}`);
      }
    }
    finally {
      console.log(uploads.map((file) => file.path));
      await this._cleanupFiles(uploads.map((file) => file.path) || []);
    }
  }
}
