import type { CollectionConfig } from 'payload';
import { protectRoles } from './hooks/protectRoles';
import editor from './access/editor';
import user from './access/user';
import admin from './access/admin';
import { checkRole } from './access/checkRole';
import type { User } from '@/payload-types'



const Users: CollectionConfig = {
  slug: 'users',
  access : {
  create: editor,
  read: user,
  update: user,
  delete: admin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media', // make sure you have a 'media' collection
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['user'],
      options: [
        { label: 'Admin',  value: 'admin'  },
        { label: 'Editor', value: 'editor' },
        { label: 'User',   value: 'user'   },
      ],
      hooks: {
        beforeChange: [protectRoles]
      },
      access: {
        update: ({req: {user}}) => checkRole(['admin'], user as User)
      }
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};

export default Users;