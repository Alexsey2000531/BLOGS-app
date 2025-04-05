import { trpc } from '../../lib/trpc'

export const useUploadFile = (type: 'avatar' | 'image') => {
  const prepareR2Upload = trpc.prepareS3Upload.useMutation()
  const updateFileUrl = trpc.updateFile.useMutation()

  const uploadToR2 = async (file: File) => {
    const { uploadUrl, fileKey } = await prepareR2Upload.mutateAsync({
      type: type,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    })

    // eslint-disable-next-line no-undef
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })

    const { fileUrl } = await updateFileUrl.mutateAsync({ fileKey, type })

    return { fileUrl }
  }

  return { uploadToR2 }
}
