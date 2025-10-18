# Supabase Setup Guide

This guide will help you set up Supabase as the database for the Fable Tales Story API.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com/))
- Python 3.8+ installed
- The `supabase` Python package (already installed)

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `fable-tales` (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like `https://your-project-ref.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Set Environment Variables

Set the following environment variables in your terminal:

```bash
export SUPABASE_URL="https://your-project-ref.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key-here"
```

Or create a `.env` file in the project root:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase_schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create all the necessary tables, indexes, triggers, and initial data.

## Step 5: Verify Setup

Run the setup verification script:

```bash
python setup_supabase.py
```

This script will:
- Check if environment variables are set
- Test the connection to Supabase
- Verify that the database schema is properly set up

## Step 6: Start the API Server

Once everything is set up, start the server:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Database Schema Overview

The Supabase database includes the following main tables:

- **stories**: Main story records
- **story_nodes**: Individual scenes/nodes in stories
- **story_choices**: Choices available at each node
- **story_edges**: Connections between nodes
- **character_roles**: Character roles in stories
- **locations**: Story locations
- **preset_characters**: Available character templates
- **character_assignments**: Character assignments to roles
- **backgrounds**: Background images for scenes
- **scene_image_versions**: Generated scene images
- **reading_progress**: User reading progress
- **reading_completions**: Completed reading sessions
- **share_links**: Story sharing links
- **generation_jobs**: AI generation job tracking

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
2. Check that your Supabase project is active (not paused)
3. Ensure your IP is not blocked by Supabase

### Schema Issues

If the schema setup fails:

1. Make sure you're running the SQL in the correct Supabase project
2. Check for any SQL syntax errors in the console
3. Verify you have the necessary permissions in your Supabase project

### Environment Variable Issues

If environment variables aren't being read:

1. Make sure you're setting them in the same terminal session where you run the server
2. If using a `.env` file, make sure it's in the project root directory
3. Restart your terminal/IDE after setting environment variables

## Security Notes

- The `anon` key is safe to use in client-side applications
- Row Level Security (RLS) is enabled on all tables
- Currently, all operations are allowed (you may want to restrict this for production)
- Consider setting up proper authentication and authorization policies

## Next Steps

After setting up Supabase:

1. Test all API endpoints to ensure they work with the database
2. Consider setting up proper user authentication
3. Configure Row Level Security policies for your use case
4. Set up database backups and monitoring
5. Consider using Supabase's real-time features for live updates

## Support

If you encounter issues:

1. Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review the error messages in the terminal
3. Check the Supabase dashboard for any service issues
4. Verify your project is not paused or has exceeded limits
