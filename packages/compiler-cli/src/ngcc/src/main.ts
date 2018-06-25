/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 /* tslint:disable:no-console */

import { resolve } from 'path';
import * as ts from 'typescript';
import { DecoratedClass } from './parser/parser';
import { FlatEsm2015PackageParser } from './parser/flat_esm2015_parser';
import { Esm2015ReflectionHost } from './host/esm2015_host';

export function mainNgcc(args: string[]): number {
  const rootPath = args[0];
  const packagePath = resolve(rootPath, 'fesm2015');
  const entryPointPath = resolve(packagePath, 'common.js');

  const options: ts.CompilerOptions = { allowJs: true, rootDir: packagePath };
  const host = ts.createCompilerHost(options);
  const packageProgram = ts.createProgram([entryPointPath], options, host);
  const entryPointFile = packageProgram.getSourceFile(entryPointPath)!;
  const typeChecker = packageProgram.getTypeChecker();

  const reflectionHost = new Esm2015ReflectionHost(typeChecker);
  const parser = new FlatEsm2015PackageParser(typeChecker, reflectionHost);
  const decoratedClasses = parser.getDecoratedClasses(entryPointFile);

  dumpDecoratedClasses(decoratedClasses);
  return 0;
}

function dumpDecoratedClasses(decoratedClasses: DecoratedClass[]) {
  console.log('Decorated classes');
  decoratedClasses.forEach(decoratedClass => {
    console.log(`- ${decoratedClass.name}`);
    decoratedClass.decorators.forEach(decorator => {
      console.log(`  * ${decorator.name}:`);
      if (decorator.args) {
        decorator.args.forEach(arg => console.log(`    ~ ${arg.getText()}`));
      }
    });
  });
}