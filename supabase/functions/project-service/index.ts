import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { action, projectId, code, name } = await req.json()

        // --- Action: Fork Project ---
        if (action === 'fork') {
            const { data: original, error: fetchErr } = await supabaseClient
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single()

            if (fetchErr) throw fetchErr

            const { data: forked, error: forkErr } = await supabaseClient
                .from('projects')
                .insert({
                    name: name || `${original.name} (Forked)`,
                    user_id: (await supabaseClient.auth.getUser()).data.user?.id,
                    latest_code: original.latest_code,
                    description: original.description,
                })
                .select()
                .single()

            if (forkErr) throw forkErr
            return new Response(JSON.stringify(forked), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // --- Action: Save Version ---
        if (action === 'save-version') {
            const { data: version, error: versionErr } = await supabaseClient
                .from('project_versions')
                .insert({ project_id: projectId, code })
                .select()
                .single()

            if (versionErr) throw versionErr
            return new Response(JSON.stringify(version), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        throw new Error(`Action ${action} not supported`)

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
