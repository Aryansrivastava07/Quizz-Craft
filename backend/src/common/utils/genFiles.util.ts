import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export const getFilesFromDto = async (fileContents: any) => {
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

    return {
      path: filePath,
      mimetype: fileContent.mimetype,
    };
  });

  return Promise.all(filePromises);
};