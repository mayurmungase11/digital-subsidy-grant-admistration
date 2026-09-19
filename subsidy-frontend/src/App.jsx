import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import PublicDashboard from './pages/PublicDashboard.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import SchemeManagement from './pages/schemes/SchemeManagement.jsx';
import ApplicationManagement from './pages/applications/ApplicationManagement.jsx';
import VerificationManagement from './pages/verifications/VerificationManagement.jsx';
import ApprovalManagement from './pages/approvals/ApprovalManagement.jsx';
import DisbursementManagement from './pages/disbursements/DisbursementManagement.jsx';
import BeneficiaryManagement from './pages/beneficiaries/BeneficiaryManagement.jsx';
import UserManagement from './pages/users/UserManagement.jsx';
import MasterDataManagement from './pages/master-data/MasterDataManagement.jsx';
import RoleManagement from './pages/roles/RoleManagement.jsx';
import { Unauthorized, NotFound } from './pages/StatusPages.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

const roleRoutes = [
  { path: '/beneficiary', role: 'BENEFICIARY' },
  { path: '/admin', role: 'ADMIN' },
  { path: '/field-officer', role: 'FIELD_OFFICER' },
  { path: '/district-officer', role: 'DISTRICT_OFFICER' },
  { path: '/finance-officer', role: 'FINANCE_OFFICER' },
];

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PublicDashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {roleRoutes.map(({ path, role }) => (
        <Route
          key={role}
          path={path}
          element={
            <ProtectedRoute allowedRoles={[role]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="schemes" element={<SchemeManagement />} />
          {role === 'BENEFICIARY' && <Route path="profile" element={<Profile />} />}
          <Route path="applications" element={<ApplicationManagement />} />
          {(role === 'ADMIN' || role === 'FIELD_OFFICER' || role === 'DISTRICT_OFFICER') && <Route path="beneficiaries" element={<BeneficiaryManagement />} />}
          {role === 'ADMIN' && <Route path="users" element={<UserManagement />} />}
          {role === 'ADMIN' && <Route path="roles" element={<RoleManagement />} />}
          {['ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER'].includes(role) && <Route path="master-data" element={<MasterDataManagement />} />}
          {(role === 'ADMIN' || role === 'FIELD_OFFICER' || role === 'DISTRICT_OFFICER') && <Route path="verifications" element={<VerificationManagement />} />}
          {(role === 'ADMIN' || role === 'DISTRICT_OFFICER') && <Route path="approvals" element={<ApprovalManagement />} />}
          {(role === 'ADMIN' || role === 'FINANCE_OFFICER') && <Route path="disbursements" element={<DisbursementManagement />} />}
        </Route>
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
