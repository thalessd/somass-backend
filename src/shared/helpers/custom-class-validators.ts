import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAfter } from 'date-fns';

@ValidatorConstraint({ name: 'minDate', async: false })
export class MinDateFns implements ValidatorConstraintInterface {
  defaultMessage(args?: ValidationArguments): string {
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
