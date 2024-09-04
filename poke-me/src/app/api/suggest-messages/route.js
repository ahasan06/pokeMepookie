import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
const maxDuration = 30;

export async function POST(req) {
    try {
        // Extract the prompt from the image text
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

        const { messages } = await req.json();

        // Add the prompt to the messages array
        messages.push({ role: 'users', content: prompt });

        const result = await streamText({
            model: openai('gpt-4-turbo'),
            messages: convertToCoreMessages(messages),
        });

        return result.toDataStreamResponse();

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return new Response({ name, status, headers, message }, { status: 500 });
        }
        console.error('Error in POST request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
