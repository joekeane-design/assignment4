import { Injectable, computed, signal } from '@angular/core';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../firebaseconfig';
import { user } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users = collection(db, 'users');
  private currentUser = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
    });
  }

  async fetchUser(uid: string): Promise<user | null> {
    const userDoc = doc(this.users, uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return userSnap.data() as user;
    }
    return null;
  }

  async addUser(email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    // Optionally save additional user data to Firestore
    await setDoc(doc(this.users, uid), { email, id: uid });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  getCurrentUser() {
    return this.currentUser();
  }

  getUID(): string | null {
    return this.currentUser()?.uid || null;
  }
} 