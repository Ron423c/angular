/**
 * @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
import { Directive, InjectionToken, Input } from '@angular/core';

const INJECTED_TOKEN = new InjectionToken('injected');

class SomeDirective {
  constructor(_viewContainer, _template, injected) {}
}
SomeDirective.decorators = [
    { type: Directive, args: [{ selector: '[someDirective]' },] }
];
SomeDirective.ctorParameters = () => [
  { type: ViewContainerRef, },
  { type: TemplateRef, },
  { type: undefined, decorators: [{ type: Inject, args: [INJECTED_TOKEN,] },] },
];

SomeDirective.propDecorators = {
  "input1": [{ type: Input },],
  "input2": [{ type: Input },],
};

class SimpleClass {
}

function foo() {
}

export { foo, INJECTED_TOKEN, SomeDirective, SimpleClass };