
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Save, FileDown, Wand2 } from "lucide-react";
import { downloadHtmlAsFile, downloadPdf } from "@/lib/utils";
import { ArticleData } from "@/hooks/useArticleGeneration";

interface ArticlePreviewProps {
  articleData: ArticleData | null;
  isImproving: boolean;
  onImprove: () => void;
}

export function ArticlePreview({ articleData, isImproving, onImprove }: ArticlePreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [copied, setCopied] = useState(false);

  if (!articleData) {
    return null;
  }

  const { html, wordCount, readingTime } = articleData;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full bg-card/80 backdrop-blur iron-pattern border-accent/30">
      <div className="flex items-center justify-between border-b border-b-accent/30 px-6 py-3">
        <div>
          <h3 className="font-medium text-primary">Artículo Generado</h3>
          <p className="text-sm text-muted-foreground">
            {wordCount} palabras · {readingTime} min lectura
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[200px]"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="preview" className="data-[state=active]:bg-secondary data-[state=active]:text-black">Vista Previa</TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-secondary data-[state=active]:text-black">Código HTML</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CardContent className="p-6 h-[600px] overflow-auto scrollbar-thin">
        <Tabs value={activeTab}>
          <TabsContent value="preview" className="mt-0">
            <div
              className="html-preview"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </TabsContent>
          <TabsContent value="code" className="mt-0">
            <pre className="bg-muted p-4 rounded-md overflow-auto h-full text-sm">
              <code>{html}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/20 px-6 py-3">
        <Button onClick={onImprove} disabled={isImproving} className="bg-secondary hover:bg-secondary/80 text-black">
          <Wand2 className="mr-2 h-4 w-4" />
          {isImproving ? "Mejorando..." : "Mejorar"}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadHtmlAsFile(html)} className="border-accent/50 hover:bg-accent/20">
            <Save className="mr-2 h-4 w-4" />
            HTML
          </Button>
          <Button variant="outline" onClick={() => downloadPdf(html)} className="border-accent/50 hover:bg-accent/20">
            <FileDown className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={copyToClipboard} className="border-accent/50 hover:bg-accent/20">
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "¡Copiado!" : "Copiar"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
