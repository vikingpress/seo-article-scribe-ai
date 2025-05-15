
interface GenerateArticleParams {
  apiKey: string;
  questions: string[];
  sources: string[];
  keyword: string;
  articleType: "informational" | "directory";
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
  articleType,
}: GenerateArticleParams): Promise<ArticleResult> {
  try {
    // Crear el prompt para la generación del artículo
    const systemPrompt = articleType === "informational" 
      ? `Eres un especialista en SEO y redacción web. Genera un artículo HTML optimizado para WordPress 
    basándote en las preguntas de "People Also Ask" de Google sobre el tema proporcionado. 
    IMPORTANTE: DEBES utilizar EXCLUSIVAMENTE las fuentes proporcionadas como base de conocimiento.
    
    El artículo debe seguir estas reglas:
    - Convertir cada pregunta PAA en un subtítulo H3
    - Desarrollar respuestas completas y detalladas para cada pregunta
    - Si la palabra clave parece ser sobre "mejores" o "top" servicios/productos/lugares, crear una lista ordenada o numerada
    - Resaltar palabras y frases importantes con etiquetas <strong>
    - INCLUIR al menos una tabla HTML comparativa cuando sea apropiado para el tema
    - INCLUIR viñetas (listas) para presentar múltiples puntos o características
    - Optimizar el contenido para la palabra clave principal: "${keyword}"
    - Usar divs con clases personalizadas para destacar información importante (como divs tipo "nota" o "advertencia")
    - Configurar cualquier enlace externo con atributos rel="noopener nofollow"
    - Escribir al menos dos párrafos por cada subtítulo
    - Usar un tono amistoso y profesional
    - IMPORTANTE: Utilizar SOLAMENTE información basada en las fuentes proporcionadas
    - Generar código HTML limpio y semánticamente correcto`
      : `Eres un especialista en SEO y redacción web. Genera un artículo HTML tipo DIRECTORIO optimizado para WordPress
    sobre el tema proporcionado. 
    IMPORTANTE: DEBES utilizar EXCLUSIVAMENTE las fuentes proporcionadas como base de conocimiento.
    
    El artículo debe seguir estas reglas:
    - Crear una introducción general sobre el tipo de servicio/profesionales/empresas
    - Listar los establecimientos, profesionales o empresas en formato de directorio, extraídos de las fuentes
    - Para cada entrada del directorio, incluir:
      * Nombre del profesional/empresa como subtítulo H3
      * Descripción detallada de servicios/especialidades
      * Datos de contacto (dirección, teléfono, sitio web, redes sociales) si están disponibles
      * Información sobre horarios si está disponible
      * Valoración o reseñas si están disponibles
    - Añadir al final una sección de "Preguntas Frecuentes" con las preguntas PAA proporcionadas
    - IMPORTANTE: RESPONDER cada una de las preguntas frecuentes con párrafos detallados y completos
    - Resaltar palabras y frases importantes con etiquetas <strong>
    - INCLUIR al menos una tabla HTML comparativa entre las distintas opciones listadas
    - INCLUIR viñetas (listas) para presentar servicios o características
    - Optimizar el contenido para la palabra clave principal: "${keyword}"
    - Usar divs con clases personalizadas para destacar información importante (como divs tipo "nota" o "advertencia")
    - Configurar cualquier enlace externo con atributos rel="noopener nofollow"
    - Usar un tono amistoso y profesional
    - IMPORTANTE: Utilizar SOLAMENTE información basada en las fuentes proporcionadas
    - Generar código HTML limpio y semánticamente correcto`;

    // Formatear las fuentes y preguntas para el prompt
    const formattedSources = sources.filter(Boolean).join("\n\n--- FUENTE SIGUIENTE ---\n\n");
    const formattedQuestions = questions.map((q) => `- ${q}`).join("\n");

    const userPrompt = articleType === "informational"
      ? `
    PALABRA CLAVE PRINCIPAL: ${keyword}
    
    PREGUNTAS A RESPONDER:
    ${formattedQuestions}
    
    FUENTES DE INFORMACIÓN (USA EXCLUSIVAMENTE ESTA INFORMACIÓN):
    ${formattedSources || "No se proporcionaron fuentes. Genera respuestas basadas en conocimiento general sobre el tema, pero indica claramente que se recomienda consultar fuentes específicas para información más precisa."}
    
    Genera un artículo HTML completo que responda a todas las preguntas de manera detallada.
    IMPORTANTE: Incluye elementos visuales como:
    1. Al menos una tabla HTML comparativa para datos o características
    2. Listas con viñetas para puntos importantes
    3. Contenido estructurado en secciones bien definidas
    4. Usa divs con estilos personalizados para destacar consejos o advertencias

    Si la palabra clave contiene términos como "mejores", "top", o parece solicitar una comparación (ej: "mejores dentistas de arica chile"),
    incluye un listado ordenado con opciones basándote en la información de las fuentes proporcionadas.
    No incluyas introducciones que mencionen "basado en las fuentes proporcionadas" o similares.
    Escribe como si fueras un experto en el tema.`
      : `
    PALABRA CLAVE PRINCIPAL: ${keyword}
    
    LISTADO DE PREGUNTAS FRECUENTES (PARA EL FINAL DEL ARTÍCULO):
    ${formattedQuestions}
    
    FUENTES DE INFORMACIÓN (USA EXCLUSIVAMENTE ESTA INFORMACIÓN):
    ${formattedSources || "No se proporcionaron fuentes. Genera un directorio basado en conocimiento general sobre el tema, pero indica claramente que se recomienda consultar fuentes específicas para información más precisa."}
    
    Genera un artículo tipo DIRECTORIO en HTML que incluya:
    1. Una introducción sobre el tipo de servicio/profesionales presentados
    2. Un listado detallado de profesionales, empresas o lugares extraídos EXCLUSIVAMENTE de las fuentes
    3. Para cada entrada del directorio incluye: nombre, descripción, datos de contacto, servicios, horarios, etc.
    4. Una tabla comparativa de las diferentes opciones listadas
    5. Al final, una sección de Preguntas Frecuentes que RESPONDA A CADA UNA de las preguntas proporcionadas de manera completa y detallada
    6. Usa listas con viñetas para características o servicios
    7. Usa divs con estilos personalizados para resaltar información clave
    
    IMPORTANTE: No solamente enumeres las preguntas, sino que proporciona una respuesta completa y detallada para cada una de ellas.
    Escribe como si fueras un experto en el tema y haz el contenido atractivo visualmente.`;

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
    Tu tarea es mejorar el artículo HTML proporcionado para optimizarlo mejor para SEO y hacerlo visualmente atractivo.
    
    Realiza las siguientes mejoras:
    - Asegúrate de que la densidad de palabras clave es óptima (no sobrecargada)
    - Mejora el título y los subtítulos para mayor impacto y SEO
    - Si la palabra clave es sobre "mejores" o comparaciones, asegúrate de que el artículo incluye una lista ordenada clara
    - Agrega o mejora elementos visuales como tablas HTML, listas con viñetas y bloques destacados
    - Agrega marcado semántico adicional donde sea apropiado
    - Mejora las llamadas a la acción
    - Asegúrate de que los párrafos tengan un flujo natural
    - Refuerza la coherencia del texto
    - INCLUIR al menos una tabla HTML comparativa cuando sea apropiado para el tema
    - INCLUIR viñetas (listas) para presentar múltiples puntos o características
    
    Mantén el formato HTML y asegúrate de que el código sea limpio.`;

    const userPrompt = `
    PALABRA CLAVE PRINCIPAL: ${keyword}
    
    Mejora el siguiente artículo HTML para optimizarlo para SEO y hacerlo más atractivo visualmente:
    
    1. Si no existe ya, AÑADE al menos una tabla HTML para presentar información comparativa
    2. Si no tiene suficientes, AÑADE más listas con viñetas para mejorar la legibilidad
    3. Usa estilos para resaltar contenido importante
    
    ARTÍCULO HTML:
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
