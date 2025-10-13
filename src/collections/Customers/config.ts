import type { CollectionConfig } from 'payload'
import { getServerSideURL } from '@/utilities/getServerSideURL'

export const Customers: CollectionConfig = {
  slug: 'customers',

  auth: {
    tokenExpiration: 12 * 60 * 60, // 12 hours

    verify: {
      generateEmailSubject: ({ user }) => {
        return `Hey ${user?.firstName ? user.firstName : user?.email}, verify your email address!`
      },
      generateEmailHTML: ({ user, token }) => {
        return `
          <div>
            <h1>Hey ${user?.firstName ? user.firstName : user?.email}!</h1>
            <p>
              Verify your email address by visiting:
              <a href="${getServerSideURL()}/verify?token=${token}">
                ${getServerSideURL()}/verify?token=${token}
              </a>
            </p>
          </div>
        `
      },
    },

    forgotPassword: {
      // Use optional args + chaining to prevent TS issues
      generateEmailSubject: (args?: { user?: any }) => {
        return `Hey ${args?.user?.firstName ? args.user.firstName : args?.user?.email}! Reset your password.`
      },
      generateEmailHTML: (args?: { user?: any; token?: string }) => {
        return `
          <div>
            <h1>Hey ${args?.user?.firstName ? args.user.firstName : args?.user?.email}!</h1>
            <p>
              You (or someone else) requested to reset your password. If this wasn't you, you can safely ignore this email.
              Otherwise, reset your password by visiting:
              <a href="${getServerSideURL()}/password-reset?token=${args?.token}">
                ${getServerSideURL()}/password-reset?token=${args?.token}
              </a>
            </p>
          </div>
        `
      },
    },

    cookies: {
      secure: true,
      sameSite: 'None',
      domain: process.env.COOKIE_DOMAIN,
    },
  },

  admin: {
    useAsTitle: 'firstName',
  },

  access: {
    create: () => true,
    admin: () => false,
  },

  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
      ],
    },
    {
      name: 'tier',
      type: 'radio',
      interfaceName: 'tierProps',
      options: ['Free', 'Basic', 'Pro', 'Enterprise'],
      defaultValue: 'Free',
    },
  ],
}
