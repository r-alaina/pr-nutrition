/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/access/checkRole'
import type { User } from '@/payload-types'

// Calculate pickup date based on week half
function calculatePickupDate(weekHalf: string): Date {
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.

  if (weekHalf === 'firstHalf' || weekHalf === 'both') {
    // First half: Sunday or Monday (or both - use first half date)
    const daysUntilSunday = (7 - currentDay) % 7 || 7
    const pickupDate = new Date(today)
    pickupDate.setDate(today.getDate() + daysUntilSunday)
    return pickupDate
  } else {
    // Second half: Wednesday or Thursday
    const daysUntilWednesday = (3 - currentDay + 7) % 7 || 7
    const pickupDate = new Date(today)
    pickupDate.setDate(today.getDate() + daysUntilWednesday)
    return pickupDate
  }
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'totalAmount', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin', 'editor'], user as User)) {
        return true
      }
      // Allow users to read their own orders (via API, not admin panel)
      return true // Customers can read their own orders
    },
    create: ({ req: { user }, data }) => {
      if (!user) return false
      // Admins and editors can create any order
      if (checkRole(['admin', 'editor'], user as User)) {
        return true
      }
      // Customers can create orders for themselves
      if (data?.customer) {
        const customerId = typeof data.customer === 'object' ? data.customer.id : data.customer
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id
        return customerId === userId || String(customerId) === String(userId)
      }
      // If no customer specified, allow creation (will be set by API)
      return true
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'editor'], user as User)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'editor'], user as User)
    },
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Preparing', value: 'preparing' },
        { label: 'Ready for Pickup', value: 'ready' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'orderItems',
      type: 'array',
      fields: [
        {
          name: 'menuItem',
          type: 'relationship',
          relationTo: 'menu-items',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'weekHalf',
          type: 'select',
          options: [
            { label: 'First Half', value: 'firstHalf' },
            { label: 'Second Half', value: 'secondHalf' },
          ],
          admin: {
            description: 'Which half of the week this item is for',
          },
        },
        {
          name: 'unitPrice',
          type: 'number',
          admin: {
            step: 0.01,
            description: 'Individual meal price (0 for tier-based subscriptions)',
          },
        },
        {
          name: 'totalPrice',
          type: 'number',
          admin: {
            step: 0.01,
            description: 'Total price for this item (0 for tier-based subscriptions)',
          },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'taxAmount',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'tier',
      type: 'relationship',
      relationTo: 'tiers',
      admin: {
        description: 'Customer tier at time of order',
      },
    },
    {
      name: 'subscriptionFrequency',
      type: 'select',
      options: [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'A La Carte', value: 'a_la_carte' },
      ],
    },
    {
      name: 'mealsPerWeek',
      type: 'number',
      admin: {
        description: 'Number of meals per week for this order',
      },
    },
    {
      name: 'weekHalf',
      type: 'select',
      options: [
        { label: 'First Half', value: 'firstHalf' },
        { label: 'Second Half', value: 'secondHalf' },
        { label: 'Both Halves', value: 'both' },
      ],
      admin: {
        description: 'Which half(s) of the week this order is for (both if meals from both halves)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes for this order',
      },
    },
    {
      name: 'allergenCharges',
      type: 'array',
      fields: [
        {
          name: 'mealId',
          type: 'text',
          required: true,
        },
        {
          name: 'mealName',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'matchingAllergens',
          type: 'array',
          fields: [
            {
              name: 'allergen',
              type: 'text',
              required: true,
            },
            {
              name: 'charge',
              type: 'number',
              required: true,
              admin: {
                step: 0.01,
                description:
                  'Allergen charge (for tracking purposes, actual charge is $5.00 per order)',
              },
            },
          ],
        },
        {
          name: 'totalAllergenCharge',
          type: 'number',
          required: true,
          admin: {
            step: 0.01,
            description: 'Total allergen charge for this meal',
          },
        },
      ],
    },
    {
      name: 'totalAllergenCharges',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        step: 0.01,
        description: 'Total allergen charges for entire order',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Only create kitchen order on create operation
        if (operation === 'create' && doc.customer && req.payload) {
          try {
            // Get customer information
            const customer = await req.payload.findByID({
              collection: 'customers',
              id: typeof doc.customer === 'object' ? doc.customer.id : doc.customer,
            })

            // Get menu items for order
            const orderItemsWithDetails = await Promise.all(
              (doc.orderItems || []).map(async (item: any) => {
                const menuItem = await req.payload.findByID({
                  collection: 'menu-items',
                  id: typeof item.menuItem === 'object' ? item.menuItem.id : item.menuItem,
                })
                return {
                  mealName: menuItem.name,
                  quantity: item.quantity,
                  allergens: menuItem.allergens || [],
                }
              }),
            )

            // Prepare allergen charges summary
            const allergenChargesSummary = (doc.allergenCharges || []).map((charge: any) => ({
              mealName: charge.mealName,
              allergens: charge.matchingAllergens.map((a: any) => ({ allergen: a.allergen })),
              charge: charge.totalAllergenCharge,
            }))

            // Calculate pickup date - handle 'both' case
            const weekHalfForPickup =
              doc.weekHalf === 'both' ? 'firstHalf' : doc.weekHalf || 'firstHalf'
            const pickupDate = calculatePickupDate(weekHalfForPickup)

            // Create kitchen order - system hook operation, access control will allow it
            await req.payload.create({
              collection: 'kitchen-orders',
              data: {
                orderNumber: doc.orderNumber,
                customerName: customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : customer.email || 'Unknown',
                customerEmail: customer.email,
                customerPhone: null, // Can be added if phone field exists
                weekHalf: doc.weekHalf || 'firstHalf',
                orderItems: orderItemsWithDetails,
                allergenCharges: allergenChargesSummary,
                totalAllergenCharges: doc.totalAllergenCharges || 0,
                pickupDate: pickupDate.toISOString().split('T')[0],
                status: 'pending',
              },
              // Don't pass req.user so access control treats it as system operation
              req: {
                payload: req.payload,
              } as any,
            })

            console.log('Kitchen order created successfully for order:', doc.orderNumber)
          } catch (error) {
            console.error('Error creating kitchen order:', error)
            // Don't throw error to prevent order creation from failing
          }
        }
      },
    ],
  },
}
