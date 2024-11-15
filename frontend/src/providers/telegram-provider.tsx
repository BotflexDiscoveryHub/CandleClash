"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface ITelegramContext {
  webApp?: WebApp;
  user?: WebAppUser;
}

export const TelegramContext = createContext<ITelegramContext>({});

export function TelegramProvider({ children }: {
  children: React.ReactNode
}) {
  const [webApp, setWebApp] = useState<WebApp>();

  useEffect(() => {
    const telegram: Telegram | null = (window as any).Telegram;
    const app = telegram?.WebApp;

    if (app) {
      app.ready();
      setWebApp(app);
    }}, []);

  const value = useMemo(() => {
    return webApp
      ? {
        webApp,
        unsafeData: webApp.initDataUnsafe,
        user: webApp.initDataUnsafe.user,
      } : {};
    }, [webApp]);

    return (
      <TelegramContext.Provider value={value}>
        {children}
      </TelegramContext.Provider>
    );
}

export const useTelegram = () => useContext(TelegramContext);
