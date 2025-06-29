import { createClient } from "@supabase/supabase-js";
//เชื่อมต่อกับฐานข้อมูล Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


supabaseKey = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcWd6bm"
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;