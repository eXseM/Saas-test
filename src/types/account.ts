export interface AccountLabel {
  text: string;
}

export interface Account {
  id: string;
  labels: AccountLabel[];
  labelsRaw: string;
  recordType: 'local' | 'ldap';
  login: string;
  password: string | null;
  errors?: {
    login?: string;
    password?: string;
  };
}