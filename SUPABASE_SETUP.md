# Supabase Setup Guide (Hotfix for Images & App Insertions)

The application has been migrated to use Supabase, but you might be experiencing two recurring issues if your database is not strictly configured:
1. **Broken Images:** The remote database is still storing the old (broken) image links.
2. **"Not Adding" Cars:** Supabase's Row Level Security (RLS) is blocking you from successfully inserting new cars from the frontend because the INSERT policy might be incorrectly scoped or missing.

To permanently fix BOTH the images and the ability to add new cars, we need to update the data and policies directly on your Supabase instance.

Please perform these exact steps to resolve the issues:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and navigate to your project.
2. On the left sidebar menu, click on **SQL Editor**.
3. Click on **New Query**.
4. Open the `supabase-schema.sql` file in this project, copy **all of its contents**, and paste it into the Supabase SQL Editor.
5. Click **Run** (or press Cmd/Ctrl + Enter).

**What this script does behind the scenes to fix your issue:**
- It drops any restrictive policies and inserts a completely fresh, fully permissive `FOR INSERT WITH CHECK (true)` policy, ensuring any user (including the demo App) can list a car without hitting `row-level security` violation errors.
- It leverages an `ON CONFLICT DO UPDATE` command which will forcefully override the old, broken Pixabay URLs with your fresh, working Cloudinary URLs.
- It applies the new images to all the pre-existing 6 cars.

Refresh the page on your Vercel deployment after doing this, and the cars will instantly appear with their correct images, and you'll be able to add new cars flawlessly.
