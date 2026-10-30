import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "Sua_API_Key",
  authDomain: "caixa-comercial-er.firebaseapp.com",
  projectId: "caixa-comercial-er",
  storageBucket: "caixa-comercial-er.firebasestorage.app",
  messagingSenderId: "824848064441",
  appId: "Seu_App_Id",
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
