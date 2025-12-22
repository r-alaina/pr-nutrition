import type { CollectionConfig } from 'payload'

import { protectRoles } from './hooks/protectRoles'
import user from './access/user'
import admin from './access/admin'
import { checkRole } from './access/checkRole'
import type { User } from '@/payload-types'

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // Allow public creation for admin signup with 'admin' role
    create: ({ req: { user }, data }) => {
      try {
        // If user is editor/admin, allow any role
        if (user && checkRole(['admin', 'editor'], user)) {
          return true
        }

        // For public signups, DO NOT allow 'admin' or 'editor' roles
        if (data?.roles) {
          const roles = Array.isArray(data.roles) ? data.roles : [data.roles]

          // CRITICAL SECURITY FIX:
          // Prevent public users from creating admin/editor accounts.
          // Check if any restricted role is present
          const hasRestrictedRole = roles.some((role: string) =>
            ['admin', 'editor'].includes(role)
          )

          if (hasRestrictedRole) {
            return false
          }
        }

        // Allow if only 'user' role or no roles specified
        return true
      } catch (error) {
        console.error('Users create access error:', error)
        return false
      }
    },
    read: ({ req: { user } }) => {
      try {
        if (user) {
          if (checkRole(['admin', 'editor'], user)) {
            return true
          }
          // Users can only read their own data
          return {
            id: {
              equals: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id,
            },
          }
        }
        return false
      } catch (error) {
        console.error('Users read access error:', error)
        return false
      }
    },
    update: user,
    delete: admin,
  },
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['user'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      hooks: {
        beforeChange: [protectRoles],
      },
      access: {
        update: ({ req: { user } }) => checkRole(['admin'], user as User),
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

export default Users
