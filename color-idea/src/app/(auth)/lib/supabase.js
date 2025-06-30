import {createClient} from "@supabase/supabase-js";

export const supabase=createClient(
    'https://mmapmtbuuipvlnnkmjgo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tYXBtdGJ1dWlwdmxubmttamdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjM3NTIsImV4cCI6MjA2NTA5OTc1Mn0.9CETWFalKRXdPhH7XnC0rxj4QzJ0CcdKGtrTknBdPks'
)