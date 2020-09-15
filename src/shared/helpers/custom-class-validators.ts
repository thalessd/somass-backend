import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAfter } from 'date-fns';
import * as cpf from '@fnando/cpf';

@ValidatorConstraint({ name: 'minDate', async: false })
export class MinDateFns implements ValidatorConstraintInterface {
  defaultMessage(): string {
    return `Date of $value has passed!`;
  }

  validate(
    value: Date,
    args?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const minDate = args?.constraints[0] ?? new Date();
    return isAfter(new Date(value), new Date(minDate));
  }
}

@ValidatorConstraint({ name: 'isValidTime', async: false })
export class TimeIsValid implements ValidatorConstraintInterface {
  defaultMessage(): string {
    return `Time $value is invalid`;
  }

  validate(value: string): Promise<boolean> | boolean {
    return !!value.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/g);
  }
}

@ValidatorConstraint({ name: 'isValidCPF', async: false })
export class IsValidCPF implements ValidatorConstraintInterface {
  defaultMessage(): string {
    return `This CPF is not valid`;
  }

  validate(value: string): Promise<boolean> | boolean {
    return cpf.isValid(value);
  }
}
