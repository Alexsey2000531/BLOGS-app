import { z } from 'zod'
export const zEnvNonemptyTrimmed = z.string().trim().min(1)

const isNotLocal = (val: string | undefined) => `${process.env.HOST_ENV}` === 'local' || !!val

export const zEnvNonemptyTrimmedRequiredOnNotLocal = zEnvNonemptyTrimmed.optional().superRefine((val, ctx) => {
  if (!isNotLocal(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Требуется на нелокальном хосте',
    })
  }
})

export const zEnvHost = z.enum(['local', 'production'])

export const zStringRequired = z
  .string({ required_error: 'Пожалуйста, заполните это' })
  .min(1, 'Пожалуйста, заполните это')

export const zStringOptional = z.string().optional()
export const zEmailRequired = zStringRequired.email()
export const zNickRequired = zStringRequired.regex(
  /^[a-z0-9-]+$/,
  'Ник может содержать только строчные буквы, цифры и -'
)
export const zStringMin = (min: number) => zStringRequired.min(min, `Текст должен быть не менее ${min} символов`)
export const zPasswordsMustBeTheSame =
  (passwordFieldName: string, passwordAgainFieldName: string) => (val: any, ctx: z.RefinementCtx) => {
    if (val[passwordFieldName] !== val[passwordAgainFieldName]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароли должны быть одинаковыми.',
        path: [passwordAgainFieldName],
      })
    }
  }
