import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      settings: "Settings",
      currency: "Currency",
      language: "Language",
      backup: "Backup Recovery Phrase",
      export: "Export TxHash Report",
    },
  },
  fr: {
    translation: {
      settings: "Paramètres",
      currency: "Devise",
      language: "Language",
      backup: "Phrase de récupération",
      export: "Exporter le rapport",
    },
  },
  de: {
    translation: {
      settings: "Einstellungen",
      currency: "Währung",
      language: "Sprache",
      backup: "Wiederherstellungssatz",
      export: "Bericht exportieren",
    },
  },
  ar: {
    translation: {
      settings: "الإعدادات",
      currency: "العملة",
      language: "اللغة",
      backup: "نسخة احتياطية",
      export: "تصدير التقرير",
    },
  },
  fi: {
    translation: {
      settings: "Asetukset",
      currency: "Valuutta",
      language: "Kieli",
      backup: "Palautuslause",
      export: "Vie raportti",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("app_language") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;