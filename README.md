# Event Management System - RTU Kota

A comprehensive QR-based attendance tracking and event management system for Rajasthan Technical University (RTU) Kota. This system streamlines event registration, attendance tracking, and communication for various university events and activities.

## 🚀 Features

### 📝 **Registration & Management**
- **Student Registration**: Complete student profile registration with academic details
- **Core Team Registration**: Admin user registration and management
- **Event Management**: Create, manage, and track multiple events
- **User Authentication**: Secure JWT-based authentication system

### 📱 **QR Code System**
- **Unique QR Codes**: Generate unique QR codes for each student
- **Real-time Scanning**: Live QR code scanning for attendance marking
- **Mobile Responsive**: Works seamlessly on mobile devices
- **Quick Check-in**: Instant attendance marking with QR codes

### 📊 **Dashboard & Analytics**
- **Admin Dashboard**: Comprehensive management interface with statistics
- **Student Dashboard**: Personal dashboard for students to view their records
- **Attendance Tracking**: Real-time attendance monitoring and reporting
- **Data Export**: Download attendance data in Excel/CSV format

### 📧 **Communication System**
- **Email Notifications**: Automated registration confirmations
- **Reminder System**: Send event reminders to all registered students
- **WhatsApp Integration**: Direct WhatsApp group links for communication
- **Custom Email Templates**: Professional RTU-branded email templates

### 🎯 **Event Features**
- **Event Creation**: Create and manage multiple events
- **Attendance Management**: Track attendance for specific events
- **Bulk Operations**: Send reminders and notifications to all participants
- **Data Analytics**: View attendance statistics and reports

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components, shadcn/ui
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with secure session management
- **Email**: Nodemailer with custom HTML templates
- **QR Code**: html5-qrcode, qrcode.react
- **Data Export**: ExcelJS for Excel file generation
- **Date Handling**: date-fns for date formatting and manipulation
- **UI Components**: Lucide React icons, Sonner for notifications

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
   NEXT_PUBLIC_APP_URL=http://localhost:3000
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

### **Public Pages**
- `/` - Landing page with RTU branding
- `/student-register` - Student event registration
- `/login` - Admin login page

### **Student Pages**
- `/student-dashboard` - Student personal dashboard with QR code and attendance history

### **Admin Pages**
- `/dashboard` - Core team dashboard
- `/admin/scanner` - QR code scanner and event management
- `/admin/scanner/review` - Student review and data management
- `/send-mail` - Email invitation system
- `/send-reminder` - Event reminder system

### **Utility Pages**
- `/scan/[userId]` - QR code scanning endpoint
- `/Student-Attendance` - Attendance tracking page

## 📊 Database Models

### **Students Collection**
- **Profile Data**: Name, email, roll number, university roll number, branch, year
- **Academic Info**: CGPA, backlogs, phone number, domains of interest
- **Event Data**: Event name, registration details, QR code
- **Attendance**: Array of attendance records with dates and status
- **Review System**: Review scores and comments for evaluation

### **Events Collection**
- **Event Details**: Event name, date, creation timestamp
- **Management**: Event creation, deletion, and tracking

### **Users Collection**
- **Admin Users**: Core team member profiles
- **Authentication**: Login credentials and session management
- **Permissions**: Admin access control

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Key Features Explained

### **QR Code System**
- Each student gets a unique QR code upon registration
- QR codes contain direct links to attendance marking
- Real-time scanning with instant feedback
- Mobile-optimized for easy scanning

### **Email System**
- **Registration Emails**: Sent automatically with QR code and dashboard link
- **Reminder Emails**: Bulk reminders for upcoming events
- **Attendance Confirmations**: Thank you emails after attendance marking
- **WhatsApp Integration**: Direct group join links in emails

### **Admin Features**
- **Event Management**: Create, delete, and manage events
- **Attendance Tracking**: Real-time attendance monitoring
- **Data Export**: Download attendance data in Excel format
- **Bulk Operations**: Send reminders to all registered students
- **Student Search**: Search by roll number or email

### **Student Features**
- **Personal Dashboard**: View attendance history and QR code
- **Event Registration**: Easy registration for events
- **WhatsApp Group**: Direct access to event communication
- **Profile Management**: Update personal information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Use Cases

### **University Events**
- **Workshops**: Technical and non-technical workshops
- **Seminars**: Guest lectures and educational seminars
- **Competitions**: Coding competitions and hackathons
- **Cultural Events**: Festivals and cultural activities
- **Placement Drives**: Company recruitment events

### **Benefits**
- **Efficiency**: Quick and accurate attendance tracking
- **Automation**: Reduced manual work with automated emails
- **Communication**: Easy communication through WhatsApp groups
- **Analytics**: Detailed attendance reports and statistics
- **Scalability**: Handle multiple events and large student groups

## 🚀 Deployment

### **Vercel Deployment**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### **Environment Variables for Production**
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📸 Screenshots

*Note: Add screenshots of key pages and features here*

## 🔄 Recent Updates

- ✅ **WhatsApp Integration**: Added WhatsApp group links in emails and dashboard
- ✅ **Reminder System**: Implemented bulk email reminders for events
- ✅ **Excel Export**: Added data export functionality for attendance reports
- ✅ **Enhanced UI**: Improved user interface with better styling and responsiveness
- ✅ **Email Templates**: Professional RTU-branded email templates
- ✅ **Search Functionality**: Enhanced search by roll number and email
- ✅ **Event Management**: Complete event creation and management system

## 👥 Developed By

**Event Management System - Rajasthan Technical University, Kota**

## 📞 Support

For support, create an issue in the repository or contact the development team.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
