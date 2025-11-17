# Job Portal Application

A modern job portal built with React 18, Vite, and Bootstrap 5, featuring advanced search capabilities, rich text editing, and comprehensive candidate management.

## ✨ Features

### 🔍 Advanced Job Search
- **Real-time Search**: Debounced search across job titles, descriptions, and locations
- **Advanced Filters**: 
  - Filter by location (dropdown with auto-populated locations)
  - Salary range filtering (min/max)
  - Toggle advanced filters panel
- **Smart Sorting**: 6 sorting options (newest, oldest, title A-Z/Z-A, salary high/low)
- **Live Job Count**: Badge showing number of matching results
- **Search Icon**: Visual search indicator with responsive layout

### 📝 Rich Job Posting
- **Rich Text Editor**: Create detailed job descriptions using React Quill
  - Headings, bold, italic, underline, strike-through
  - Ordered and bulleted lists
  - Links and formatting cleanup
- **Toast Notifications**: Beautiful success/error messages replacing alerts
- **Loading States**: Visual feedback during form submission

### 📄 Resume Management
- **Resume Upload**: PDF file upload (max 5MB) during application
- **File Validation**: Client-side validation for file type and size
- **File Preview**: Shows selected file name and size
- **Secure Storage**: Backend integration ready for file handling

### 🎯 Application Management
- **Withdraw Applications**: Candidates can withdraw pending applications
- **Status Badges**: Visual status indicators (Pending, Accepted, Rejected)
- **Confirmation Dialogs**: Prevent accidental withdrawals

### 📊 Candidate Export
- **CSV Export**: Export all candidate data to CSV file
- **One-Click Download**: Automatic file download with timestamped filename
- **Comprehensive Data**: Includes all application details and resume paths
- **Loading States**: Visual feedback during export

### 🎨 UI/UX Enhancements
- **Toast Notifications**: React Hot Toast for all user feedback
- **Skeleton Loaders**: Professional loading states with shimmer animation
- **Responsive Design**: Mobile-first design with Bootstrap 5
- **Accessibility**: ARIA attributes, semantic HTML, keyboard navigation
- **Loading Spinners**: On buttons during async operations

### 🏗️ Architecture
- **API Layer**: Centralized API communication (`utils/api.js`)
- **Custom Hooks**: `useFetch`, `useDebounce`, `useLocalStorage`
- **Constants Management**: Application-wide constants
- **Error Handling**: Consistent error handling across all API calls

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+ (for backend)

### Frontend Setup
```bash
cd frontend/job-app
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Note**: Backend implementation required for new features (see `backend/BACKEND_UPDATES.md`)

## 📦 Dependencies

### Frontend
- **React 18**: UI framework
- **React Router v6**: Client-side routing
- **Bootstrap 5**: Responsive UI components
- **React Quill**: Rich text editor
- **React Hot Toast**: Toast notifications
- **Vite**: Build tool and dev server

### Backend
- **Flask 3.0.0**: Web framework
- **Flask-CORS**: CORS handling
- **Flask-SQLAlchemy**: ORM
- **Flask-Mail**: Email notifications (ready for future use)
- **Werkzeug**: File upload handling

## 📁 Project Structure

```
frontend/job-app/
├── src/
│   ├── components/
│   │   └── SkeletonLoader.jsx    # Loading state components
│   ├── hooks/
│   │   ├── useFetch.js           # Data fetching hook
│   │   ├── useDebounce.js        # Search debouncing
│   │   └── useLocalStorage.js    # Local storage management
│   ├── templates/
│   │   ├── Apply.jsx             # Job application with resume upload
│   │   ├── CandidateList.jsx     # Candidate management & CSV export
│   │   ├── Dashboard.jsx         # User dashboard
│   │   ├── JobForm.jsx           # Rich text job posting
│   │   ├── JobSearch.jsx         # Advanced search interface
│   │   ├── MyApplications.jsx    # Application tracking & withdrawal
│   │   └── ...
│   ├── utils/
│   │   ├── api.js                # API communication layer
│   │   └── constants.js          # Application constants
│   └── App.jsx                   # Main app with toast provider
├── .env                          # Environment variables
└── package.json

backend/
├── requirements.txt              # Python dependencies
└── BACKEND_UPDATES.md           # Backend implementation guide
```

## 🔧 Configuration

Create a `.env` file in `frontend/job-app/`:

```env
VITE_API_URL=http://127.0.0.1:5000
```

## 📚 Documentation

- **MIGRATION_GUIDE.md**: Development best practices and patterns
- **QUICK_REFERENCE.md**: API reference and hook usage
- **backend/BACKEND_UPDATES.md**: Backend implementation requirements

## 🎯 Features In Development

- Email notifications on application status changes
- Form validation with real-time feedback
- JWT authentication
- Dark mode toggle
- Dashboard analytics charts
- Testing framework (Jest + React Testing Library)

## 🐛 Known Issues

- Backend routes for new features need implementation (see BACKEND_UPDATES.md)
- Database schema needs migration for resume storage
- CSV export requires backend endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with React 18 and Vite
- UI powered by Bootstrap 5
- Rich text editing by Quill
- Toast notifications by React Hot Toast
