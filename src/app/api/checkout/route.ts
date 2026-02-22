import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-11' as any,
});

export async function POST(req: NextRequest) {
    try {
        const { planId, priceId } = await req.json();

        // 1. Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // Stripe Price ID from request
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.nextUrl.origin}/billing?success=true`,
            cancel_url: `${req.nextUrl.origin}/billing?canceled=true`,
            customer_email: session.user.email,
            metadata: {
                userId: session.user.id,
                planId: planId,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (err: any) {
        console.error('Stripe error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
