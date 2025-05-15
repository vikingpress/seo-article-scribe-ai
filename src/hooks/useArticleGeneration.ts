
import { useState } from "react";
import { generateSEOArticle, improveSEOArticle } from "@/services/openaiService";
import { useToast } from "@/hooks/use-toast";

export interface ArticleData {
  html: string;
  wordCount: number;
  readingTime: number;
}

export type ArticleType = "informational" | "directory";

export const useArticleGeneration = () => {
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();

  const generateArticle = async (
    apiKey: string,
    questions: string[],
    sources: string[],
    keyword: string,
    articleType: ArticleType
  ) => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Por favor, introduce una API key válida de OpenAI",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, añade al menos una pregunta",
        variant: "destructive",
      });
      return;
    }

    if (sources.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, añade al menos una fuente",
        variant: "destructive",
      });
      return;
    }

    if (!keyword) {
      toast({
        title: "Error",
        description: "Por favor, introduce una palabra clave principal",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateSEOArticle({
        apiKey,
        questions,
        sources,
        keyword,
        articleType,
      });

      setArticleData(result);
      toast({
        title: "Éxito",
        description: "Artículo generado correctamente",
      });
    } catch (error) {
      console.error("Error al generar artículo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al generar el artículo",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const improveArticle = async (apiKey: string, keyword: string) => {
    if (!articleData) {
      toast({
        title: "Error",
        description: "No hay artículo para mejorar",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Por favor, introduce una API key válida de OpenAI",
        variant: "destructive",
      });
      return;
    }

    setIsImproving(true);

    try {
      const result = await improveSEOArticle(
        apiKey,
        articleData.html,
        keyword
      );

      setArticleData(result);
      toast({
        title: "Éxito",
        description: "Artículo mejorado correctamente",
      });
    } catch (error) {
      console.error("Error al mejorar artículo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al mejorar el artículo",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };

  return {
    articleData,
    isGenerating,
    isImproving,
    generateArticle,
    improveArticle,
  };
};
