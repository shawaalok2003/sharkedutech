'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function AdmissionsSignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Redirect to admissions college dashboard
      router.push('/admissions/college');
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Admissions Admin Login" 
      subtitle="Sign in to manage your institute's admissions portal"
    >
      {error && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '0.88rem', fontWeight: 500, marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="college.admin@institution.edu"
            required
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid #cbd5e1',
              fontSize: '0.95rem',
              color: '#0f172a',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label htmlFor="password" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
              Password
            </label>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid #cbd5e1',
              fontSize: '0.95rem',
              color: '#0f172a',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.9rem',
            borderRadius: '0.75rem',
            background: '#001736',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 10px 20px rgba(0, 23, 54, 0.15)'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In to Portal'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#64748b' }}>
        <p>Don't have an institution account? <Link href="/admissions/auth/signup" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Register as College Admin</Link></p>
        <p>Are you a student? <Link href="/auth/signin" style={{ color: '#001736', fontWeight: 700, textDecoration: 'none' }}>Candidate Login</Link></p>
      </div>
    </AuthLayout>
  );
}
