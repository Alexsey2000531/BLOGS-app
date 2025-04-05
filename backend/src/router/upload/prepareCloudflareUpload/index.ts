import {PutObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import { env } from '../../../lib/env'
import {ExpectedError} from '../../../lib/error'
import {getS3Client} from '../../../lib/s3'
import {trpcLoggedProcedure} from '../../../lib/trpc'
import {getRandomString} from '../../../utils/getRandomString'
import { zPrepareS3UploadTrpcInput } from './input'

const maxFileSize = 10 * 1024 * 1024

export const prepareS3UploadTrpcRoute = trpcLoggedProcedure.input(zPrepareS3UploadTrpcInput).mutation(async ({input, ctx}) => {
      if(input.fileSize > maxFileSize){
            throw new ExpectedError('Размер файла должен быть меньше 10МБ')
      }

      const userId = ctx.me?.id;
       
      const fileKey = `${input.type}/${userId}/${Date.now()}-${input.fileName}`
       const s3Key = `uploads/${getRandomString(32)}-${input.fileName}`
      const uploadUrl = `https://${env.S3_BUCKET_NAME}.r2.cloudflarestorage.com/${s3Key}`

      const s3Client = getS3Client()
      const signedUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand({
                  Bucket: env.S3_BUCKET_NAME,
                  Key: s3Key,
                  ContentType: input.fileType,
                  ContentLength: input.fileSize,
            }),
            {
                  expiresIn: 3600,
            }
      )

      return {
            s3Key,
            signedUrl,
            uploadUrl,
            fileKey,
            method: 'PUT',
            headers: {
                  'Content-Type': input.fileType,
                  'Content-Length': input.fileSize
            }
      }
})