import { useAppContext } from "../context/appContext";

function Login() {
  const { supabase } = useAppContext();

  const onSubmit = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "example@email.com",
      password: "example-password",
      options: {
        redirectTo: "https//example.com/welcome",
      },
    });
  };
}
export default Login;
