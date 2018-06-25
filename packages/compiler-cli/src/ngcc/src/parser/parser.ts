/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';


export interface PackageParser {
  /**
   * Parse a source file and identify all the declarations that represent exported classes.
   * This can be different dependending upon the format of the source file.
   * For example:
   *
   * - ES2015 files contain `class Xxxx {...}` style declarations
   * - ES5 files contain `var Xxxx = (function () { function Xxxx() { ... }; return Xxxx; })();` style
   *   declarations
   * - UMD have similar declarations to ES5 files but the whole thing is wrapped in IIFE module wrapper
   *   function.
   *
   * @param sourceFile the file containing classes to parse.
   * @returns an array of TypeScript declaration nodes that represent the exported classes.
   */
  getExportedClasses(sourceFile: ts.SourceFile): ts.Declaration[];
}


// /**
//  * Search the AST of the specified source file, looking for classes that have been decorated.
//  * @param entryPoint The source file containing the exports to find.
//  * @returns an array containing the decorated classes found in this file.
//  */
// getDecoratedClasses(entryPoint: ts.SourceFile): DecoratedClass[] {
//   const decoratedClasses: DecoratedClass[] = [];
//   const walk = (node: ts.Node) => {
//     ts.forEachChild(node, node => {
//       if (this.reflectionHost.isClass(node)) {
//         const decorators = this.reflectionHost.getDecoratorsOfDeclaration(node);
//         if (decorators && decorators.length) {
//           decoratedClasses.push({ classNode: node, decorators });
//         }
//       } else {
//         walk(node);
//       }
//     });
//   };

//   walk(entryPoint);
//   return decoratedClasses;
// }
