import { createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const url = import.meta.env.VITE_SUPABASE_LOCAL_URL;
  const key = import.meta.env.VITE_SUPABASE_LOCAL_ANON_KEY;

  const supabase = createClient(url, key);

  return (
    <AppContext.Provider
      value={{
        supabase,
        auth: supabase.auth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext as default, AppContextProvider, useAppContext };
