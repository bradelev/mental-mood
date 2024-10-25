import axios from 'axios';

interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Add this interface to represent a message
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Feelings {
  work: number;
  health: number;
  relations: number;
  finance: number;
  description: string;
}

const systemPrompt = `
  Act as an empathetic and helpful virtual coach who assists users in identifying their feelings and goals in specific areas of their life, such as work, health, relationships, or finances. Your objective is to engage in a friendly and constructive conversation, asking open-ended questions that allow the user to reflect on their goals and challenges.

- Begin by warmly greeting the user.
- Ask how they feel and which area they'd like to address today.
- Listen actively and validate their feelings.
- Help the user define clear and achievable goals.
- Offer suggestions for concrete actions that can help them move forward.
- Maintain a positive, motivating, and respectful tone at all times.
- Avoid giving professional medical or psychological advice.
- If the user mentions sensitive topics or indicates they need professional help, gently encourage them to seek support from a specialist.

The goal of this conversation is to create an action plan for the user.
When you deem it appropriate, propose a goal to the user and ask them to evaluate it.
This goal should contain items that can be added to a to-do list.
The format of the responses should be a JSON object with the following format:
{
  "message": "Assistant's response message",
  "list": {
    "title": "List title",
    "list": ["Item 1", "Item 2", "Item 3", ...]
  }
}
The list comes with content only if a task list is being proposed.
Please be proactive and offer suggestions for goals.
The items in the list should have no more than 40 characters.
Remember to adapt your language and communication style to that of the user to create a more personalized and effective experience.
`;

// Add this variable to store the conversation history
let conversationHistory: Message[] = [
  { role: "system", content: systemPrompt }
];

export async function sendMessageToChatGPT(message: string, feelings?: Feelings, comment?: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  if (feelings && conversationHistory.length === 1) {
    const feelingsMessage = `The user has indicated their feelings in the following areas:
    Work: ${feelings.work}/4
    Health: ${feelings.health}/4
    Relationships: ${feelings.relations}/4
    Finances: ${feelings.finance}/4
    Feeling description: ${comment}
    Please take this information into account when starting the conversation and offering support.`;
    
    conversationHistory.push({ role: "user", content: feelingsMessage });
  } else {
    conversationHistory.push({ role: "user", content: message });
  }


  const payload = {
    model: "gpt-4o-mini",
    messages: conversationHistory,
    temperature: 0.7
  };

  try {
    console.log('payload', payload);
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
    console.error('Error sending message to ChatGPT:', error);
    
    const mockResponses = [
      "I'm sorry, I'm having trouble processing your request at the moment. Could you try again later?",
      "It seems there's a connection problem. In the meantime, can I help you with something more general?",
      "I apologize, I couldn't access the information you need right now. Is there anything else I can assist you with?",
      "I'm experiencing technical difficulties. Would you mind rephrasing your question in a different way?",
      "Oops, something went wrong on my end. Could you give me a bit more context about your question while I try to resolve it?"
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    conversationHistory.push({ role: "assistant", content: randomResponse });

    return randomResponse;
  }
}

// Add this function to reset the conversation if necessary
export function resetConversation() {
  conversationHistory = [
    { role: "system", content: systemPrompt }
  ];
}
