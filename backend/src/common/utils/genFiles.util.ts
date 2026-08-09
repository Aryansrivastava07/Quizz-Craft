import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import mime from 'mime';

// New interface for the return type of getFilesFromDto
export interface UploadedFileWithMime {
  path: string;
  mimetype: string;
}
export const getFilesFromDto = async (
  fileContents: any,
): Promise<UploadedFileWithMime[]> => {
  if (!fileContents || fileContents.length === 0) {
    return [];
  }

  const uploadsDir = path.join(process.cwd(), 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePromises = fileContents.map(async (fileContent) => {
    const filePath = path.join(
      uploadsDir,
      `${randomUUID()}-${fileContent.originalname}`,
    );

    await fs.writeFile(filePath, fileContent.buffer);

    const determinedMimeType =
      mime.getType(fileContent.originalname) || fileContent.mimetype;

    return {
      path: filePath,
      // mimetype:
      //   fileContent.mimetype == 'application/octet-stream'
      //     ? `application/${fileContent.originalname.split('.')[fileContent.originalname.split('.').length - 1]}`
      //     : fileContent.mimetype,
      mimetype: determinedMimeType,
    };
  });

  return Promise.all(filePromises);
};
