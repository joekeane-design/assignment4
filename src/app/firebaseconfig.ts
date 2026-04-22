import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCGOTEK8UOM1rAMDnGglRWTGWWI0mecZYY",
  authDomain: "cs313assignment5.firebaseapp.com",
  projectId: "cs313assignment5",
  storageBucket: "cs313assignment5.firebasestorage.app",
  messagingSenderId: "120822716471",
  appId: "1:120822716471:web:9ae3f953ee1b7c9f8487b2",
  measurementId: "G-H44FL3S3L7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);