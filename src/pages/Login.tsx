
// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login success
    toast.success('Logged in successfully');
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 animate-fade-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800">
              Sign in
            </Button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-black font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
