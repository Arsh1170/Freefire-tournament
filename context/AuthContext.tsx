import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';

import { auth, loginWithGoogle } from '../lib/firebase';

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; import { db } from '../lib/firebase';

import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface AuthContextType

user: User | null;

profile: any;

isAdmin: boolean;

loading: boolean;

signout: () => Promise

Promise<void>;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

etUser] = useState<User | null>(null):

const [profile, setProfile] = useState<any>(null)

const [isAdmin, setIsAdmin] = useState(false);

const [loading, setLoading]

useState(true);

useEffect(() => {

const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { setUser(currentUser);

if (currentUser) {

// Sync user profile

const userDocRef = doc(db, 'users', currentUser.uid); const adminDocRef = doc(db, 'admins', currentUser.uíd);

const [userDoc, adminDoc] = await Promise.all([ const getDoc(userDocRet):

getDoc(adminDocRef)

setIsAdmin(adminDoc.exists() || currentUser.email ===

if (!userDoc.exists()) {

const newProtile = (

uid: currentUser.uid,

displayName: currentUser.displayName,

email: currentUser.email,

photoURL: currentUser.photoURL,

'deeparsh66703@gmail.com');

coins: 1000,

walletBalance: 0,

15Vip:Τalse,

membershipType: 'NONE',

kd: 0.

winRate:

createdAt: serverTimestamp(),

updatedAt: serverTimestamp()

await setDoc(userDocRef, newProfile);

setProfile(newProfile);

// Auto-bootstrap admin for the specified email

await setDoc(adminDockeT,

(currentUser.email === 'deeparsh66703@gmail. !adminDoc.exists()) {

email: currentUser.email,

bootstrapped: true

createdAt: serverTimestamp()

SetIsAdmin(true):

else {

setProfile(userDoc.data());

catch (error)

handleFirestoreError(error, OperationType.GET, auth-init/${currentUser.uid});

setProfile(null); setIsAdmin(false);

setLoading(false);

});

return () => unsubscribe();

const signInwithGoogle = async () =>

await loginWithGoogle();

} catch (error) {

console.error("Login Error:", error);

const signout = async () => {

await firebaseSignout(auth);

catch (error) {

console.error("Sign Out Error:", error);

<AuthContext.Provider value={{ user, profile, isAdmin,

{children}

/AuthContext.Provider>

loading,

signInWithGoogle,

signOut }}>

fu

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider');

return context;
