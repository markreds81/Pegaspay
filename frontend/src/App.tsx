import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import PrivateRoute from '@/components/PrivateRoute';
import RegisterPage from '@/pages/RegisterPage';
import Layout from '@/components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
