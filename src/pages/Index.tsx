
import { ContentForm } from "@/components/ContentForm";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-b-accent/30">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-full mr-4 flex items-center justify-center iron-pattern">
              <div className="w-8 h-8 rounded-full bg-secondary tech-glow flex items-center justify-center">
                <span className="text-background font-bold text-sm">J</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">JARVIS <span className="text-white">SEO</span></h1>
              <p className="text-sm text-muted-foreground">
                Asistente de Creación de Contenido Optimizado
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container py-8">
        <ContentForm />
      </main>

      <footer className="border-t border-t-accent/30 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>JARVIS SEO - Generador de Artículos Optimizados para WordPress</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
