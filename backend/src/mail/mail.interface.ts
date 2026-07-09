export interface MailConfig<T> {
  from: string;
  subject: string;
  template: (data: T) => string;
}