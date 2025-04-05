import { zStringRequired } from '@BLOGS/shared/src/zod';
import {z} from 'zod'

export const zPrepareS3UploadTrpcInput = z.object({
      fileName: zStringRequired,
      fileType: zStringRequired,
      type: z.enum(['avatar', 'image']),
      fileSize: z.number().int().positive()
})