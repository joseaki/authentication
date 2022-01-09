export interface IValidationError {
  constraints: string[];
  property: string;
  value: string;
  children: any[];
}
