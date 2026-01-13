/**
 * Lightweight Educational Context
 * 
 * Simplified version that only fetches the most valuable data:
 * - Active misconceptions (common mistakes)
 * - Skill progress (how well the student is doing)
 */

export async function buildLightweightContext(params: {
  userId: string;
  skillId?: string;
  supabaseClient: any;
}): Promise<string | null> {
  const { userId, skillId, supabaseClient } = params;
  
  try {
    console.log('Building lightweight educational context for:', { userId, skillId });
    
    const contextParts: string[] = [];
    
    // Fetch misconceptions and skill progress in parallel
    const [misconceptions, skillProgress] = await Promise.all([
      fetchActiveMisconceptions(supabaseClient, userId),
      skillId ? fetchSkillProgress(supabaseClient, userId, skillId) : Promise.resolve(null)
    ]);
    
    // Add misconceptions context
    if (misconceptions && misconceptions.length > 0) {
      contextParts.push(formatMisconceptionsContext(misconceptions));
    }
    
    // Add skill progress context
    if (skillProgress) {
      contextParts.push(formatSkillProgressContext(skillProgress));
    }
    
    if (contextParts.length === 0) {
      console.log('No lightweight context data available');
      return null;
    }
    
    const fullContext = `\n\n## KONTEKST EDUKACYJNY UCZNIA\n\n${contextParts.join('\n\n')}`;
    console.log('Lightweight context built, length:', fullContext.length);
    
    return fullContext;
  } catch (error) {
    console.error('Error building lightweight context:', error);
    return null;
  }
}

async function fetchActiveMisconceptions(supabaseClient: any, userId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('misconception_networks')
      .select('*')
      .eq('user_id', userId)
      .gte('strength', 0.3)
      .order('strength', { ascending: false })
      .limit(3); // Only top 3 most common mistakes
    
    if (error) {
      console.log('No misconceptions found');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching misconceptions:', error);
    return [];
  }
}

async function fetchSkillProgress(supabaseClient: any, userId: string, skillId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('skill_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .maybeSingle();
    
    if (error) {
      console.log('No skill progress found');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching skill progress:', error);
    return null;
  }
}

function formatMisconceptionsContext(misconceptions: any[]): string {
  if (!misconceptions || misconceptions.length === 0) return '';
  
  let context = `### BŁĘDNE KONCEPCJE (Misconceptions)\n\n`;
  context += `Uczeń ma tendencję do popełniania następujących błędów:\n\n`;
  
  misconceptions.forEach((m, index) => {
    context += `${index + 1}. **${m.misconception_type || 'Nieznany typ'}** (siła: ${(m.strength * 100).toFixed(0)}%)\n`;
    if (m.description) {
      context += `   - ${m.description}\n`;
    }
    if (m.correct_concept) {
      context += `   - Prawidłowe rozumienie: ${m.correct_concept}\n`;
    }
  });
  
  context += `\n**INSTRUKCJA:** Gdy zauważysz, że uczeń popełnia któryś z tych błędów, delikatnie go naprowadź pytaniami, aby sam odkrył poprawne rozwiązanie. Nie mów wprost "to jest błąd", ale zadaj pytanie, które zmusi go do przemyślenia swojego podejścia.`;
  
  return context;
}

function formatSkillProgressContext(progress: any): string {
  if (!progress) return '';
  
  let context = `### POSTĘPY W NAUCE\n\n`;
  
  const masteryLevel = progress.mastery_level || 0;
  const attempts = progress.attempts_count || 0;
  const successRate = progress.success_rate || 0;
  
  context += `- **Poziom opanowania:** ${(masteryLevel * 100).toFixed(0)}%\n`;
  context += `- **Liczba prób:** ${attempts}\n`;
  context += `- **Wskaźnik sukcesu:** ${(successRate * 100).toFixed(0)}%\n`;
  
  // Interpretation
  if (masteryLevel < 0.3) {
    context += `\n**INSTRUKCJA:** Uczeń jest na **początkowym etapie** nauki tej umiejętności. Używaj prostego języka, małych kroków i dużo zachęty. Sprawdzaj zrozumienie po każdym kroku.`;
  } else if (masteryLevel < 0.7) {
    context += `\n**INSTRUKCJA:** Uczeń ma **podstawowe zrozumienie**, ale potrzebuje więcej praktyki. Możesz wprowadzać nieco trudniejsze przykłady, ale wciąż sprawdzaj zrozumienie.`;
  } else {
    context += `\n**INSTRUKCJA:** Uczeń **dobrze opanował** tę umiejętność. Możesz wprowadzać bardziej złożone problemy i zachęcać do samodzielnego rozwiązywania.`;
  }
  
  return context;
}
