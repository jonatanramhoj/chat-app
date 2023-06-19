import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUcBaZHWnusP5wN9GV_4Iex1R2G8-_H0U",
  authDomain: "chat-app-b8970.firebaseapp.com",
  projectId: "chat-app-b8970",
  storageBucket: "chat-app-b8970.appspot.com",
  messagingSenderId: "1006739796832",
  appId: "1:1006739796832:web:863f698f1f4c67c1966405",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
