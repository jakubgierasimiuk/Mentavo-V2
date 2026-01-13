/**
 * Mock AI Service for Testing Mode
 * 
 * This service simulates AI responses without requiring Supabase backend.
 * Perfect for testing UI changes and new features locally.
 */

export interface MockAIResponse {
  message: string;
  delay?: number; // milliseconds
}

// Predefined responses for different scenarios
const mockResponses: Record<string, MockAIResponse[]> = {
  greeting: [
    {
      message: "Cześć! 😊 Jestem Mentavo, Twoim korepetytorem matematyki. W czym mogę Ci dziś pomóc?",
      delay: 1500
    }
  ],
  
  math_question: [
    {
      message: "Świetne pytanie! 🤔 Zanim przejdziemy do rozwiązania, powiedz mi - co już wiesz o tym zagadnieniu?",
      delay: 2000
    },
    {
      message: "Rozumiem! Spróbujmy to rozwiązać krok po kroku. Jaki byłby pierwszy krok według Ciebie?",
      delay: 2500
    },
    {
      message: "Dokładnie! 👍 Teraz gdy mamy ten krok, co myślisz, że powinniśmy zrobić dalej?",
      delay: 2000
    }
  ],
  
  help_request: [
    {
      message: "Oczywiście, chętnie pomogę! 😊 Zamiast od razu podać odpowiedź, spróbujmy razem. Co przychodzi Ci do głowy, gdy patrzysz na to zadanie?",
      delay: 1800
    }
  ],
  
  confusion: [
    {
      message: "Widzę, że to może być trudne. Nie martw się! 💪 Spróbujmy uprościć. Czy znasz podstawowy wzór na to zagadnienie?",
      delay: 2200
    }
  ],
  
  default: [
    {
      message: "Interesujące podejście! 🤔 Czy możesz mi wyjaśnić, jak doszedłeś do tego wniosku?",
      delay: 2000
    },
    {
      message: "Świetnie myślisz! 👍 A co by się stało, gdybyśmy spróbowali to zrobić inaczej?",
      delay: 1900
    },
    {
      message: "Dobra robota! 😊 Teraz spróbuj zastosować tę samą logikę do następnego kroku.",
      delay: 2100
    }
  ]
};

let responseIndex = 0;

/**
 * Simulates AI response based on user message
 */
export async function getMockAIResponse(userMessage: string): Promise<string> {
  // Determine which type of response to use
  let responseType: keyof typeof mockResponses = 'default';
  
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('cześć') || lowerMessage.includes('hej') || lowerMessage.includes('witaj')) {
    responseType = 'greeting';
    responseIndex = 0;
  } else if (lowerMessage.includes('pomóż') || lowerMessage.includes('pomocy') || lowerMessage.includes('nie rozumiem')) {
    responseType = 'help_request';
  } else if (lowerMessage.includes('?') && (lowerMessage.includes('jak') || lowerMessage.includes('co') || lowerMessage.includes('dlaczego'))) {
    responseType = 'math_question';
  } else if (lowerMessage.includes('nie wiem') || lowerMessage.includes('trudne') || lowerMessage.includes('za ciężkie')) {
    responseType = 'confusion';
  }
  
  // Get responses for this type
  const responses = mockResponses[responseType];
  
  // Cycle through responses
  const response = responses[responseIndex % responses.length];
  responseIndex++;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, response.delay || 2000));
  
  return response.message;
}

/**
 * Simulates "AI is typing..." indicator
 */
export function getTypingDelay(): number {
  return Math.random() * 1000 + 1500; // 1.5-2.5 seconds
}

/**
 * Reset response index (useful when starting new conversation)
 */
export function resetMockAI(): void {
  responseIndex = 0;
}

/**
 * Check if message looks like it needs a longer response
 */
export function needsLongerResponse(userMessage: string): boolean {
  return userMessage.length > 100 || userMessage.includes('wyjaśnij') || userMessage.includes('opisz');
}
