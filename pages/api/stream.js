import { OpenAI } from "openai-streams";

export default async function handler(req) {
  const body = await req.json();
  const prompt = body.prompt;
  const question = body.question;
  const stream = await OpenAI(
    "chat",
    {
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": "You are conducting a software engineering interview. Be obtuse, overly rude and obnoxious, and nitpick each answer."}, 
      {"role": "assistant", "content": question}, {"role": "user", "content": prompt}],
      max_tokens: 256,
    }
  );

  return new Response(stream);
}

export const config = {
  runtime: "edge"
};