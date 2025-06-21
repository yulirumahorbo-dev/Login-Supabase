import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // sesuaikan path

export function useFetchNameById(id) {
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchName() {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles") // ganti dengan nama tabel kamu
        .select("name")
        .eq("id", id)
        .single();

      if (error) {
        setError(error);
        setName(null);
      } else {
        setName(data?.nama);
        setError(null);
      }

      setLoading(false);
    }

    fetchName();
  }, [id]);

  return { name, loading, error };
}
