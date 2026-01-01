import { SignupForm } from './AuthMenuMinimal';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <SignupForm
      onSignup={() => {
        navigate('/');
      }}
    />
  );
}
