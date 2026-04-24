import { Inject, Injectable, computed, effect, signal } from '@angular/core';
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { user } from '../models/user';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  

  }

  
