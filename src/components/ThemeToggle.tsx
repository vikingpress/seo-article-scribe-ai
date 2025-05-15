
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="border-accent/50 hover:bg-accent/20">
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-accent" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-accent" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
