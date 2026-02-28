"use client";

import { useState } from "react";

interface FunctionData {
  name: string;
  code: string;
  explanation: string;
  filePath: string;
  lineNumber: number;
}

export default function Home() {
  const [filePath, setFilePath] = useState("");
  const [functions, setFunctions] = useState<FunctionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeFile = async () => {
    setLoading(true);
    setError("");
    setFunctions([]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setFunctions(data.functions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Context Lens</h1>
      <p className="text-gray-600 mb-4">
        Understand any codebase with AI-powered explanations
      </p>
      <p className="text-sm text-gray-500 mb-8">
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
          Currently supports: TypeScript
        </span>
        <span className="text-gray-400 ml-2">Coming soon: JavaScript, Python, Java, Go</span>
      </p>
      
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          File Path
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            placeholder="e.g., ./test-sample.ts"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={analyzeFile}
            disabled={loading || !filePath}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Try: ./test-sample.ts or ./src/lib/parser.ts
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {functions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            Found {functions.length} function{functions.length !== 1 ? 's' : ''}
          </h2>
          
          {functions.map((func, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-blue-600">{func.name}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                  Line {func.lineNumber}
                </span>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-800">{func.explanation}</p>
              </div>
              
              <details className="group">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                  <span className="group-open:hidden">▶ View code</span>
                  <span className="hidden group-open:inline">▼ Hide code</span>
                </summary>
                <pre className="mt-4 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
                  <code>{func.code}</code>
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}