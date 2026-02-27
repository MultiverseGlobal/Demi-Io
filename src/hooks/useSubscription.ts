"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Subscription {
    is_pro: boolean;
    subscription_tier: 'free' | 'pro' | 'enterprise';
    available_credits: number;
    loading: boolean;
}

export function useSubscription() {
    const [subscription, setSubscription] = useState<Subscription>({
        is_pro: false,
        subscription_tier: 'free',
        available_credits: 0,
        loading: true
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setSubscription(prev => ({ ...prev, loading: false }));
                return;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('is_pro, subscription_tier, available_credits')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("Error fetching subscription:", error);
                setSubscription(prev => ({ ...prev, loading: false }));
            } else if (profile) {
                setSubscription({
                    is_pro: profile.is_pro,
                    subscription_tier: profile.subscription_tier as any,
                    available_credits: profile.available_credits,
                    loading: false
                });
            }
        };

        fetchProfile();

        // Optional: Set up real-time subscription to profile changes
        const channel = supabase
            .channel('profile-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                },
                (payload) => {
                    const newProfile = payload.new;
                    setSubscription({
                        is_pro: newProfile.is_pro,
                        subscription_tier: newProfile.subscription_tier,
                        available_credits: newProfile.available_credits,
                        loading: false
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return subscription;
}
