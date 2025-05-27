import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [session, setSession] = useState<Session | null>(null);
const[isReady,setIsReady]=useState(false)




  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsReady(true);
    });
  }, []);

  if(!isReady){
    return <ActivityIndicator />;
  }

  return <AuthContext.Provider value={{session,user:session?.user,isAuthenticated:!!session?.user}}>{children}</AuthContext.Provider>;
}


export const useAuth=()=>useContext(AuthContext)