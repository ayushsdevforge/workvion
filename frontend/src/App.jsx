import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import DashboardLayout from '@/layouts/DashboardLayout';

// Public Pages
import LandingPage from '@/pages/LandingPage';

// Employee Pages
import EmployeeDashboard from '@/pages/employee/Dashboard';
import LeavePage from '@/pages/employee/LeavePage';
import AttendancePage from '@/pages/employee/AttendancePage';
import MonthlyReport from '@/pages/employee/MonthlyReport';
import ProfilePage from '@/pages/employee/ProfilePage';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import EmployeesPage from '@/pages/admin/EmployeesPage';
import LeaveApprovalPage from '@/pages/admin/LeaveApprovalPage';
import AdminAttendancePage from '@/pages/admin/AdminAttendancePage';
import AdminMonthlyReport from '@/pages/admin/AdminMonthlyReport';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#fff', color: '#1f2937', fontSize: '14px', borderRadius: '10px', border: '1px solid #e5e7eb' },
            }}
          />
          <Routes>
            {/* Public Route - Landing with modal login/signup */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />

            {/* Employee Routes */}
            <Route element={<ProtectedRoute allowedRoles={['employee']}><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<EmployeeDashboard />} />
              <Route path="/leaves" element={<LeavePage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/report" element={<MonthlyReport />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<EmployeesPage />} />
              <Route path="/admin/leaves" element={<LeaveApprovalPage />} />
              <Route path="/admin/attendance" element={<AdminAttendancePage />} />
              <Route path="/admin/report" element={<AdminMonthlyReport />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
