import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { ProgressMiniBar } from "@/components/ProgressMiniBar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { QuickAccessCard } from "@/components/QuickAccessCard";
import { WeeklyStreak } from "@/components/WeeklyStreak";
import { BookOpen, Trophy, MessageCircle } from "lucide-react";
import { ReferralPromo } from "@/components/ReferralPromo";
import { Navigation } from "@/components/Navigation";

import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AutoImportRunner from "@/components/AutoImportRunner";

const HomePage = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    console.log('HomePage: Loading profile for user', user.id);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('HomePage: Profile fetch error:', error);
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('HomePage: Creating missing profile');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
              level: 1,
              total_points: 0,
              diagnosis_completed: false,
              onboarding_completed: false
            })
            .select('onboarding_completed')
            .single();
            
          if (createError) {
            console.error('HomePage: Profile creation failed:', createError);
            setProfile({ onboarding_completed: false }); // Fallback
          } else {
            setProfile(newProfile);
          }
        } else {
          setProfile({ onboarding_completed: false }); // Fallback
        }
      } else {
        console.log('HomePage: Profile loaded:', data);
        setProfile(data);
      }
    } catch (err) {
      console.error('HomePage: Unexpected error loading profile:', err);
      setProfile({ onboarding_completed: false }); // Fallback
    }
  };

  // REMOVED: Old landing page logic - now showing new dashboard for everyone

  // REMOVED: Onboarding redirect and loading screen - showing dashboard immediately

  // Show enhanced dashboard for authenticated users
  const dashboardJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Tutor Matematyki – Strona główna",
    description: "Rozpocznij naukę z AI Tutorem: lekcje, quizy i rekomendacje dopasowane do Ciebie.",
  } as const;

  return (
    <>
      <Seo
        title="AI Tutor Matematyki – Strona główna"
        description="Ucz się z AI Tutorem: lekcje, quizy, rekomendacje. Czytelnie na desktop i mobile."
        jsonLd={dashboardJsonLd}
      />
      <div className="font-sans text-foreground bg-background overflow-hidden min-h-screen">
        <Navigation />
        {/* Simplified Hero Section for Authenticated Users */}
        <section className="relative py-12 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-2">
              Witaj z powrotem, {user?.user_metadata?.name || 'Uczniu'}!
            </h1>
            <p className="text-xl text-muted-foreground">Gotowy na kolejną lekcję?</p>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="relative py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <QuickAccessCard
                icon={BookOpen}
                iconColor="text-blue-600"
                title="Kontynuuj naukę"
                subtitle="Równania kwadratowe - Lekcja 3"
                progress={65}
                buttonText="Kontynuuj"
                buttonLink="/study"
              />
              
              <QuickAccessCard
                icon={Trophy}
                iconColor="text-orange-600"
                title="Twój postęp"
                stats={[
                  { label: 'Lekcji ukończonych', value: '12' },
                  { label: 'Punktów', value: '850' }
                ]}
                buttonText="Zobacz szczegóły"
                buttonLink="/progress"
              />
              
              <QuickAccessCard
                icon={MessageCircle}
                iconColor="text-primary"
                title="Zapytaj AI"
                subtitle="Masz pytanie? Jestem tu dla Ciebie 24/7"
                buttonText="Rozpocznij rozmowę"
                buttonLink="/chat"
                highlighted
              />
            </div>
            
            <WeeklyStreak
              weekData={[
                { day: 'Pon', active: true },
                { day: 'Wt', active: true },
                { day: 'Śr', active: true },
                { day: 'Czw', active: false },
                { day: 'Pt', active: false },
                { day: 'Sob', active: false },
                { day: 'Nd', active: false }
              ]}
              currentStreak={5}
            />
          </div>
        </section>




        {/* Features Section with Modern Layout */}
        <section className="relative py-16 px-6">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <Features />
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
