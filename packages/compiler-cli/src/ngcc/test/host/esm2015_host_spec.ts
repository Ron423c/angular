/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';
import { resolve } from 'path';
import { Esm2015ReflectionHost } from '../../src/host/esm2015_host';
import { ClassMember, ClassMemberKind } from '../../../../src/ngtsc/host';

describe('Esm2015ReflectionHost', () => {
  let program: ts.Program;
  let host: Esm2015ReflectionHost;
  let file: ts.SourceFile;

  beforeEach(() => {
    const packagePath = resolve(process.env.TEST_SRCDIR, 'angular/packages/compiler-cli/src/ngcc/test/host/test_files/fesm2015');
    const entryPointPath = resolve(packagePath, 'test.js');
    program = createProgram(packagePath, entryPointPath);
    host = new Esm2015ReflectionHost(program.getTypeChecker());
    file = program.getSourceFile(entryPointPath)!;
  });

  describe('getDecoratorsOfDeclaration()', () => {
    it('should find the decorators on a class', () => {
      const classNode = getNode('SomeDirective');
      const decorators = host.getDecoratorsOfDeclaration(classNode)!;
      expect(decorators).toBeDefined();
      expect(decorators.length).toEqual(1);

      const decorator = decorators[0];
      expect(decorator.name).toEqual('Directive');
      expect(decorator.import).toEqual({ name: 'Directive', from: '@angular/core' });
      expect(decorator.args!.map(arg => arg.getText())).toEqual([
        `{ selector: '[someDirective]' }`
      ]);
    });

    it('should return null if there are no decorators', () => {
      const classNode = getNode('SimpleClass');
      const decorators = host.getDecoratorsOfDeclaration(classNode);
      expect(decorators).toBe(null);
    });

    it('should return null if the symbol is not a class', () => {
      const functionNode = getNode('foo');
      const decorators = host.getDecoratorsOfDeclaration(functionNode);
      expect(decorators).toBe(null);
    });
  });

  describe('getMembersOfClass()', () => {
    it('should find decorated members on a class', () => {
      const classNode = getNode('SomeDirective');
      debugger;
      const members = host.getMembersOfClass(classNode)!;
      expect(members).toBeDefined();
      expect(members.length).toEqual(2);

      checkMember(members[0], 'input1');
      checkMember(members[1], 'input2');
    });
  });

  describe('getConstructorParamDecorators', () => {
    it('should ...', () => {
      const classNode = getNode('SomeDirective');
      const parameters = host.getConstructorParameters(classNode);
      expect(parameters).toEqual([
        jasmine.objectContaining({name: '_viewContainer'}),
        jasmine.objectContaining({name: '_templateRef'}),
        jasmine.objectContaining({name: 'injected'}),
      ]);
    });
  });

  function createProgram(packagePath: string, entryPointPath: string) {
    const options: ts.CompilerOptions = { allowJs: true, rootDir: packagePath };
    const host = ts.createCompilerHost(options);
    return ts.createProgram([entryPointPath], options, host);
  }

  function getNode(name: string) {
    let namedNode: ts.NamedDeclaration;
    const walk = (rootNode: ts.Node) => {
      ts.forEachChild(rootNode, node => {
        if (isNamedDeclaration(node) && node.name!.getText() === name) {
          namedNode = node;
        } else {
          walk(node);
        }
      });
    };
    walk(file);
    return namedNode!;
  }

  function isNamedDeclaration(node: ts.Node): node is ts.NamedDeclaration {
    return ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node);
  }

  function checkMember(member: ClassMember, name: string) {
    expect(member.node).toBe(null);
    expect(member.kind).toEqual(ClassMemberKind.Property);
    expect(member.type).toBe(null);
    expect(member.name).toEqual(name);
    expect(member.nameNode).toBe(null);
    expect(member.initializer).toBe(null);
    expect(member.isStatic).toEqual(false);

    expect(member.decorators).toBeDefined();
    expect(member.decorators!.length).toEqual(1);
    expect(member.decorators![0].name).toEqual('Input');
    expect(member.decorators![0].import!.name).toEqual('Input');
    expect(member.decorators![0].import!.from).toEqual('@angular/core');
  }
});
