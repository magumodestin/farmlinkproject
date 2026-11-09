const SUPABASE_URL = 'https://mxdafiiwxqiydbavfvjy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hO0bVZBY_3OXtAMxdpo2aQ_S4B3WKIc';

// Expose the connected client so admin.js and other page scripts can use it.
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
