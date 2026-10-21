// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

function sourceFiles(directory: string) {
  return readdirSync(directory, { recursive: true })
    .filter((file): file is string => typeof file === "string" && /\.tsx?$/.test(file))
    .map((file) => path.join(directory, file));
}

function parse(file: string) {
  return ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
}

describe("responsibility boundaries", () => {
  it.each(sourceFiles("src/routes"))(
    "%s handles routing, not application state or persistence",
    (file) => {
      const source = parse(file);
      const violations: string[] = [];
      function inspect(node: ts.Node) {
        if (ts.isImportDeclaration(node)) {
          const module = (node.moduleSpecifier as ts.StringLiteral).text;
          if (
            /^@\/lib\/(db|auth|sync|rewards)\//.test(module) ||
            /\/engine(?:-calculo)?$/.test(module)
          )
            violations.push(module);
          if (
            module === "react" &&
            node.importClause?.namedBindings &&
            ts.isNamedImports(node.importClause.namedBindings)
          ) {
            for (const item of node.importClause.namedBindings.elements)
              if (
                /^use(State|Effect|Reducer|Ref|Callback|Memo)$/.test(
                  item.propertyName?.text ?? item.name.text,
                )
              )
                violations.push(item.name.text);
          }
        }
        if (ts.isCallExpression(node)) {
          const callee = node.expression.getText(source);
          if (
            /^(fetch|getDatabase|createServerFn)$/.test(callee) ||
            /(?:^|\.)localStorage\./.test(callee)
          )
            violations.push(callee);
        }
        ts.forEachChild(node, inspect);
      }
      inspect(source);
      expect(violations).toEqual([]);
    },
  );

  it.each(sourceFiles("src/features"))("%s does not import a route definition", (file) => {
    const imports = parse(file)
      .statements.filter(ts.isImportDeclaration)
      .map((node) => (node.moduleSpecifier as ts.StringLiteral).text);
    expect(
      imports.filter((name) => name.startsWith("@/routes/") || name.includes("routeTree.gen")),
    ).toEqual([]);
  });
});
