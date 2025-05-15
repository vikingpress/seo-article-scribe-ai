
interface GenerateArticleParams {
  apiKey: string;
  questions: string[];
  sources: string[];
  keyword: string;
}

interface ArticleResult {
  html: string;
  wordCount: number;
  readingTime: number;
}

export async function generateSEOArticle({
  apiKey,
  questions,
  sources,
  keyword,
}: GenerateArticleParams): Promise<ArticleResult> {
  try {
    // Crear el prompt para la generación del artículo
    const systemPrompt = `Eres un especialista en SEO y redacción web. Genera un artículo HTML optimizado para WordPress 
    basándote en las preguntas de "People Also Ask" de Google sobre el tema proporcionado. 
    IMPORTANTE: DEBES utilizar EXCLUSIVAMENTE las fuentes proporcionadas como base de conocimiento.
    
    El artículo debe seguir estas reglas:
    - Convertir cada pregunta PAA en un subtítulo H3
    - Desarrollar respuestas completas y detalladas para cada pregunta
    - Si la palabra clave parece ser sobre "mejores" o "top" servicios/productos/lugares, crear una lista ordenada o numerada
    - Resaltar palabras y frases importantes con etiquetas <strong>
    - Optimizar el contenido para la palabra clave principal: "${keyword}"
    - Configurar cualquier enlace externo con atributos rel="noopener nofollow"
    - Escribir al menos dos párrafos por cada subtítulo
    - Usar un tono amistoso y profesional
    - IMPORTANTE: Utilizar SOLAMENTE información basada en las fuentes proporcionadas
    - Generar código HTML limpio y semánticamente correcto`;

    // Formatear las fuentes y preguntas para el prompt
    const formattedSources = sources.filter(Boolean).join("\n\n--- FUENTE SIGUIENTE ---\n\n");
    const formattedQuestions = questions.map((q) => `- ${q}`).join("\n");

    const userPrompt = `
    PALABRA CLAVE PRINCIPAL: ${keyword}
    
    PREGUNTAS A RESPONDER:
    ${formattedQuestions}
    
    FUENTES DE INFORMACIÓN (USA EXCLUSIVAMENTE ESTA INFORMACIÓN):
    ${formattedSources || "No se proporcionaron fuentes. Genera respuestas basadas en conocimiento general sobre el tema, pero indica claramente que se recomienda consultar fuentes específicas para información más precisa."}
    
    Genera un artículo HTML completo que responda a todas las preguntas de manera detallada.
    Si la palabra clave contiene términos como "mejores", "top", o parece solicitar una comparación (ej: "mejores dentistas de arica chile"),
    incluye un listado ordenado con opciones basándote en la información de las fuentes proporcionadas.
    No incluyas introducciones que mencionen "basado en las fuentes proporcionadas" o similares.
    Escribe como si fueras un experto en el tema.`;

    // Llamada a la API de OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error al generar el artículo");
    }

    const data = await response.json();
    const htmlContent = data.choices[0].message.content.trim();
    
    // Calcular estadísticas del contenido
    const textContent = htmlContent.replace(/<[^>]*>/g, ' '); // Eliminar etiquetas HTML
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 225); // Promedio de 225 palabras por minuto
    
    return {
      html: htmlContent,
      wordCount,
      readingTime,
    };
  } catch (error) {
    console.error("Error generando artículo SEO:", error);
    throw error;
  }
}

export async function improveSEOArticle(
  apiKey: string, 
  htmlContent: string, 
  keyword: string
): Promise<ArticleResult> {
  try {
    const systemPrompt = `Eres un especialista en SEO y redacción web. 
    Tu tarea es mejorar el artículo HTML proporcionado para optimizarlo mejor para SEO.
    
    Realiza las siguientes mejoras:
    - Asegúrate de que la densidad de palabras clave es óptima (no sobrecargada)
    - Mejora el título y los subtítulos para mayor impacto y SEO
    - Si la palabra clave es sobre "mejores" o comparaciones, asegúrate de que el artículo incluye una lista ordenada clara
    - Agrega marcado semántico adicional donde sea apropiado
    - Mejora las llamadas a la acción
    - Asegúrate de que los párrafos tengan un flujo natural
    - Refuerza la coherencia del texto
    
    Mantén el formato HTML y asegúrate de que el código sea limpio.`;

    const userPrompt = `
    PALABRA CLAVE PRINCIPAL: ${keyword}
    
    Mejora el siguiente artículo HTML para optimizarlo para SEO, manteniendo su estructura y formato:
    
    ${htmlContent}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error al mejorar el artículo");
    }

    const data = await response.json();
    const improvedHtmlContent = data.choices[0].message.content.trim();
    
    // Calcular estadísticas del contenido
    const textContent = improvedHtmlContent.replace(/<[^>]*>/g, ' ');
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 225);
    
    return {
      html: improvedHtmlContent,
      wordCount,
      readingTime,
    };
  } catch (error) {
    console.error("Error mejorando artículo SEO:", error);
    throw error;
  }
}
