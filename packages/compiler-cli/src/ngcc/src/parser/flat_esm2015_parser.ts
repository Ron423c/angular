/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';
import { PackageParser } from './parser';

export class FlatEsm2015PackageParser implements PackageParser {

  constructor(protected checker: ts.TypeChecker) {}

  getExportedClasses(sourceFile: ts.SourceFile): ts.Declaration[] {
    const moduleSymbol = this.checker.getSymbolAtLocation(sourceFile);
    if (moduleSymbol) {
      this.checker.getExportsOfModule(moduleSymbol);
    }
    return [];
  }
}