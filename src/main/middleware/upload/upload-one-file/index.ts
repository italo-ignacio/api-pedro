import { badRequest, errorLogger, messageErrorResponse } from '@main/utils';
import { messages } from '@domain/helpers';
import multer, { MulterError, diskStorage } from 'multer';
import path from 'path';
import type { Controller } from '@domain/protocols';
import type { NextFunction, Request, Response } from 'express';

const storage = diskStorage({
  destination(req, file, cb) {
    cb(null, './src/static/uploads');
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname);
    const allowedExtensions = ['.jpeg', '.png', '.webp', '.avif', '.jpg'];

    if (allowedExtensions.includes(extension)) cb(null, `${Date.now()}-${file.originalname}`);
    else cb(new Error(''), '');
  }
});

export const uploadOneFileMiddleware = multer({
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  storage
}).single('image');

export const insertImage: Controller =
  // eslint-disable-next-line consistent-return
  () => (request: Request, response: Response, next: NextFunction) => {
    try {
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let filename: string | undefined;

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (request.file?.filename)
        filename = `${request.protocol}://${request.get('host') ?? ''}/static/uploads/${
          request.file.filename
        }`;

      // eslint-disable-next-line no-undefined, @typescript-eslint/no-unsafe-assignment
      if (filename !== undefined)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        Object.assign(request, { body: { ...request.body, image: filename } });

      next();
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, max-params, unused-imports/no-unused-vars
export const handleMulterError = (
  err: Error,
  req: Request,
  response: Response,
  next: NextFunction
  // eslint-disable-next-line consistent-return, max-params
) => {
  if (err instanceof MulterError)
    return badRequest({
      message: messages.default.uploadError(err.message),
      response
    });
  if (err instanceof Error) return badRequest({ message: messages.default.badFile, response });

  next();
};
