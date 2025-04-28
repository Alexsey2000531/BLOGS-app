import { cloudinaryUploadTypes } from '@BLOGS/shared/src/cloudinary'
import { getKeysAsArray } from '@BLOGS/shared/src/getKeysAsArray'
import { z } from 'zod'

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})
