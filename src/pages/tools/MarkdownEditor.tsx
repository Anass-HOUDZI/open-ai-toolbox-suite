
import Header from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, Edit, Download, Copy, FileText } from "lucide-react";
import { toast } from "sonner";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor

## Features
- **Live preview** of your markdown
- Syntax highlighting
- Export functionality
- Copy to clipboard

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

### Lists
1. First item
2. Second item
3. Third item

- Bullet point
- Another point
  - Nested point

### Links and Images
[Toolbox](https://example.com)

> This is a blockquote
> It can span multiple lines

### Table
| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |`);

  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");

  // Simple markdown to HTML converter
  const markdownToHtml = (md: string) => {
    return md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      
      // Images
      .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      
      // Horizontal rules
      .replace(/^---$/gim, '<hr>')
      
      // Tables
      .replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        return '<tr>' + cells.map((cell: string) => `<td>${cell}</td>`).join('') + '</tr>';
      })
      
      // Lists
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.md';
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Fichier Markdown téléchargé");
  };

  const downloadHtml = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Document</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
${markdownToHtml(markdown)}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.html';
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Fichier HTML téléchargé");
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Markdown copié dans le presse-papiers");
  };

  const insertTemplate = (template: string) => {
    const templates = {
      table: "\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n",
      codeblock: "\n```javascript\n// Your code here\nfunction example() {\n  return 'Hello World';\n}\n```\n",
      checklist: "\n- [ ] Task 1\n- [ ] Task 2\n- [x] Completed task\n- [ ] Task 4\n",
      link: "[Link text](https://example.com)",
      image: "![Alt text](https://example.com/image.jpg)"
    };
    
    setMarkdown(prev => prev + templates[template as keyof typeof templates]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gradient-text text-white py-16">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-white/70 hover:text-white mr-2">Accueil</Link>
            <span className="text-white/50">/</span>
            <Link to="/text" className="text-white/70 hover:text-white mx-2">Traitement Texte</Link>
            <span className="text-white/50">/</span>
            <span className="ml-2">Markdown Editor</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Markdown Editor</h1>
          </div>
          <p className="text-xl text-white/90">
            Éditeur Markdown avec preview temps réel et export
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-7xl">
          {/* Toolbar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* View Mode */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "edit" ? "default" : "outline"}
                    onClick={() => setViewMode("edit")}
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Édition
                  </Button>
                  <Button
                    variant={viewMode === "split" ? "default" : "outline"}
                    onClick={() => setViewMode("split")}
                    size="sm"
                  >
                    Split
                  </Button>
                  <Button
                    variant={viewMode === "preview" ? "default" : "outline"}
                    onClick={() => setViewMode("preview")}
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                </div>

                {/* Templates */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => insertTemplate("table")}
                    size="sm"
                    variant="outline"
                  >
                    Tableau
                  </Button>
                  <Button
                    onClick={() => insertTemplate("codeblock")}
                    size="sm"
                    variant="outline"
                  >
                    Code
                  </Button>
                  <Button
                    onClick={() => insertTemplate("checklist")}
                    size="sm"
                    variant="outline"
                  >
                    Checklist
                  </Button>
                  <Button
                    onClick={() => insertTemplate("link")}
                    size="sm"
                    variant="outline"
                  >
                    Lien
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={copyMarkdown}
                    size="sm"
                    variant="outline"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                  <Button
                    onClick={downloadMarkdown}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    .md
                  </Button>
                  <Button
                    onClick={downloadHtml}
                    size="sm"
                    className="bg-gradient-text hover:opacity-90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    .html
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          <div className="grid gap-6" style={{
            gridTemplateColumns: 
              viewMode === "split" ? "1fr 1fr" :
              viewMode === "edit" ? "1fr" :
              "1fr"
          }}>
            {/* Editor Panel */}
            {(viewMode === "edit" || viewMode === "split") && (
              <Card>
                <CardHeader>
                  <CardTitle>Markdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Tapez votre Markdown ici..."
                    className="w-full h-96 p-4 border rounded-lg resize-none font-mono text-sm"
                    style={{ minHeight: viewMode === "split" ? "500px" : "600px" }}
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {markdown.split('\n').length} lignes, {markdown.length} caractères
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview Panel */}
            {(viewMode === "preview" || viewMode === "split") && (
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose max-w-none p-4 border rounded-lg bg-white"
                    style={{ 
                      minHeight: viewMode === "split" ? "500px" : "600px",
                      maxHeight: viewMode === "split" ? "500px" : "600px",
                      overflowY: "auto"
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: markdownToHtml(markdown) 
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Markdown Cheatsheet */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Aide-mémoire Markdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">En-têtes</h4>
                  <code># H1<br/>## H2<br/>### H3</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Emphase</h4>
                  <code>**gras**<br/>*italique*<br/>***gras+italique***</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Listes</h4>
                  <code>- Item<br/>1. Numéroté<br/>- [ ] Checkbox</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Liens</h4>
                  <code>[texte](url)<br/>![image](url)</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Code</h4>
                  <code>`inline`<br/>```<br/>bloc<br/>```</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Quote</h4>
                  <code>&gt; Citation<br/>| Table | Header |</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MarkdownEditor;
