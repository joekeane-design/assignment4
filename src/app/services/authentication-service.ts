import { Injectable, computed, signal } from '@angular/core';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { user } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private usersCollection = collection(db, 'users');

  private _currentUser = signal<user | null>(null);
  private _uid = signal<string | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly uid = this._uid.asReadonly();
  readonly isAuthenticated = computed(() => this._uid() !== null);

  constructor() {
    const savedUID = localStorage.getItem('currentUserUID');
    if (savedUID) {
      this._uid.set(savedUID);
      this.fetchUser(savedUID).then((u) => this._currentUser.set(u));
    }
  }

  async register(email: string, password: string): Promise<void> {
    const existing = await getDocs(query(this.usersCollection, where('email', '==', email)));
    if (!existing.empty) {
      throw new Error('An account with this email already exists.');
    }
    const id = this.generateId();
    await setDoc(doc(this.usersCollection, id), { id, email, password });
  }

  async login(email: string, password: string): Promise<void> {
    const snap = await getDocs(query(this.usersCollection, where('email', '==', email)));
    if (snap.empty) {
      throw new Error('No account found with that email.');
    }
    const userDoc = snap.docs[0];
    const data = userDoc.data() as user;
    if (data.password !== password) {
      throw new Error('Incorrect password.');
    }
    const uid = userDoc.id;
    this._uid.set(uid);
    this._currentUser.set(data);
    localStorage.setItem('currentUserUID', uid);
  }

  logout(): void {
    this._currentUser.set(null);
    this._uid.set(null);
    localStorage.removeItem('currentUserUID');
  }

  private async fetchUser(uid: string): Promise<user | null> {
    const snap = await getDoc(doc(this.usersCollection, uid));
    return snap.exists() ? (snap.data() as user) : null;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}
