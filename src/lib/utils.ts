
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2pdf from "html2pdf.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseQuestions(questionsText: string): string[] {
  if (!questionsText.trim()) return [];
  
  return questionsText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^[-*•]?\s*/, "")); // Eliminar marcadores de lista si existen
}

export function loadLocalStorage(key: string, defaultValue: string): string {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  
  const saved = localStorage.getItem(key);
  return saved !== null ? saved : defaultValue;
}

export function saveLocalStorage(key: string, value: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

export function downloadHtmlAsFile(htmlContent: string): void {
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-article-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPdf(htmlContent: string): Promise<void> {
  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  element.style.width = "210mm"; // A4 width
  element.style.padding = "15mm";
  document.body.appendChild(element);

  const opt = {
    margin: 10,
    filename: `seo-article-${Date.now()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  try {
    await html2pdf().from(element).set(opt).save();
  } finally {
    document.body.removeChild(element);
  }
}
