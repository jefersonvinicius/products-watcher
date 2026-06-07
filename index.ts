import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
  console.log('Asking Gemini to search and format...');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents:
      'Pesquise na web por ofertas de "Playstation 5 Slim"' +
      'Retorna as 3 melhores ofertas priorizando fontes brasileiras' +
      'Retorna as urls da ofertas' +
      'Returne JSON: {"offers":[{"title":string,"specs":string, "url": string, "price": number}]}',
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  console.log(response.text);
}

run();
