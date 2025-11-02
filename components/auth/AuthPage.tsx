
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Icon, Logo } from '../../constants';

const AuthPage: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Logo className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-dark-text-secondary">{isLogin ? "Sign in to manage your websites." : "Create an account to get started."}</p>
        </div>
        <div className="bg-dark-surface p-8 rounded-lg shadow-2xl">
            <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-md hover:bg-gray-200 disabled:bg-gray-400 transition-all"
                aria-label="Sign in with Google"
            >
                <Icon name="UserGroup" className="w-6 h-6"/> Sign in with Google
            </button>

            <div className="relative text-center my-6">
                <span className="absolute top-1/2 left-0 w-full h-px bg-dark-border"></span>
                <span className="relative bg-dark-surface px-4 text-dark-text-secondary font-semibold text-sm">OR</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                  aria-label="Email Address"
                />
                 <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                  aria-label="Password"
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-black font-bold py-3 px-4 rounded-md hover:bg-primary-dark disabled:bg-gray-600 transition-all"
                >
                    {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
                </button>
            </form>

            {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}

            <p className="text-center mt-6 text-sm text-dark-text-secondary">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-primary hover:underline ml-2">
                    {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;