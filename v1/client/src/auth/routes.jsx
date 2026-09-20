import { Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './Login';
import { Register } from './Register';
import { ForgotPassword} from './Forgot-Password';
import { AuthLayout } from './AuthLayout';

const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthLayout />}>
      <Route index element={<Navigate to="login" />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword/>} />
    </Route>
  </Routes>
);

export default AuthRoutes;