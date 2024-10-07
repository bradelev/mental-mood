import axios from 'axios';

interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Añade esta interfaz para representar un mensaje
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Feelings {
  work: number;
  health: number;
  relations: number;
  finance: number;
}

const systemPrompt = `
  Actúa como un coach virtual empático y servicial que ayuda a los usuarios a identificar sus sentimientos y objetivos en áreas específicas de su vida, como trabajo, salud, relaciones o finanzas. Tu objetivo es entablar una conversación amable y constructiva, haciendo preguntas abiertas que permitan al usuario reflexionar sobre sus metas y desafíos.

- Comienza saludando al usuario de manera cálida.
- Pregunta cómo se siente y qué área le gustaría abordar hoy.
- Escucha activamente y valida sus sentimientos.
- Ayuda al usuario a definir objetivos claros y alcanzables.
- Ofrece sugerencias de acciones concretas que puedan ayudarlo a avanzar.
- Mantén un tono positivo, motivador y respetuoso en todo momento.
- Evita dar consejos médicos o psicológicos profesionales.
- Si el usuario menciona temas sensibles o indica que necesita ayuda profesional, anímalo amablemente a buscar apoyo de un especialista.

Recuerda adaptar tu lenguaje y estilo de comunicación al del usuario para crear una experiencia más personalizada y efectiva.
`;

// Añade esta variable para almacenar el historial de la conversación
let conversationHistory: Message[] = [
  { role: "system", content: systemPrompt }
];

export async function sendMessageToChatGPT(message: string, feelings?: Feelings): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  if (feelings && conversationHistory.length === 1) {
    const feelingsMessage = `El usuario ha indicado sus sentimientos en las siguientes áreas:
    Trabajo: ${feelings.work}/4
    Salud: ${feelings.health}/4
    Relaciones: ${feelings.relations}/4
    Finanzas: ${feelings.finance}/4
    Por favor, ten en cuenta esta información al iniciar la conversación y ofrecer apoyo.`;
    
    conversationHistory.push({ role: "user", content: feelingsMessage });
  }

  conversationHistory.push({ role: "user", content: message });

  const payload = {
    model: "gpt-4o-mini",
    messages: conversationHistory,
    temperature: 0.7
  };

  try {
    const response = await axios.post<ChatGPTResponse>(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const assistantResponse = response.data.choices[0].message.content;
    
    conversationHistory.push({ role: "assistant", content: assistantResponse });

    return assistantResponse;
  } catch (error) {
    console.error('Error al enviar mensaje a ChatGPT:', error);
    
    const mockResponses = [
      "Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento. ¿Podrías intentarlo de nuevo más tarde?",
      "Parece que hay un problema de conexión. Mientras tanto, ¿puedo ayudarte con algo más general?",
      "Disculpa, no pude acceder a la información que necesitas ahora mismo. ¿Hay algo más en lo que pueda asistirte?",
      "Estoy experimentando dificultades técnicas. ¿Te importaría reformular tu pregunta de otra manera?",
      "Ups, algo salió mal por mi lado. ¿Podrías darme un poco más de contexto sobre tu pregunta mientras intento resolverlo?"
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    conversationHistory.push({ role: "assistant", content: randomResponse });

    return randomResponse;
  }
}

// Añade esta función para reiniciar la conversación si es necesario
export function resetConversation() {
  conversationHistory = [
    { role: "system", content: systemPrompt }
  ];
}