-- Supabase Database Schema for Fable Tales Story API
-- This schema defines all the tables needed for the story-based API

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORIES TABLE
-- ============================================================================
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson TEXT NOT NULL,
    theme TEXT NOT NULL,
    story_format TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'structure_finalized', 'completed')),
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STORY NODES TABLE
-- ============================================================================
CREATE TABLE story_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('start', 'normal', 'choice', 'good_ending', 'bad_ending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, scene_number)
);

-- ============================================================================
-- STORY CHOICES TABLE
-- ============================================================================
CREATE TABLE story_choices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID NOT NULL REFERENCES story_nodes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    next_node_id UUID REFERENCES story_nodes(id) ON DELETE SET NULL,
    is_correct BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STORY EDGES TABLE
-- ============================================================================
CREATE TABLE story_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    from_node_id UUID NOT NULL REFERENCES story_nodes(id) ON DELETE CASCADE,
    to_node_id UUID NOT NULL REFERENCES story_nodes(id) ON DELETE CASCADE,
    choice_id UUID NOT NULL REFERENCES story_choices(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CHARACTER ROLES TABLE
-- ============================================================================
CREATE TABLE character_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- LOCATIONS TABLE
-- ============================================================================
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- LOCATION SCENE NUMBERS TABLE (Many-to-many relationship)
-- ============================================================================
CREATE TABLE location_scene_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(location_id, scene_number)
);

-- ============================================================================
-- PRESET CHARACTERS TABLE
-- ============================================================================
CREATE TABLE preset_characters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CHARACTER ASSIGNMENTS TABLE
-- ============================================================================
CREATE TABLE character_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    character_role_id UUID NOT NULL REFERENCES character_roles(id) ON DELETE CASCADE,
    preset_character_id TEXT NOT NULL REFERENCES preset_characters(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, character_role_id)
);

-- ============================================================================
-- BACKGROUNDS TABLE
-- ============================================================================
CREATE TABLE backgrounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
    selected_version_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- BACKGROUND VERSIONS TABLE
-- ============================================================================
CREATE TABLE background_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    background_id UUID NOT NULL REFERENCES backgrounds(id) ON DELETE CASCADE,
    version_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(background_id, version_id)
);

-- ============================================================================
-- BACKGROUND SCENE NUMBERS TABLE (Many-to-many relationship)
-- ============================================================================
CREATE TABLE background_scene_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    background_id UUID NOT NULL REFERENCES backgrounds(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(background_id, scene_number)
);

-- ============================================================================
-- SCENE IMAGE VERSIONS TABLE
-- ============================================================================
CREATE TABLE scene_image_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    scene_id UUID NOT NULL REFERENCES story_nodes(id) ON DELETE CASCADE,
    version_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, scene_id, version_id)
);

-- ============================================================================
-- READING PROGRESS TABLE
-- ============================================================================
CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    current_node_id UUID REFERENCES story_nodes(id) ON DELETE SET NULL,
    visited_node_ids JSONB DEFAULT '[]',
    choices_made JSONB DEFAULT '[]',
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- READING COMPLETIONS TABLE
-- ============================================================================
CREATE TABLE reading_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    ending_node_id UUID REFERENCES story_nodes(id) ON DELETE SET NULL,
    ending_type TEXT NOT NULL CHECK (ending_type IN ('good_ending', 'bad_ending')),
    total_nodes_visited INTEGER NOT NULL,
    reading_time_seconds INTEGER NOT NULL,
    reader_id TEXT, -- Optional: for tracking different readers
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SHARE LINKS TABLE
-- ============================================================================
CREATE TABLE share_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    short_code TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- GENERATION JOBS TABLE
-- ============================================================================
CREATE TABLE generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL CHECK (job_type IN ('background_generation', 'scene_generation', 'scene_regeneration')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    job_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Stories indexes
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_created_at ON stories(created_at);

-- Story nodes indexes
CREATE INDEX idx_story_nodes_story_id ON story_nodes(story_id);
CREATE INDEX idx_story_nodes_scene_number ON story_nodes(story_id, scene_number);

-- Story choices indexes
CREATE INDEX idx_story_choices_node_id ON story_choices(node_id);
CREATE INDEX idx_story_choices_next_node_id ON story_choices(next_node_id);

-- Story edges indexes
CREATE INDEX idx_story_edges_story_id ON story_edges(story_id);
CREATE INDEX idx_story_edges_from_node ON story_edges(from_node_id);
CREATE INDEX idx_story_edges_to_node ON story_edges(to_node_id);

-- Character roles indexes
CREATE INDEX idx_character_roles_story_id ON character_roles(story_id);

-- Locations indexes
CREATE INDEX idx_locations_story_id ON locations(story_id);

-- Character assignments indexes
CREATE INDEX idx_character_assignments_story_id ON character_assignments(story_id);
CREATE INDEX idx_character_assignments_character_role_id ON character_assignments(character_role_id);

-- Backgrounds indexes
CREATE INDEX idx_backgrounds_story_id ON backgrounds(story_id);
CREATE INDEX idx_backgrounds_location_id ON backgrounds(location_id);
CREATE INDEX idx_backgrounds_status ON backgrounds(status);

-- Background versions indexes
CREATE INDEX idx_background_versions_background_id ON background_versions(background_id);

-- Scene image versions indexes
CREATE INDEX idx_scene_image_versions_story_id ON scene_image_versions(story_id);
CREATE INDEX idx_scene_image_versions_scene_id ON scene_image_versions(scene_id);
CREATE INDEX idx_scene_image_versions_current ON scene_image_versions(story_id, scene_id, is_current);

-- Reading progress indexes
CREATE INDEX idx_reading_progress_story_id ON reading_progress(story_id);

-- Reading completions indexes
CREATE INDEX idx_reading_completions_story_id ON reading_completions(story_id);
CREATE INDEX idx_reading_completions_completed_at ON reading_completions(completed_at);

-- Share links indexes
CREATE INDEX idx_share_links_short_code ON share_links(short_code);
CREATE INDEX idx_share_links_story_id ON share_links(story_id);
CREATE INDEX idx_share_links_expires_at ON share_links(expires_at);

-- Generation jobs indexes
CREATE INDEX idx_generation_jobs_story_id ON generation_jobs(story_id);
CREATE INDEX idx_generation_jobs_type ON generation_jobs(job_type);
CREATE INDEX idx_generation_jobs_status ON generation_jobs(status);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_story_nodes_updated_at BEFORE UPDATE ON story_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_backgrounds_updated_at BEFORE UPDATE ON backgrounds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON reading_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generation_jobs_updated_at BEFORE UPDATE ON generation_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_scene_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_scene_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_image_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict this later based on your auth requirements)
CREATE POLICY "Allow all operations on stories" ON stories FOR ALL USING (true);
CREATE POLICY "Allow all operations on story_nodes" ON story_nodes FOR ALL USING (true);
CREATE POLICY "Allow all operations on story_choices" ON story_choices FOR ALL USING (true);
CREATE POLICY "Allow all operations on story_edges" ON story_edges FOR ALL USING (true);
CREATE POLICY "Allow all operations on character_roles" ON character_roles FOR ALL USING (true);
CREATE POLICY "Allow all operations on locations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all operations on location_scene_numbers" ON location_scene_numbers FOR ALL USING (true);
CREATE POLICY "Allow all operations on preset_characters" ON preset_characters FOR ALL USING (true);
CREATE POLICY "Allow all operations on character_assignments" ON character_assignments FOR ALL USING (true);
CREATE POLICY "Allow all operations on backgrounds" ON backgrounds FOR ALL USING (true);
CREATE POLICY "Allow all operations on background_versions" ON background_versions FOR ALL USING (true);
CREATE POLICY "Allow all operations on background_scene_numbers" ON background_scene_numbers FOR ALL USING (true);
CREATE POLICY "Allow all operations on scene_image_versions" ON scene_image_versions FOR ALL USING (true);
CREATE POLICY "Allow all operations on reading_progress" ON reading_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on reading_completions" ON reading_completions FOR ALL USING (true);
CREATE POLICY "Allow all operations on share_links" ON share_links FOR ALL USING (true);
CREATE POLICY "Allow all operations on generation_jobs" ON generation_jobs FOR ALL USING (true);

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert preset characters
INSERT INTO preset_characters (id, name, image_url, category) VALUES
('preset_char_1', 'Cute Rabbit', 'https://cdn.example.com/rabbit.png', 'Animal'),
('preset_char_2', 'Brave Lion', 'https://cdn.example.com/lion.png', 'Animal'),
('preset_char_3', 'Wise Owl', 'https://cdn.example.com/owl.png', 'Animal'),
('preset_char_4', 'Kind Bear', 'https://cdn.example.com/bear.png', 'Animal'),
('preset_char_5', 'Friendly Fox', 'https://cdn.example.com/fox.png', 'Animal'),
('preset_char_6', 'Cheerful Squirrel', 'https://cdn.example.com/squirrel.png', 'Animal'),
('preset_char_7', 'Playful Deer', 'https://cdn.example.com/deer.png', 'Animal'),
('preset_char_8', 'Curious Cat', 'https://cdn.example.com/cat.png', 'Animal'),
('preset_char_9', 'Loyal Dog', 'https://cdn.example.com/dog.png', 'Animal'),
('preset_char_10', 'Gentle Elephant', 'https://cdn.example.com/elephant.png', 'Animal');
