
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { useArticleGeneration } from "@/hooks/useArticleGeneration";
import { ArticlePreview } from "@/components/ArticlePreview";
import { parseQuestions, loadLocalStorage, saveLocalStorage } from "@/lib/utils";
import { Play, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ContentForm() {
  const [apiKey, setApiKey] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [source1, setSource1] = useState("");
  const [source2, setSource2] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showSourceWarning, setShowSourceWarning] = useState(false);

  const {
    articleData,
    isGenerating,
    isImproving,
    generateArticle,
    improveArticle,
  } = useArticleGeneration();

  // Cargar datos guardados
  useEffect(() => {
    const savedApiKey = localStorage.getItem("seo_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    setQuestionsText(loadLocalStorage("seo_questions", ""));
    setSource1(loadLocalStorage("seo_source1", ""));
    setSource2(loadLocalStorage("seo_source2", ""));
    setKeyword(loadLocalStorage("seo_keyword", ""));
  }, []);

  // Guardar API Key en localStorage
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem("seo_api_key", value);
  };

  const handleGenerate = async () => {
    // Guardar datos en localStorage
    saveLocalStorage("seo_questions", questionsText);
    saveLocalStorage("seo_source1", source1);
    saveLocalStorage("seo_source2", source2);
    saveLocalStorage("seo_keyword", keyword);

    const parsedQuestions = parseQuestions(questionsText);
    const sources = [source1, source2].filter(Boolean);
    
    if (sources.length === 0) {
      setShowSourceWarning(true);
      return;
    }
    
    setShowSourceWarning(false);
    await generateArticle(apiKey, parsedQuestions, sources, keyword);
  };

  const handleImprove = async () => {
    await improveArticle(apiKey, keyword);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Formulario */}
      <Card className="w-full lg:w-[450px] bg-card/80 backdrop-blur iron-pattern border-accent/30">
        <CardContent className="p-6 space-y-6">
          <ApiKeyInput apiKey={apiKey} onChange={handleApiKeyChange} />

          <div className="space-y-2">
            <Label htmlFor="keyword" className="text-sm font-medium text-primary">
              Palabra clave principal
            </Label>
            <Input
              id="keyword"
              placeholder="Ej: mejores dentistas en arica chile"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-muted border-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="questions" className="text-sm font-medium text-primary">
              Preguntas de "People Also Ask"
            </Label>
            <Textarea
              id="questions"
              placeholder="Una pregunta por línea..."
              className="min-h-[120px] bg-muted border-muted"
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Se convertirán en subtítulos H3 en el artículo generado
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source1" className="text-sm font-medium text-primary">
              Fuente #1 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="source1"
              placeholder="Pega aquí el contenido de la fuente..."
              className="min-h-[100px] bg-muted border-muted"
              value={source1}
              onChange={(e) => setSource1(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source2" className="text-sm font-medium text-primary">
              Fuente #2 (opcional)
            </Label>
            <Textarea
              id="source2"
              placeholder="Pega aquí el contenido de otra fuente..."
              className="min-h-[100px] bg-muted border-muted"
              value={source2}
              onChange={(e) => setSource2(e.target.value)}
            />
          </div>
          
          {showSourceWarning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Es necesario incluir al menos una fuente para generar un artículo de calidad
              </AlertDescription>
            </Alert>
          )}

          <Button 
            className="w-full bg-primary hover:bg-primary/80 text-black font-bold"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Play className="mr-2 h-4 w-4" />
            {isGenerating ? "Generando..." : "Generar Artículo"}
          </Button>
        </CardContent>
      </Card>

      {/* Previsualización del artículo */}
      <div className="flex-1 w-full">
        {articleData ? (
          <ArticlePreview 
            articleData={articleData} 
            isImproving={isImproving} 
            onImprove={handleImprove} 
          />
        ) : (
          <div className="flex items-center justify-center h-[400px] border border-accent/30 rounded-lg backdrop-blur-sm bg-card/50 iron-pattern">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-accent/40 flex items-center justify-center">
                <span className="text-secondary text-2xl">J</span>
              </div>
              <p className="mb-2 text-lg">No hay artículo generado</p>
              <p className="text-sm">Completa el formulario y haz clic en "Generar Artículo"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
