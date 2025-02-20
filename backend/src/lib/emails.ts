import { promises as fs } from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { type Post, type User } from '@prisma/client'
import Handlebars from 'handlebars'
import _ from 'lodash'
import { env } from './env'

const getHbrTemplates = _.memoize(async () => {
  const htmlPathsPattern = path.resolve(__dirname, '../emails/dist/**/*.html')
  const htmlPaths = fg.sync(htmlPathsPattern)
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {}
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html')
    const htmlTemplate = await fs.readFile(htmlPath, 'utf8')
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate)
  }
  return hbrTemplates
})

const getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates()
  const hbrTemplate = hbrTemplates[templateName]
  const html = hbrTemplate(templateVariables)
  return html
}

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string
  subject: string
  templateName: string
  templateVariables?: Record<string, any>
}) => {
  try {
    const fullTemplateVaraibles = {
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    }
    const html = await getEmailHtml(templateName, fullTemplateVaraibles)
    console.info('sendEmail', {
      to,
      subject,
      templateName,
      fullTemplateVaraibles,
      html,
    })
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false }
  }
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Спасибо за регистрацию!',
    templateName: 'Добро пожаловать',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: `${env.WEBAPP_URL}/posts/new`,
    },
  })
}

export const sendPostBlockedEmail = async ({ user, post }: { user: Pick<User, 'email'>; post: Pick<Post, 'nick'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Твоя идея заблокирована!',
    templateName: 'postBlocked',
    templateVariables: {
      postNick: post.nick,
    },
  })
}
