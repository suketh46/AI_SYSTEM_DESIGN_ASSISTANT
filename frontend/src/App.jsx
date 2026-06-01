import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NewDesign from './pages/NewDesign';
import History from './pages/History';
import ArchitectureDetail from './pages/ArchitectureDetail';
import Learning from './pages/Learning';
import LessonView from './pages/LessonView';
import Templates from './pages/Templates';
import CodingPlayground from './pages/CodingPlayground';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/new" element={<ProtectedRoute><NewDesign /></ProtectedRoute>} />
      <Route path="/dashboard/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/dashboard/architecture/:id" element={<ProtectedRoute><ArchitectureDetail /></ProtectedRoute>} />
      <Route path="/dashboard/learn" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
      <Route path="/dashboard/learn/:moduleId/:lessonId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
      <Route path="/dashboard/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/dashboard/playground" element={<ProtectedRoute><CodingPlayground /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
