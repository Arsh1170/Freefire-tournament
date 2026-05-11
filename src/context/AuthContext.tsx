import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, loginWithGoogle } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface AuthContextType {
  user: User | null;
  profile: any;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Sync user profile
        const userDocRef = doc(db, 'users', currentUser.uid);
        const adminDocRef = doc(db, 'admins', currentUser.uid);
        
        try {
          const [userDoc, adminDoc] = await Promise.all([
            getDoc(userDocRef),
            getDoc(adminDocRef)
          ]);
          
          setIsAdmin(adminDoc.exists() || currentUser.email === 'deeparsh66703@gmail.com');

          if (!userDoc.exists()) {
            const newProfile = {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              rank: 'BRONZE',
              coins: 1000,
              walletBalance: 0,
              isVip: false,
              membershipType: 'NONE',
              kd: 0,
              winRate: 0,
              matches: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);

            // Auto-bootstrap admin for the specified email
            if (currentUser.email === 'deeparsh66703@gmail.com' && !adminDoc.exists()) {
              await setDoc(adminDocRef, { 
                email: currentUser.email,
                bootstrapped: true,
                createdAt: serverTimestamp() 
              });
              setIsAdmin(true);
            }
          } else {
            setProfile(userDoc.data());
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `auth-init/${currentUser.uid}`);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
