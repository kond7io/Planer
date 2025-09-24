// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: WAŻNE! Uzupełnij poniższe dane konfiguracyjne danymi z Twojego projektu Firebase.
// Instrukcję, jak je znaleźć, znajdziesz tutaj: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "TWOJ_KLUCZ_API",
  authDomain: "TWOJA_DOMENA_AUTORYZACJI",
  projectId: "TWOJ_ID_PROJEKTU",
  storageBucket: "TWOJ_BUCKET_NA_PLIKI",
  messagingSenderId: "TWOJ_ID_NADAWCY_WIADOMOSCI",
  appId: "TWOJ_ID_APLIKACJI"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja Cloud Firestore i pobranie referencji do usługi
export const db = getFirestore(app);

// Inicjalizacja Firebase Authentication i pobranie referencji do usługi
export const auth = getAuth(app);
