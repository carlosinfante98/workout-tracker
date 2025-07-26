// Test auth state
import { supabase } from './src/lib/supabase.js';

console.log('Testing auth...');
const { data: { user }, error } = await supabase.auth.getUser();
console.log('User:', user);
console.log('Error:', error);
