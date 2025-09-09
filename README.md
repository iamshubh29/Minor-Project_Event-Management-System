# Student Registration Dashboard 

A comprehensive QR-based attendance tracking system for placement cell activities at Rajasthan Technical University (RTU).

## 🚀 Features

- **Student Registration**: Complete student profile registration with academic details
- **QR Code System**: Unique QR codes for each student for attendance tracking
- **Admin Dashboard**: Core team management interface for tracking attendance
- **Student Dashboard**: Students can view their attendance history and records
- **QR Scanner**: Real-time QR code scanning for attendance marking
- **Email System**: Automated email invitations and notifications
- **Event Management**: Track multiple placement events and activities

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Email**: Nodemailer
- **QR Code**: html5-qrcode, qrcode.react
- **UI Components**: shadcn/ui

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamshubh29/Minor-Project_Event-Management-System.git
   cd Minor-Project_Event-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── ...
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
├── models/               # Database models
├── mail/                 # Email templates
└── public/               # Static assets
```

## 🎯 Key Pages

- `/` - Landing page
- `/student-register` - Student registration
- `/login` - Admin login
- `/dashboard` - Core team dashboard
- `/student-dashboard` - Student dashboard
- `/admin/scanner` - QR code scanner
- `/send-mail` - Email invitation system

## 📊 Database Models

- **Students**: Student profiles with attendance tracking
- **Events**: Placement events and activities
- **Users**: Admin user management

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Developed By

Placement Team - RTU Kota

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.
