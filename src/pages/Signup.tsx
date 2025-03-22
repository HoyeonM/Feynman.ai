
// src/pages/Signup.tsx
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; // Adjust if firebase.ts is in a different folder

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
      // You can save the name to Firestore if needed
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google user signed in:', result.user);
      toast.success('Signed in with Google!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 animate-fade-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-gray-600 mt-2">Join Feynman.ai and start learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button 
            type="button" 
            onClick={handleGoogleSignup} 
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google"><circle cx="12" cy="12" r="10"/><path d="M21.64 12.02c0-.63-.05-1.25-.15-1.85H12v3.5h5.38c-.23 1.14-.93 2.1-1.97 2.75v2.28h3.18c1.86-1.7 2.94-4.22 2.94-7.18Z"/><path d="M12 21.98c2.65 0 4.88-.87 6.5-2.33l-3.18-2.28c-.88.59-2.02.93-3.32.93-2.55 0-4.7-1.66-5.47-3.9H3.28v2.35a9.82 9.82 0 0 0 8.72 5.23Z"/><path d="M6.53 14.4a5.93 5.93 0 0 1 0-3.8V8.25H3.28a9.97 9.97 0 0 0 0 8.5l3.25-2.35Z"/><path d="M12 8.58c1.44 0 2.73.5 3.74 1.47l2.83-2.76C16.97 5.83 14.73 5 12 5a9.82 9.82 0 0 0-8.72 5.25l3.25 2.35C7.3 10.24 9.45 8.58 12 8.58Z"/></svg>
            Sign up with Google
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-black font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
