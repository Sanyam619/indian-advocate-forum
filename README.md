# Indian Advocate Forum

A professional platform for Indian advocates and legal professionals built with Next.js, TypeScript, and Tailwind CSS.

![Logo](./public/logo.png)

## Features

### 🏛️ User Types & Authentication
- **Advocates**: Professional legal practitioners with experience-based pricing
- **General Users**: Legal service seekers and general public
- Simple form-based authentication (no external providers needed)
- Experience-based account tiers (5, 8, 15+ years)
- Local storage for user session management (prototype mode)

### 💳 Payment System
- **Stripe Integration**: Secure payment processing with Stripe
- Registration fees:
  - Regular Users: ₹1,000
  - Advocates: ₹5,000
- Payment verification via webhooks
- Complete payment tracking in database
- Test mode with test cards for development
- See [STRIPE_TESTING_GUIDE.md](./STRIPE_TESTING_GUIDE.md) for testing instructions

### 👤 Profile Management
- Photo upload with camera/gallery options
- Profile editing capabilities
- Different rules for advocates vs users
- Professional profile display

### 📰 News & Content
- Live political and legal news feed
- Advocates can create and share news articles
- User engagement features (likes, views, sharing)
- Category-based news organization

### 🎨 Modern Design
- Responsive design with Tailwind CSS
- Professional purple theme matching the logo
- Mobile-first approach
- Intuitive user interface

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Authentication**: Simple form-based (localStorage for prototype)
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Build Tool**: Next.js with TypeScript

## Project Structure

```
indian-advocate-forum/
├── src/
│   ├── pages/
│   │   ├── index.tsx           # Login/Signup page
│   │   ├── payment.tsx         # Payment processing
│   │   ├── profile-setup.tsx   # Initial profile setup
# Line removed - dashboard.tsx no longer exists
│   │   ├── profile.tsx         # Profile management
│   │   ├── news.tsx           # News feed & creation
│   │   └── _app.tsx           # App wrapper
│   └── styles/
│       └── globals.css        # Global styles
├── public/                    # Static assets
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- VS Code (recommended)

### Quick Setup

#### macOS
```bash
npm run setup
# or manually: chmod +x setup-mac.sh && ./setup-mac.sh
```

#### Linux (Ubuntu, Debian, CentOS, Fedora, Arch, etc.)
```bash
npm run setup-linux
# or manually: chmod +x setup-linux.sh && ./setup-linux.sh
```

#### Windows
```bash
npm install
npm run dev
```

**Detailed setup instructions:**
- **macOS**: See [MAC-SETUP.md](MAC-SETUP.md)
- **Linux**: See [LINUX-SETUP.md](LINUX-SETUP.md)
- **Windows**: Standard npm install should work

### Manual Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd indian-advocate-forum
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### For New Users
1. **Registration**: Choose between Advocate or General User
2. **Experience Selection**: (Advocates only) Select years of experience
3. **Payment**: Complete registration payment based on user type
4. **Profile Setup**: Add profile photo and complete profile
5. **Platform Access**: Navigate through the platform features

### For Advocates
- Create and share news articles
- Access professional networking features
- Higher-tier benefits and priority support
- Professional profile with bar registration details

### For General Users
- Browse and read news articles
- Basic profile management
- Access to legal resources and information

## Payment Integration

The current implementation includes:
- Dummy payment gateway for development
- Multiple payment method support
- Secure form handling
- Payment confirmation flow

**Note**: Replace with actual payment gateway (Razorpay, Stripe, etc.) for production use.

## Authentication Flow

The current implementation uses simple form-based authentication for prototype purposes:
- **Login**: Accepts any email/password combination (demo mode)
- **Signup**: Collects user information and stores locally
- **Session**: Managed via localStorage for demonstration
- **For Production**: Replace with secure authentication system (Auth0, Firebase Auth, etc.)

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Admin Panel Setup

### First-Time Admin Creation

When you first set up the codebase with an empty database, **no admin exists**. Follow these steps to create the first admin:

#### Step 1: Set Up Environment Variables
Add `MASTER_ADMIN_KEY` to your `.env` file:
```bash
MASTER_ADMIN_KEY=your-secure-random-key-here
```

#### Step 2: Create a User Account
1. Start your dev server: `npm run dev`
2. Sign up normally through the website
3. Complete your profile

#### Step 3: Make Yourself Admin
1. Open `admin-tool.html` in your browser (located in project root)
2. Enter your email address
3. Enter the `MASTER_ADMIN_KEY` from your `.env` file
4. Click "Make Admin"

#### Step 4: Access Admin Panel
Navigate to `http://localhost:3000/admin-panel` - you now have full admin access!

### Admin Panel Features
- **Role-Based Access Control**: Only users with ADMIN role can access
- **User Management**: Promote users to admin or remove admin privileges
- **Content Management**: Create, view, and delete news articles
- **Judge Management**: Add and manage judge profiles
- **Podcast Management**: Upload and manage podcast episodes

### Security Notes
- The admin panel checks your Auth0 session + database role
- `admin-tool.html` is only for initial setup (requires master key)
- After setup, use the admin panel UI for all admin operations
- Keep your `MASTER_ADMIN_KEY` secure and never commit it to version control

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- Next.js supports deployment on Netlify, AWS, Google Cloud, etc.
- Ensure environment variables are properly configured
- Build the project before deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.

## Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Indian Advocate Forum** - Connecting Legal Professionals Across India 🇮🇳⚖️