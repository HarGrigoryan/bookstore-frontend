import { useNavigate } from 'react-router-dom';
import { LoginForm } from './AuthMenuMinimal';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <LoginForm
      onLogin={() => {
        navigate('/');
      }}
    />
  );
}
