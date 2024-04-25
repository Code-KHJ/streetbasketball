import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const useSupabase = () => {
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

    const client = createClient(supabaseUrl, supabaseKey);
    setSupabase(client);
  }, []);

  return supabase;
};

export default useSupabase;
