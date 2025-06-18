
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const fetchUserProfile = async () => {
  const token = await auth.currentUser.getIdToken(); // 
  const response = await fetch('/api/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await response.json(); 
};

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null);  
  const [loading, setLoading] = useState(true);

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setFirebaseUser(userCredential.user);
    const userProfile = await fetchUserProfile();
    setCurrentUser(userProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setCurrentUser(null);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        const userProfile = await fetchUserProfile();
        setCurrentUser(userProfile);
      } catch (err) {
        console.error('Failed to refresh user profile:', err);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user); 

      if (user) {
        try {
          const userProfile = await fetchUserProfile();
          setCurrentUser(userProfile);
        } catch (error) {
          console.error('Error fetching profile from backend:', error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    firebaseUser,     
    currentUser,
    register,
    login,
    logout,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
