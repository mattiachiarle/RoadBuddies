/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  readonly VITE_SUPABASE_LOCAL_URL: string;
  readonly VITE_SUPABASE_LOCAL_ANON_KEY: string;
}
