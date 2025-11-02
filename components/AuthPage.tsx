import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Icon, Logo, useLanguage } from '../../constants'; // Import useLanguage

const AuthPage: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage(); // Use useLanguage hook

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
            <h1 className="text-3xl font-bold">{t('welcomeBack')}</h1>
            <p className="text-dark-text-secondary">{isLogin ? t('signInManageWebsites') : t('createAccountGetStarted')}</p>
        </div>
        <div className="bg-dark-surface p-8 rounded-lg shadow-2xl">
            <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-md hover:bg-gray-200 disabled:bg-gray-400 transition-all"
                aria-label={t('signInGoogle')}
            >
                <Icon name="UserGroup" className="w-6 h-6"/> {t('signInGoogle')}
            </button>

            <div className="relative text-center my-6">
                <span className="absolute top-1/2 left-0 w-full h-px bg-dark-border"></span>
                <span className="relative bg-dark-surface px-4 text-dark-text-secondary font-semibold text-sm">{t('or')}</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailAddress')}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                  aria-label={t('emailAddress')}
                />
                 <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                  aria-label={t('password')}
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-black font-bold py-3 px-4 rounded-md hover:bg-primary-dark disabled:bg-gray-600 transition-all"
                >
                    {isLoading ? t('loading') : (isLogin ? t('login') : t('createAccount'))}
                </button>
            </form>

            {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}

            <p className="text-center mt-6 text-sm text-dark-text-secondary">
                {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-primary hover:underline ml-2">
                    {isLogin ? t('signUp') : t('login')}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;