import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkColumns() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'service_records' });
  console.log('Columns:', data);
  if (error) console.error('Error:', error);
}

checkColumns();
