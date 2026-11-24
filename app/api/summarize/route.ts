import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY automatically

export async function GET() {
    const encoder = new TextEncoder();

    const body = new ReadableStream({
        async start(controller) {
            try {
                const stream = client.messages.stream({
                    model: "claude-haiku-5-5",
                    max_tokens: 300,
                    messages: [{role: "user", content: "Explain what a Terms & Conditions document is in 3 sentences."}]
                }).on("text", text => {
                    controller.enqueue(encoder.encode(text));
                })

                await stream.finalMessage();
                controller.close();
            } catch(err) {
                console.error(err);
                controller.error(err);
            }
        },
    });

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Content-Type-Options": "nosniff", // helps the browser show chunks right away
        },
    });
}