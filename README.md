# PR Nutrition - Meal Prep Ordering System

A comprehensive meal prep ordering system built with Next.js 15, PayloadCMS 3.0, and PostgreSQL. This application provides a complete solution for customers to select dietary tiers, customize meal preferences, and place orders with tier-based subscription pricing.

## 🚀 Features

### Customer Features
- **Tier-Based Meal Selection**: Choose from different calorie tiers (Pink, Blue, Green, Purple)
- **Subscription Management**: Weekly or monthly meal plans
- **Preference Setup**: 6-step onboarding for dietary restrictions, allergies, and meal preferences
- **Meal Customization**: Select specific meals and quantities based on your plan
- **Order Tracking**: View order history and status
- **Account Management**: Update preferences and profile information

### Admin Features
- **Order Management**: View and manage all customer orders
- **Menu Management**: Add/edit menu items with tier-based pricing
- **Customer Management**: View customer profiles and preferences
- **Tier Configuration**: Set up pricing for different dietary tiers
- **Order Status Tracking**: Update order status (pending → confirmed → preparing → ready → completed)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: PayloadCMS 3.0
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS 4.0
- **Authentication**: PayloadCMS built-in auth
- **Package Manager**: pnpm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.20.2 or higher (or 20.9.0+)
- **pnpm**: Version 9 or 10
- **PostgreSQL**: Version 12 or higher
- **Git**: For cloning the repository

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pr-nutrition
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URI=postgresql://username:password@localhost:5432/pr_nutrition

# PayloadCMS
PAYLOAD_SECRET=your-secret-key-here
PAYLOAD_CONFIG_PATH=src/payload.config.ts

# Next.js
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Optional: Payload Cloud
PAYLOAD_CLOUD_EMAIL=your-email@example.com
PAYLOAD_CLOUD_PASSWORD=your-password
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker run --name pr-nutrition-postgres \
  -e POSTGRES_DB=pr_nutrition \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

#### Option B: Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database named `pr_nutrition`
3. Update the `DATABASE_URI` in your `.env` file

### 5. Generate Types

```bash
pnpm run generate:types
```

### 6. Start the Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Collections

- **Users**: Admin and editor accounts
- **Customers**: Customer profiles and preferences
- **MenuItems**: Meal items with pricing
- **Tiers**: Dietary tiers with subscription pricing
- **Orders**: Customer orders and order items
- **DietaryRestrictions**: Available dietary restrictions
- **WeeklyMenus**: Weekly menu planning
- **Media**: File uploads and images

### Key Relationships

- Customers have a tier relationship
- Orders belong to customers and contain menu items
- Menu items can have tier-based pricing
- Orders track subscription frequency and meal preferences

## 🎯 User Flows

### New Customer Flow
1. **Home Page** → View available tiers and pricing
2. **Order Now** → 6-step preference setup
3. **Preferences Success** → Confirmation of saved preferences
4. **Meal Selection** → Choose meals and quantities
5. **Order Success** → Order confirmation and receipt

### Existing Customer Flow
1. **Home Page** → View current plan
2. **Meal Selection** → Choose meals for current week
3. **Order Success** → Order confirmation

### Admin Flow
1. **Admin Panel** (`/admin`) → Access to all collections
2. **Orders Management** → View and update order status
3. **Menu Management** → Add/edit menu items
4. **Customer Management** → View customer profiles

## 🔧 Available Scripts

```bash
# Development
pnpm run dev              # Start development server
pnpm run devsafe         # Clean build and start dev server

# Building
pnpm run build           # Build for production
pnpm run start           # Start production server

# Database
pnpm run generate:types  # Generate TypeScript types
pnpm run payload         # Access Payload CLI

# Testing
pnpm run test            # Run all tests
pnpm run test:int        # Run integration tests
pnpm run test:e2e        # Run end-to-end tests

# Linting
pnpm run lint            # Run ESLint
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing pages
│   │   ├── (auth)/          # Authenticated pages
│   │   ├── (account)/       # Account management
│   │   ├── components/      # Shared components
│   │   ├── api/            # API routes
│   │   └── globals.css     # Global styles
│   └── (payload)/          # PayloadCMS admin
├── collections/            # PayloadCMS collections
├── utilities/             # Helper functions
└── payload.config.ts      # PayloadCMS configuration
```

## 🎨 Styling

This project uses **Tailwind CSS 4.0** with custom brand colors:

- **Primary Green**: `#5CB85C`
- **Hover Green**: `#4A9D4A`
- **Orange Accent**: `#F7931E`
- **Text Colors**: Various gray shades

## 🔐 Authentication

- **Admin Access**: `/admin` (PayloadCMS admin panel)
- **Customer Authentication**: Built-in PayloadCMS auth
- **Protected Routes**: Account settings, meal selection, order history

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run specific test suites
pnpm run test:int    # Integration tests
pnpm run test:e2e    # End-to-end tests with Playwright
```

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URI=your-production-database-url
PAYLOAD_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-nextauth-secret
```

### Build and Deploy

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check your `DATABASE_URI` in `.env`
   - Verify database credentials

2. **Type Generation Issues**
   - Run `pnpm run generate:types` after database setup
   - Ensure PayloadCMS can connect to the database

3. **Build Issues**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && pnpm install`

4. **Port Already in Use**
   - Change the port in `package.json` scripts
   - Kill existing processes on port 3000

### Getting Help

- Check the [PayloadCMS Documentation](https://payloadcms.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Open an issue in this repository

## 🙏 Acknowledgments

- Built with [PayloadCMS](https://payloadcms.com)
- Powered by [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Database powered by [PostgreSQL](https://postgresql.org)