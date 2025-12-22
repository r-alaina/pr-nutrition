import { getPayload } from 'payload'
import configPromise from '@payload-config'
import OrderTabs from './OrderTabs'

export default async function OrderStats() {
    const payload = await getPayload({ config: configPromise })

    const [pending, confirmed, completed, cancelled, total] = await Promise.all([
        payload.count({
            collection: 'orders',
            where: { status: { equals: 'pending' } },
        }),
        payload.count({
            collection: 'orders',
            where: { status: { equals: 'confirmed' } },
        }),
        payload.count({
            collection: 'orders',
            where: { status: { equals: 'completed' } },
        }),
        payload.count({
            collection: 'orders',
            where: { status: { equals: 'cancelled' } },
        }),
        payload.count({
            collection: 'orders',
        }),
    ])

    return (
        <OrderTabs
            counts={{
                pending: pending.totalDocs,
                confirmed: confirmed.totalDocs,
                completed: completed.totalDocs,
                cancelled: cancelled.totalDocs,
                total: total.totalDocs,
            }}
        />
    )
}
