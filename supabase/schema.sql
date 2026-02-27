-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    is_pro BOOLEAN DEFAULT false,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    available_credits INTEGER DEFAULT 5000,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create extensions table
CREATE TABLE extensions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'active', 'failed')),
    version TEXT DEFAULT '1.0.0',
    type TEXT DEFAULT 'chrome',
    storage_path TEXT, -- Path to ZIP file in Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE extensions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/write their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Extensions: Users can only see their own extensions
CREATE POLICY "Users can view own extensions" ON extensions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own extensions" ON extensions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own extensions" ON extensions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own extensions" ON extensions FOR DELETE USING (auth.uid() = user_id);

-- Projects Table (The core workspace)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    current_version TEXT DEFAULT '1.0.0',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    latest_code JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Messages Table (Chat history for the editor)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- To know who sent it
    role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
    content TEXT NOT NULL,
    model_used TEXT, -- e.g., 'gpt-4o', 'claude-3-5-sonnet' (NULL for user messages)
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for New Tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Projects Policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Users can view project messages" ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = messages.project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Project Versions (Checkpoints)
CREATE TABLE project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    code JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Project Shares (Public Links)
CREATE TABLE project_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    share_slug TEXT UNIQUE NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;

-- Versions: Users can view versions of projects they own
CREATE POLICY "Users can view versions of own projects" ON project_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_versions.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert versions for own projects" ON project_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_versions.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Shares: Anyone can view public shares, owners can manage
CREATE POLICY "Public shares are visible to all" ON project_shares
    FOR SELECT USING (is_public = true);

CREATE POLICY "Owners can manage own shares" ON project_shares
    FOR ALL USING (auth.uid() = user_id);

