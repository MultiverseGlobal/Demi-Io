import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import JSZip from 'jszip';

export async function POST(req: Request) {
    try {
        const { prompt, type = 'chrome', projectId } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const openaiKey = process.env.OPENAI_API_KEY;
        const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        const preferredModel = (req.headers.get('x-preferred-model') || 'openai').toLowerCase();
        let files: any;

        const systemPrompt = `You are an expert browser extension developer. 
Your task is to generate the code for a Chrome Extension based on the user's request.
Requirements:
- Use Manifest V3.
- Provide a complete 'manifest.json'.
- Provide 'content.js' for DOM manipulation if relevant.
- Provide 'popup.html' and 'popup.js' for the extension UI.
- All code should be production-ready, secure, and commented.

Return the result as a raw JSON object with the following structure:
{
  "files": {
    "manifest.json": "string content",
    "content.js": "string content",
    "popup.html": "string content",
    "popup.js": "string content",
    "popup.css": "string content"
  }
}
Do not include any other text before or after the JSON.`;

        if (preferredModel === 'gemini' && geminiKey) {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemPrompt}\n\nUser Request: Generate a browser extension that: ${prompt}`
                        }]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json",
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to call Gemini');
            }

            const data = await response.json();
            const resultText = data.candidates[0].content.parts[0].text;
            files = JSON.parse(resultText).files;
        } else if (openaiKey) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Generate a browser extension that: ${prompt}` }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to call OpenAI');
            }

            const completion = await response.json();
            const resultText = completion.choices[0].message.content;
            files = JSON.parse(resultText).files;
        } else {
            throw new Error('No AI model configured');
        }

        // 2. Create ZIP
        const zip = new JSZip();
        Object.entries(files).forEach(([name, content]) => {
            zip.file(name, content as string);
        });

        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        // 3. Upload to Supabase Storage
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.zip`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('extensions')
            .upload(fileName, zipBuffer, {
                contentType: 'application/zip',
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload extension' }, { status: 500 });
        }

        // 4. Update/Save Database
        let dbData;

        // Find if an extension with this prompt already exists 
        const { data: existingExt, error: findError } = await supabase
            .from('extensions')
            .select('*')
            .eq('prompt', prompt)
            .maybeSingle();

        if (existingExt) {
            const { data, error } = await supabase
                .from('extensions')
                .update({
                    status: 'active',
                    storage_path: fileName,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingExt.id)
                .select()
                .single();
            if (error) throw error;
            dbData = data;
        } else {
            const { data, error } = await supabase
                .from('extensions')
                .insert({
                    name: (files['manifest.json'] ? JSON.parse(files['manifest.json']).name : "Demi Extension"),
                    prompt: prompt,
                    status: 'active',
                    type: type,
                    storage_path: fileName
                })
                .select()
                .single();
            if (error) throw error;
            dbData = data;
        }

        return NextResponse.json({
            success: true,
            data: dbData,
            downloadUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/extensions/${fileName}`
        });

    } catch (error: any) {
        console.error('Generation error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
