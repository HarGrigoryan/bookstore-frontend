import React, { useState } from 'react';
import { login } from '../api/auth';
import { register } from '../api/auth';
import Header from '../components/Header';

export function LoginForm({ onLogin }: { onLogin?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resp = await login(email, password);

      localStorage.setItem('jwt', resp.accessToken);
      localStorage.setItem('refreshToken', resp.refreshToken);

      if (onLogin) onLogin();
    } catch (err) {
      alert('Invalid credentials');
    }
  };


  return (
    <main style={{
      width: '100vw'
    }}>
      <Header showAuth={false} />
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <h1>Sign into your account</h1>
      </div>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '20px auto', display: 'flex', flexDirection: 'column',  gap: 10 }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}/>
          <button type="submit" style={{ padding: 8, borderRadius: 6, backgroundColor: '#2563eb', color: '#fff' }}>Log in</button>
        </form>
      </div>
    </main>
  
  );
}

export function SignupForm({ onSignup }: { onSignup?: () => void }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    try {
      const resp = await register({
        firstname,
        lastname,
        email,
        password,
      });

      localStorage.setItem('jwt', resp.accessToken);
      localStorage.setItem('refreshToken', resp.refreshToken);

      if (onSignup) onSignup();
    } catch (err) {
      alert('Signup failed');
    }
  };


  return (
    <main style={{width: '100vw'}}>
      <Header showAuth={false} />
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <h1>Create an account</h1>
      </div>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="First name"
            required
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />

          <input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Last name"
            required
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}/>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}/>
          <button type="submit" style={{ padding: 8, borderRadius: 6, backgroundColor: '#16a34a', color: '#fff' }}>Sign up</button>
        </form>
      </div>
    </main>
  );
}
