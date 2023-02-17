import { createClient } from "@supabase/supabase-js";

import config from "../config";
import { User } from "./types";

const {
  SUPABASE_API_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_DATABASE_TABLE_NAME,
} = config;
const supabase = createClient(SUPABASE_API_URL, SUPABASE_SERVICE_ROLE_KEY);

export const saveToSupabaseTable = async (
  users: User[]
): Promise<{ data; error }> => {
  const { data, error } = await supabase
    .from(SUPABASE_DATABASE_TABLE_NAME)
    .insert(users);
  if (error) {
    console.error(error);
    throw error;
  }
  return { data, error };
};
