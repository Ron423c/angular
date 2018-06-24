/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';
import { ReflectionHost } from '../../../ngtsc/host';

/**
 * A reflection host that has extra methods for looking at non-Typescript package formats
 */
export interface NgccReflectionHost extends ReflectionHost {
  /**
   * Test whether a node represents a class.
   *
   * In JS this may not actually be a class declaration. It could be a function declaration
   * or even the left side of an assignment.
   * @param node The node to test for classiness.
   */
  isClass(node: ts.Node): node is ts.Declaration;
}