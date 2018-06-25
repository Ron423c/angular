/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';
import { NgccReflectionHost } from '../host/ngcc_host';
import { DecoratedClass, PackageParser } from './parser';

export class FlatEsm2015PackageParser implements PackageParser {

  constructor(
    protected checker: ts.TypeChecker,
    protected host: NgccReflectionHost) {}

  getDecoratedClasses(sourceFile: ts.SourceFile): DecoratedClass[] {
    const moduleSymbol = this.checker.getSymbolAtLocation(sourceFile);
    if (moduleSymbol) {

      const exportClasses = this.checker.getExportsOfModule(moduleSymbol)
        .map(exportSymbol => this.checker.getAliasedSymbol(exportSymbol))
        .filter(exportSymbol => exportSymbol.flags & ts.SymbolFlags.Class);

      const classDeclarations = exportClasses
        .map(exportSymbol => exportSymbol.valueDeclaration) as ts.Declaration[];

      const decoratedClasses = classDeclarations
        .map((declaration: ts.ClassDeclaration) => {
          const decorators = this.host.getDecoratorsOfDeclaration(declaration);
          if (decorators) {
            return new DecoratedClass(declaration.name!.getText(), declaration, decorators);
          }
        })
        .filter(decoratedClass => decoratedClass) as DecoratedClass[];

      return decoratedClasses;
    }
    return [];
  }
}