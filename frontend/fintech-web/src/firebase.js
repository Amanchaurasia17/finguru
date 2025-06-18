// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6Qo8YDvYSRcRvPmKHvIaalTyocVmP8GY",
  authDomain: "finguru-2916c.firebaseapp.com",
  projectId: "finguru-2916c",
  storageBucket: "finguru-2916c.firebasestorage.app",
  messagingSenderId: "1089817485581",
  appId: "1:1089817485581:web:f468d99de56dd95cd75044",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app); 
export const storage = getStorage(app); 
export default app;