// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
  apiKey: "TWOJ_KLUCZ_API", // Wklej tutaj swój klucz API
  authDomain: "TWOJA_DOMENA_AUTORYZACJI", // Wklej tutaj swoją domenę
  projectId: "TWOJ_ID_PROJEKTU", // Wklej tutaj ID swojego projektu
  storageBucket: "TWOJ_BUCKET_NA_PLIKI", // Wklej tutaj swój storage bucket
  messagingSenderId: "TWOJ_ID_NADAWCY_WIADOMOSCI", // Wklej tutaj swój sender ID
  appId: "TWOJ_ID_APLIKACJI" // Wklej tutaj swój app ID
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja Cloud Firestore i pobranie referencji do usługi
export const db = getFirestore(app);

// Inicjalizacja Firebase Authentication i pobranie referencji do usługi
export const auth = getAuth(app);
