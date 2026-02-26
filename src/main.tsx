import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store/store.ts";
import { PersistGate } from "redux-persist/integration/react";

function GoogleDefaultLanguage() {
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (!savedLang || savedLang === "en") return;

    const waitForGoogle = () => {
      const select = document.querySelector(
        ".goog-te-combo"
      ) as HTMLSelectElement | null;

      if (select) {
        select.value = savedLang;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        setTimeout(waitForGoogle, 300);
      }
    };

    waitForGoogle();
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleDefaultLanguage />
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
