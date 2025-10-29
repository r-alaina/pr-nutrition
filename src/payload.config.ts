// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import Users from './collections/Users/config'
import { Media } from './collections/Media'
import { Customers } from './collections/Customers/config'
import { MenuItems } from './collections/MenuItems/config'
import { Tiers } from './collections/Tiers/config'
import { DietaryRestrictions } from './collections/DietaryRestrictions/config'
import { WeeklyMenus } from './collections/WeeklyMenus/config'
import { Orders } from './collections/Orders/config'
import { KitchenOrders } from './collections/KitchenOrders/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- PR Meal Preps Admin',
    },
  },
  collections: [
    Users,
    Media,
    Customers,
    MenuItems,
    Tiers,
    DietaryRestrictions,
    WeeklyMenus,
    Orders,
    KitchenOrders,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
