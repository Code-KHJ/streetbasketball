import React, { createContext, useContext, useEffect, useState } from "react";
import useSupabase from "@/apis/useSupabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const supabase = useSupabase();

  const [user, setUser] = useState({
    id: null,
    nickname: null,
    phone: null,
  });

  useEffect(() => {
    if (supabase) {
      const { data: subscription } = supabase.auth.onAuthStateChange(
        (_event, userdata) => {
          if (_event === "SIGNED_OUT") {
            setUser({
              id: null,
              nickname: null,
              phone: null,
            });
          } else if (userdata) {
            setUser({
              id: userdata.user.email,
              nickname: userdata.user.user_metadata.full_name,
              phone: userdata.phone,
            });
          }
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [supabase]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
