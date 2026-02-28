import { Project, SyntaxKind } from "ts-morph";

export interface ParsedFunction {
  name: string;
  code: string;
  filePath: string;
  lineNumber: number;
  parameters: string[];
  isAsync: boolean;
}

export interface ParsedFile {
  filePath: string;
  functions: ParsedFunction[];
}

export async function parseTypeScriptFile(
  filePath: string
): Promise<ParsedFile> {
  // Create a new TypeScript project
  const project = new Project();
  
  // Add the file to the project
  const sourceFile = project.addSourceFileAtPath(filePath);
  
  const functions: ParsedFunction[] = [];
  
  // Find all function declarations
  sourceFile.getFunctions().forEach((func) => {
    functions.push({
      name: func.getName() || "anonymous",
      code: func.getText(),
      filePath: sourceFile.getFilePath(),
      lineNumber: func.getStartLineNumber(),
      parameters: func.getParameters().map(p => p.getName()),
      isAsync: func.isAsync(),
    });
  });
  
  // Find all arrow functions and function expressions
  sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach((varDecl) => {
    const initializer = varDecl.getInitializer();
    if (initializer && 
        (initializer.getKind() === SyntaxKind.ArrowFunction ||
         initializer.getKind() === SyntaxKind.FunctionExpression)) {
      functions.push({
        name: varDecl.getName(),
        code: initializer.getText(),
        filePath: sourceFile.getFilePath(),
        lineNumber: varDecl.getStartLineNumber(),
        parameters: initializer.getKind() === SyntaxKind.ArrowFunction 
          ? initializer.asKindOrThrow(SyntaxKind.ArrowFunction).getParameters().map(p => p.getName())
          : initializer.asKindOrThrow(SyntaxKind.FunctionExpression).getParameters().map(p => p.getName()),
        isAsync: initializer.getKind() === SyntaxKind.ArrowFunction
          ? initializer.asKindOrThrow(SyntaxKind.ArrowFunction).isAsync()
          : initializer.asKindOrThrow(SyntaxKind.FunctionExpression).isAsync(),
      });
    }
  });
  
  // Find class methods
  sourceFile.getClasses().forEach((cls) => {
    cls.getMethods().forEach((method) => {
      functions.push({
        name: `${cls.getName()}.${method.getName()}`,
        code: method.getText(),
        filePath: sourceFile.getFilePath(),
        lineNumber: method.getStartLineNumber(),
        parameters: method.getParameters().map(p => p.getName()),
        isAsync: method.isAsync(),
      });
    });
  });
  
  return {
    filePath: sourceFile.getFilePath(),
    functions,
  };
}