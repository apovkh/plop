import 'inquirer';

declare module 'inquirer' {
  interface Question {
    source?: (answers: any, input: string) => Promise<any>;
  }
}
