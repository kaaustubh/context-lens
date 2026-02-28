import { NextRequest, NextResponse } from "next/server";
import { parseTypeScriptFile } from "@/lib/parser";
import { explainCodeWithTokenCount } from "@/lib/ai"; // Changed this line

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    console.log(`\n🔍 Analyzing: ${filePath}`);
    
    // Parse the file
    const parsed = await parseTypeScriptFile(filePath);
    console.log(`📦 Found ${parsed.functions.length} functions\n`);

    // Get AI explanations for each function
    const functionsWithExplanations = await Promise.all(
      parsed.functions.map(async (func, index) => {
        console.log(`[${index + 1}/${parsed.functions.length}] Analyzing: ${func.name}`);
        const explanation = await explainCodeWithTokenCount(func.code); // Changed this line
        return {
          ...func,
          explanation,
        };
      })
    );

    console.log(`\n✅ Analysis complete!\n`);

    return NextResponse.json({
      filePath: parsed.filePath,
      functions: functionsWithExplanations,
    });
  } catch (error: any) {
    console.error("❌ Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze file" },
      { status: 500 }
    );
  }
}