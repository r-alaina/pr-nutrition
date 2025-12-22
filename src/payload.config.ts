// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import Users from './collections/Users/config'
import { Customers } from './collections/Customers/config'
import { MenuItems } from './collections/MenuItems/config'
import { Tiers } from './collections/Tiers/config'
import { DietaryRestrictions } from './collections/DietaryRestrictions/config'
import { Orders } from './collections/Orders/config'
import { KitchenOrders } from './collections/KitchenOrders/config'
import { OrderLogs } from './collections/OrderLogs/config'
import { WeeklyMenu } from './collections/WeeklyMenu/config'
import { Challenges } from './collections/Challenges/config'
import { ChallengeParticipants } from './collections/ChallengeParticipants/config'
import { LogoutButton } from './components/LogoutButton'
import { AdminStyles } from './components/AdminStyles'

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
    components: {
      afterNavLinks: [LogoutButton as any, AdminStyles as any],
    },
  },
  collections: [
    WeeklyMenu,
    MenuItems,
    Orders,
    KitchenOrders,
    Users,
    Customers,
    Tiers,
    OrderLogs,
    DietaryRestrictions,
    Challenges,
    ChallengeParticipants,
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
  email: resendAdapter({
    defaultFromAddress: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    defaultFromName: 'PR Nutrition',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
