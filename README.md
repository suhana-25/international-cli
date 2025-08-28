# 🚀 Nitesh Handicraft - Complete Ecommerce Solution

> **Note**: This project has been updated to use **file-based storage** instead of Supabase. All Supabase dependencies have been removed.

## 🚀 Features

### **Admin Panel**
- ✅ **Product Management**: Create, edit, delete products with multiple images
- ✅ **Banner/Featured Products**: Mark products for homepage display
- ✅ **Admin Management**: Add/remove admin users with security checks
- ✅ **Content Management**: Update contact and about us pages
- ✅ **Professional Dashboard**: Clean admin interface with instant feedback

### **User Experience**
- ✅ **Authentication**: Email/password and Google OAuth
- ✅ **Product Display**: Homepage banner, catalog, detailed product pages
- ✅ **Shopping Cart**: Persistent cart with quantity management
- ✅ **Professional UI**: Responsive design with modern aesthetics

### **Business Features**
- ✅ **Invoice Generation**: "Nitesh Handicraft" branded invoices
- ✅ **PDF Download**: Professional invoice PDFs
- ✅ **Order Management**: Complete order tracking system
- ✅ **Content Management**: Dynamic contact and about pages

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with Google OAuth
- **UI**: Tailwind CSS with shadcn/ui components
- **Styling**: CSS Modules and Tailwind CSS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-pg-shadcn-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/nitesh_handicraft"
   AUTH_SECRET="your-secret-here"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔐 Authentication

### **Development Credentials**

**Admin Login:**
- Email: `admin@niteshhandicraft.com`
- Password: `admin123`

**User Login:**
- Email: `user@example.com`
- Password: `user123`

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Public pages
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/             # React components
│   ├── shared/            # Shared components
│   └── ui/                # UI components
├── lib/                   # Utility functions
│   ├── actions/           # Server actions
│   └── utils.ts           # Utility functions
├── db/                    # Database schema
└── types/                 # TypeScript types
```

## 🎯 Key Features

### **Product Management**
- Multiple image upload with preview
- Drag & drop image interface
- Banner and featured product controls
- Real-time slug validation
- Professional admin dashboard

### **User Experience**
- Responsive design for all devices
- Professional product galleries
- Persistent shopping cart
- Role-based authentication
- Google OAuth integration

### **Business Features**
- Professional invoice generation
- PDF download functionality
- Content management system
- Admin user management
- Order tracking system

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel
- Netlify
- Railway
- DigitalOcean App Platform

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for Nitesh Handicraft**