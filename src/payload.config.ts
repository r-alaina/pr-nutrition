// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import Users from './collections/Users/config'
import { Customers } from './collections/Customers/config'
import { MenuItems } from './collections/MenuItems/config'
import { Tiers } from './collections/Tiers/config'
import { WeeklyMenus } from './collections/WeeklyMenus/config'
import { Orders } from './collections/Orders/config'
import { KitchenOrders } from './collections/KitchenOrders/config'
import { OrderLogs } from './collections/OrderLogs/config'

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
  collections: [Users, Customers, MenuItems, Tiers, WeeklyMenus, Orders, KitchenOrders, OrderLogs],
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
