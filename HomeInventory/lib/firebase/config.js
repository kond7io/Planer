// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// ===============================================================================================
// WAŻNE: KONFIGURACJA FIREBASE
// ===============================================================================================
//
// Poniższy obiekt `firebaseConfig` MUSI zostać uzupełniony Twoimi własnymi danymi konfiguracyjnymi
// z projektu Firebase, aby aplikacja mogła działać poprawnie.
//
// JAK UZYSKAĆ DANE KONFIGURACYJNE:
// 1. Wejdź na stronę https://console.firebase.google.com/
// 2. Utwórz nowy projekt lub wybierz istniejący.
// 3. W panelu projektu, przejdź do Ustawień projektu (kliknij ikonę zębatki obok "Project Overview").
// 4. W zakładce "Ogólne", przewiń w dół do sekcji "Twoje aplikacje".
// 5. Jeśli nie masz jeszcze aplikacji webowej, kliknij ikonę "</>" (Web), aby ją dodać.
// 6. Po utworzeniu aplikacji, znajdź i skopiuj obiekt `firebaseConfig`.
// 7. Wklej skopiowane wartości do poniższego obiektu.
//
// Link do oficjalnej dokumentacji: https://firebase.google.com/docs/web/setup#available-libraries
//
const firebaseConfig = {
  apiKey: "AIzaSyBMEMyJaufiU0k-Nvwxgl6Y-E38rDi_B0Q",
  authDomain: "planer-fc630.firebaseapp.com",
  databaseURL: "https://planer-fc630-default-rtdb.firebaseio.com",
  projectId: "planer-fc630",
  storageBucket: "planer-fc630.firebasestorage.app",
  messagingSenderId: "130877629103",
  appId: "1:130877629103:web:e7bc9cb4b2f351b2592a5a"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja Cloud Firestore (dla produktów)
export const db = getFirestore(app);

// Inicjalizacja Realtime Database (dla list zakupowych)
export const rtdb = getDatabase(app);

// Inicjalizacja Firebase Authentication
export const auth = getAuth(app);
