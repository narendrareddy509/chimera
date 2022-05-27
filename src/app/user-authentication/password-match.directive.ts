import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from '@angular/forms';

import { PasswordMatch } from './password-match.validator';


@Directive({
    selector: '[passwordMatch]',
    providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }]
})
export class PasswordMatchDirective implements Validator {
    @Input('passwordMatch') passwordMatch: string[] = [];

    validate(formGroup: FormGroup): ValidationErrors {
        return PasswordMatch(this.passwordMatch[0], this.passwordMatch[1])(formGroup);
    }
}