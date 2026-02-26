import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { projectId } = await req.json();

        // 1. Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch the original project (ensure it's public or owned by user)
        const { data: originalProject, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (fetchError || !originalProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        if (!originalProject.is_public && originalProject.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 3. Clone the project
        const { data: newProject, error: cloneError } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                name: `${originalProject.name} (Fork)`,
                description: originalProject.description,
                latest_code: originalProject.latest_code,
                is_public: false, // Default to private on fork
                status: 'active'
            })
            .select()
            .single();

        if (cloneError || !newProject) {
            throw cloneError;
        }

        // 4. Clone associated messages (for history context)
        const { data: originalMessages, error: msgFetchError } = await supabase
            .from('messages')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });

        if (!msgFetchError && originalMessages && originalMessages.length > 0) {
            const newMessages = originalMessages.map(msg => ({
                project_id: newProject.id,
                user_id: user.id,
                role: msg.role,
                content: msg.content,
                model_used: msg.model_used,
                tokens_used: msg.tokens_used
            }));

            const { error: msgInsertError } = await supabase
                .from('messages')
                .insert(newMessages);

            if (msgInsertError) {
                console.error('Error cloning messages:', msgInsertError);
                // We don't fail the whole fork if messages fail, but it's good to log
            }
        }

        return NextResponse.json({ projectId: newProject.id });

    } catch (error: any) {
        console.error('Fork Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
