# SaaS Template Features Documentation

## Overview
This is a comprehensive SaaS template built with Next.js 15, TypeScript, and modern web technologies. The template provides a complete foundation for building subscription-based applications with authentication, payments, and premium features.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth
- **Payments**: Stripe (subscriptions & one-time payments)
- **Email**: Resend with React Email
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Caching**: Upstash Redis

## Core Features

### 1. Authentication System
**Location**: `src/lib/features/auth/`

Complete authentication system with multiple sign-in options:
- **Email/Password Login**: Traditional email and password authentication
- **Google OAuth**: Social login with Google integration
- **Password Reset**: Secure password recovery via email
- **User Registration**: Account creation with email verification
- **Auth Guards**: Route protection for authenticated users
- **Session Management**: Persistent sessions with Supabase

**Key Components**:
- Login form with validation
- Signup form with terms acceptance
- Password reset functionality
- Social authentication buttons
- Auth state management hooks

### 2. Payment Processing
**Location**: `src/lib/actions/checkout-session.ts`, `src/app/api/webhooks/stripe/`

Full Stripe integration for subscription-based revenue:
- **Stripe Checkout**: Hosted checkout sessions for payments
- **Subscription Management**: Recurring billing with Stripe subscriptions
- **Customer Management**: Automatic Stripe customer creation and linking
- **Webhook Processing**: Real-time payment status updates
- **Price Flexibility**: Support for multiple pricing tiers
- **Payment Security**: PCI compliant payment processing

**Payment Flow**:
1. User selects subscription plan
2. Checkout session created with Stripe
3. User completes payment on Stripe-hosted page
4. Webhook confirms payment and activates subscription
5. User gains access to premium features

### 3. Database Management
**Location**: `src/lib/db/`, `drizzle/`

Modern database setup with type safety:
- **Drizzle ORM**: Type-safe database queries and schema management
- **PostgreSQL**: Robust relational database
- **Schema Versioning**: Database migrations with version control
- **Account Management**: User account storage and tracking
- **Welcome Email Tracking**: Prevents duplicate welcome emails

**Database Schema**:
```typescript
accounts: {
  id: serial (primary key)
  userId: varchar (unique, from Supabase)
  createdAt: timestamp
  updatedAt: timestamp
  welcomeEmailSent: boolean
}
```

### 4. Email System
**Location**: `src/lib/actions/send-welcome-email.ts`, `src/lib/emails/`

Automated email workflows with React components:
- **Welcome Emails**: Branded welcome messages for new users
- **React Email Templates**: HTML emails built with React components
- **Delivery Tracking**: Prevents duplicate email sends
- **Resend Integration**: Reliable email delivery service
- **Template System**: Reusable email components

### 5. Premium Dashboard
**Location**: `src/lib/features/premium/premium.tsx`

Feature-rich dashboard for premium subscribers:
- **Usage Analytics**: Visual progress bars and metrics
- **Performance Metrics**: Key statistics and growth indicators
- **Quick Actions**: Shortcut buttons for common tasks
- **Tabbed Interface**: Organized sections (Overview, Analytics, Team, Settings)
- **Responsive Design**: Mobile-friendly dashboard layout
- **Premium Feature Highlights**: Showcase of exclusive features

**Dashboard Sections**:
- Activity Overview with usage percentages
- Premium feature access indicators
- Performance metrics with trend indicators
- Quick action buttons for common tasks

### 6. State Management
**Location**: `src/lib/store/counter-store.ts`

Zustand-based state management:
- **Global State**: Shared state across components
- **Type Safety**: TypeScript interfaces for state
- **Simple API**: Easy-to-use store actions
- **Performance**: Minimal re-renders with selective subscriptions

### 7. UI Component Library
**Location**: `src/lib/components/ui/`

Comprehensive component system built on shadcn/ui:
- **40+ Components**: Buttons, forms, dialogs, navigation, data display
- **Accessibility**: ARIA compliant components
- **Theming**: Dark/light mode support
- **Customizable**: Tailwind-based styling system
- **Radix Primitives**: Headless UI components for complex interactions

**Component Categories**:
- Form components (Input, Button, Select, Checkbox)
- Layout components (Card, Separator, Tabs)
- Feedback components (Alert, Dialog, Toast)
- Navigation components (Dropdown, Command, Breadcrumb)
- Data display (Table, Badge, Avatar, Progress)

### 8. User Management
**Location**: `src/lib/actions/`

Administrative functions for user lifecycle:
- **User Creation**: Account setup with database integration
- **User Retrieval**: Query user information
- **User Deletion**: Account cleanup functionality
- **Subscription Checking**: Premium status verification
- **Welcome Email Automation**: Onboarding email workflow

### 9. Subscription Management
**Location**: `src/lib/actions/check-subscription.ts`

Real-time subscription status tracking:
- **Active Subscription Detection**: Check if user has active premium plan
- **Stripe Integration**: Direct Stripe API communication
- **Caching**: Redis-based caching for performance
- **User-Based Lookup**: Subscription status by user ID

### 10. Theme System
**Location**: `src/lib/components/theme-wrapper.tsx`

Flexible theming and styling:
- **Dark/Light Mode**: System preference detection
- **Custom Colors**: Brand color system with CSS variables
- **Typography Scale**: Consistent text sizing
- **Shadow System**: Layered shadow utilities
- **Responsive Design**: Mobile-first approach

## File Structure Overview

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (webhooks, auth callbacks)
│   ├── auth/              # Authentication pages
│   └── premium/           # Premium feature pages
├── lib/
│   ├── actions/           # Server actions (payments, email, users)
│   ├── components/        # Reusable UI components
│   ├── db/               # Database schema and connection
│   ├── features/         # Feature-specific components
│   ├── stripe/           # Payment processing utilities
│   ├── supabase/         # Authentication utilities
│   └── store/            # State management
```

## Environment Setup

Required environment variables for full functionality:
- `SUPABASE_URL` & `SUPABASE_ANON_KEY`: Authentication
- `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`: Payments
- `RESEND_API_KEY` & `RESEND_FROM`: Email delivery
- `UPSTASH_REDIS_URL`: Caching and session storage
- `DATABASE_URL`: PostgreSQL connection

## Development Workflow

1. **Database Setup**: Run migrations with `yarn db:migrate`
2. **Development Server**: Start with `yarn dev`
3. **Stripe Testing**: Use `yarn stripe` for webhook testing
4. **Database Management**: Use `yarn db:studio` for data visualization

## Security Features

- CSRF protection via Next.js
- Input validation with Zod schemas
- Secure password handling via Supabase
- PCI compliant payments via Stripe
- Environment variable protection
- Authentication middleware for protected routes

This template provides a production-ready foundation for SaaS applications with modern development practices, comprehensive feature set, and scalable architecture. 