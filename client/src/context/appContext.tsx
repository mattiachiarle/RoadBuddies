import { createContext } from "react";
import { createClient } from "@supabase/supabase-js";

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  );

  return <AppContext.Provider value={supabase}>{children}</AppContext.Provider>;
};

export { AppContext as default, AppContextProvider };
