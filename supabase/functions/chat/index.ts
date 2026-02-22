import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { messages, model, projectId } = await req.json()

        // 1. Get API Key from Environment
        const apiKey = model.startsWith('claude')
            ? Deno.env.get('ANTHROPIC_API_KEY')
            : Deno.env.get('OPENAI_API_KEY')

        if (!apiKey) {
            throw new Error(`API Key missing for model ${model}`)
        }

        // 2. Setup System Prompt (Similar to our controller logic)
        const SYSTEM_PROMPT = `
You are Demi, an expert AI Chrome Extension Developer.
Your goal is to build fully functional, manifest v3 compliant browser extensions.

### UNFAIR ADVANTAGE: THE INTENT GRAPH
Before code, output <intent_graph> JSON.
### TRUST & QUALITY
Output <trust_report> JSON.
### Rules:
1. XML Tags for files: <file name="...">...</file>
2. Completeness: No placeholders.
3. Permission Minimiser: Minimal permissions only.
`;

        // 3. Dispatch to Provider
        if (model.startsWith('gpt')) {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                    stream: true,
                })
            })

            return new Response(res.body, {
                headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
            })
        }

        if (model.startsWith('claude')) {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model,
                    system: SYSTEM_PROMPT,
                    messages: messages.filter((m: any) => m.role !== 'system'),
                    max_tokens: 4096,
                    stream: true,
                })
            })

            // Standardize Claude stream for frontend
            const { readable, writable } = new TransformStream()
            const writer = writable.getWriter()
            const decoder = new TextDecoder()
            const encoder = new TextEncoder()

                ; (async () => {
                    const reader = res.body?.getReader()
                    if (!reader) return writer.close()

                    let buffer = ""
                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break
                        buffer += decoder.decode(value, { stream: true })
                        const lines = buffer.split("\n")
                        buffer = lines.pop() || ""
                        for (const line of lines) {
                            if (line.startsWith("data: ")) {
                                try {
                                    const json = JSON.parse(line.slice(6))
                                    if (json.type === 'content_block_delta') {
                                        writer.write(encoder.encode(json.delta.text))
                                    }
                                } catch (e) { }
                            }
                        }
                    }
                    writer.close()
                })()

            return new Response(readable, {
                headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' }
            })
        }

        throw new Error("Model not supported")

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
