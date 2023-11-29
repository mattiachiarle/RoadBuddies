import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContextProvider } from "./context/appContext.tsx";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
        <App />
        </NextThemesProvider>
      </NextUIProvider>
    </AppContextProvider>
  </React.StrictMode>,
);
