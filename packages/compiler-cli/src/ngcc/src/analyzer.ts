/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AnalysisOutput, DecoratorHandler} from '../../ngtsc/transform';
import {DecoratedClass} from './parser/parser';

export interface AnalyzedClass extends AnalysisOutput<any> {
  clazz: DecoratedClass;
}

export class Analyzer {
  constructor(private handlers: DecoratorHandler<any>[]) {}

  analyze(clazz: DecoratedClass): AnalyzedClass|undefined {
    const detected = this.handlers
      .map(handler => ({ handler, decorator: handler.detect(clazz.decorators) }))
      .filter(detected => detected.decorator);

    if (detected.length > 0) {
      if (detected.length > 1) {
        throw new Error('TODO.Diagnostic: Class has multiple Angular decorators.');
      }
      const analysisOutput = detected[0].handler.analyze(clazz.declaration, detected[0].decorator!);
      return { clazz, ...analysisOutput };
    }
  }
}
