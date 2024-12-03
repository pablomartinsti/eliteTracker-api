import { ZodIssue } from 'zod';

export function buildValidationErrorMessage(issues: ZodIssue[]): string[] {
  const erros = issues.map((item) => `${item.path.join('.')}:${item.message}`);
  return erros;
}
