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

  it.each([
    "question-practice",
    "calculation-card",
    "gravity-chat",
    "tutor-workspace",
    "notes-panel",
  ])("%s presents the interface without calling persistence or external services", (name) => {
    const source = parse(`src/components/${name}.tsx`);
    const imports = source.statements
      .filter(ts.isImportDeclaration)
      .map((node) => (node.moduleSpecifier as ts.StringLiteral).text);
    expect(
      imports.filter(
        (module) =>
          /\.server(?:$|\/)|\/server(?:$|\/)|\/db\/|\/store$|\/practice-service$|\/engine-calculo$|gravity\/client$/.test(
            module,
          ) || module === "@tanstack/react-query",
      ),
    ).toEqual([]);
    const calls: string[] = [];
    function inspect(node: ts.Node) {
      if (
        ts.isCallExpression(node) &&
        /^(fetch|localStorage\.|sessionStorage\.|window\.(localStorage|sessionStorage)\.)/.test(
          node.expression.getText(source),
        )
      )
        calls.push(node.expression.getText(source));
      ts.forEachChild(node, inspect);
    }
    inspect(source);
    expect(calls).toEqual([]);
  });

  it.each(["engine", "calculation", "adaptive", "fixed", "session"])(
    "questions/%s and its dependencies are independent of React, storage and server APIs",
    (name) => {
      const visited = new Set<string>();
      const violations: string[] = [];
      function inspectFile(file: string) {
        if (visited.has(file)) return;
        visited.add(file);
        const source = parse(file);
        function inspect(node: ts.Node) {
          if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
            const module = node.moduleSpecifier && (node.moduleSpecifier as ts.StringLiteral).text;
            if (module) {
              if (
                /react|@tanstack|\.server|\/store$|\/practice-service$|\/engine-calculo$|\/brand$/.test(
                  module,
                )
              )
                violations.push(`${file}: ${module}`);
              else if (module.startsWith(".") || module.startsWith("@/")) {
                const target = ts.resolveModuleName(
                  module,
                  file,
                  { baseUrl: process.cwd(), paths: { "@/*": ["src/*"] } },
                  ts.sys,
                ).resolvedModule;
                expect(target, `${file}: unresolved local import ${module}`).toBeDefined();
                if (target) inspectFile(path.resolve(target.resolvedFileName));
              }
            }
          }
          if (
            ts.isIdentifier(node) &&
            /^(window|document|localStorage|sessionStorage|fetch)$/.test(node.text)
          )
            violations.push(`${file}: ${node.text}`);
          ts.forEachChild(node, inspect);
        }
        inspect(source);
      }
      inspectFile(path.resolve(`src/lib/questions/${name}.ts`));
      expect(violations).toEqual([]);
    },
  );
});
