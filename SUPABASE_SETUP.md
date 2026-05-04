# Supabase Setup Guide

The application has been fully migrated to use Supabase for the backend. However, because new tables have been introduced, you need to create them in your Supabase database.

Please follow these steps:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and go to your project.
2. On the left sidebar, click on **SQL Editor**.
3. Click on **New Query**.
4. Copy the entire contents of the `supabase-schema.sql` file from this project and paste it into the SQL Editor.
5. Click **Run** (or press Cmd/Ctrl + Enter).

This script will:
- Create the `cars` table with the correct schema.
- Enable Row Level Security (RLS) policies so data is secure.
- Insert the 6 mock car entries into the database so your site will be populated immediately.

Once that is done, the app will work perfectly and the errors should disappear!
