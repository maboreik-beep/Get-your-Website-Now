
import React, { useState } from 'react';
import { Website } from './types';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import LandingPage from './components/LandingPage';
import AuthPage from './components/auth/AuthPage';
import DashboardPage from './components/DashboardPage';
import EditorView from './components/EditorView';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from './services/firebase';
import { LanguageProvider, useLanguage } from './constants';


export const WebsiteContext = React.createContext<{
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
  activePageId: string | null;
  setActivePageId: React.Dispatch<React.SetStateAction<string | null>>;
  currentContentLanguage: string; // New: language for content preview/editing
  setCurrentContentLanguage: React.Dispatch<React.SetStateAction<string>>; // New: setter for content language
} | null>(null);

type View = 'landing' | 'auth' | 'dashboard' | 'editor';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('landing');
  
  // Website being edited by a logged-in user
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  // Website being edited by a guest
  const [sessionWebsite, setSessionWebsite] = useState<Website | null>(null);

  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [currentContentLanguage, setCurrentContentLanguage] = useState<string>('en'); // Default to English for content
  const { t } = useLanguage(); // For accessing UI translations

  React.useEffect(() => {
    if (loading) return;

    if (user) {
      // User is logged in
      if (sessionWebsite) {
        // User just logged in and has a pending website from a guest session
        const websiteToSave: Omit<Website, 'id'> = {
          ...sessionWebsite,
          userId: user.uid,
        };
        // Save it to firestore
        addDoc(collection(db, "websites"), { ...websiteToSave, createdAt: serverTimestamp() })
          .then((docRef) => {
            console.log("Guest website saved successfully!");
            const savedWebsite: Website = { ...websiteToSave, id: docRef.id };
            setEditingWebsite(savedWebsite); // Set as editing website for logged-in user
            setActivePageId(savedWebsite.pages[0]?.id || null); // Ensure active page is set
            setCurrentContentLanguage(savedWebsite.defaultLanguage || 'en'); // Set content language from saved website
            setSessionWebsite(null); // Clear guest session
            setView('editor'); // Go to editor with the just-saved website
          })
          .catch((error) => {
            console.error("Error saving guest website:", error);
            // If saving fails, still try to direct to dashboard or landing
            setSessionWebsite(null);
            setView('dashboard');
          });
      } else if (editingWebsite && view === 'editor') {
        // If already in editor with an editingWebsite, stay there.
        // This handles cases where a logged-in user just created a site or opened an existing one.
        setCurrentContentLanguage(editingWebsite.defaultLanguage || 'en'); // Ensure content language is set
      } else if (view !== 'dashboard') { // Only set to dashboard if not already there, avoiding unnecessary re-renders
        // Regular logged-in user, not editing anything, show them the dashboard
        setView('dashboard');
      }
    } else {
      // User is not logged in
      setEditingWebsite(null); // Clear any logged-in editing state
      if (sessionWebsite) {
        // Guest is actively editing a website, keep them in editor
        setCurrentContentLanguage(sessionWebsite.defaultLanguage || 'en');
        if (view !== 'editor') setView('editor');
      } else {
        // No user, no session website. Go to landing.
        setView('landing');
      }
    }
  }, [user, loading, sessionWebsite, editingWebsite, view, t]); // Added 't' to dependencies

  const handleStartBuilding = (newWebsite: Website) => {
    setSessionWebsite(newWebsite);
    setActivePageId(newWebsite.pages[0]?.id || null);
    setCurrentContentLanguage(newWebsite.defaultLanguage || 'en'); // Set content language for new site
    setView('editor');
  };
  
  const handleEditWebsite = (website: Website) => {
    setEditingWebsite(website);
    setActivePageId(website.pages[0]?.id || null);
    setCurrentContentLanguage(website.defaultLanguage || 'en'); // Set content language for edited site
    setView('editor');
  };
  
  const handleSaveWebsite = async () => {
      if (user && editingWebsite) {
          // Logged-in user is saving their website
          if (!editingWebsite.id) return 'error';
          const { id, ...dataToSave } = editingWebsite;
          const cleanData = JSON.parse(JSON.stringify(dataToSave));
          await setDoc(doc(db, "websites", id), cleanData, { merge: true });
          return 'success'; // Indicate success for UI feedback
      } else if (sessionWebsite) {
          // Guest user is trying to save, trigger authentication
          setView('auth');
          return 'auth_required';
      }
      return 'error';
  };

  const handleExitEditor = () => {
    // Clear editing state for both logged-in and guest users.
    // The next view depends on whether a user is logged in.
    setEditingWebsite(null);
    setSessionWebsite(null); 
    setView(user ? 'dashboard' : 'landing');
  };

  // New function to navigate to Auth or Dashboard
  const handleGoToMyWebsites = () => {
    if (user) {
      setView('dashboard');
    } else {
      setView('auth');
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  const websiteForEditor = editingWebsite || sessionWebsite;
  // Ensure setWebsiteForEditor correctly sets the relevant state variable
  const setWebsiteForEditor = (newValue: React.SetStateAction<Website | null>) => {
    if (user) { // If user is logged in, manage editingWebsite
      setEditingWebsite(newValue);
    } else { // If guest, manage sessionWebsite
      setSessionWebsite(newValue);
    }
  };

  if (view === 'editor' && websiteForEditor) {
    const contextValue = {
      website: websiteForEditor,
      setWebsite: setWebsiteForEditor, // Using the refined setter
      activePageId,
      setActivePageId,
      currentContentLanguage,
      setCurrentContentLanguage
    };
    return (
      <WebsiteContext.Provider value={contextValue}>
        <EditorView onExit={handleExitEditor} onSave={handleSaveWebsite} />
      </WebsiteContext.Provider>
    );
  }

  if (view === 'dashboard' && user) {
     return <DashboardPage onEditWebsite={handleEditWebsite} onGoToMyWebsites={handleGoToMyWebsites} />;
  }

  if (view === 'auth') {
    return <AuthPage onAuthSuccess={() => setView('dashboard')} />; // FIX: Explicitly set view to dashboard on auth success
  }

  return <LandingPage onStartBuilding={handleStartBuilding} onGoToMyWebsites={handleGoToMyWebsites} />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider> {/* Wrap with LanguageProvider for UI translations */}
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;