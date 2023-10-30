import { createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const supabase = createClient(
    import.meta.env.SUPABASE_LOCAL_URL,
    import.meta.env.SUPABASE_LOCAL_ANON_KEY
  );

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
