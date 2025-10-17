import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account, AccountLabel } from '@/types/account';

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([]);

  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now().toString(),
      labels: [],
      recordType: 'local',
      login: '',
      password: '',
      errors: {}
    };
    accounts.value.push(newAccount);
  };

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter(acc => acc.id !== id);
  };

  const updateAccount = (updatedAccount: Account) => {
    const index = accounts.value.findIndex(acc => acc.id === updatedAccount.id);
    if (index !== -1) {
      accounts.value[index] = { ...updatedAccount };
    }
  };

  const validateAccount = (account: Account): boolean => {
    const errors: { login?: string; password?: string } = {};

    if (!account.login.trim()) {
      errors.login = 'Логин обязателен';
    } else if (account.login.length > 100) {
      errors.login = 'Максимум 100 символов';
    }

    if (account.recordType === 'local') {
      if (!account.password) {
        errors.password = 'Пароль обязателен';
      } else if (account.password.length > 100) {
        errors.password = 'Максимум 100 символов';
      }
    }

    // Создаем новый объект для реактивности
    const updatedAccount = { ...account, errors };
    updateAccount(updatedAccount);

    return Object.keys(errors).length === 0;
  };

  const parseLabels = (labelsString: string): AccountLabel[] => {
    if (!labelsString.trim()) return [];

    return labelsString.split(';')
      .map(label => label.trim())
      .filter(label => label.length > 0)
      .map(label => ({ text: label }));
  };

  const formatLabels = (labels: AccountLabel[]): string => {
    return labels.map(label => label.text).join('; ');
  };

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    validateAccount,
    parseLabels,
    formatLabels
  };
}, {
  persist: {
    key: 'accounts-storage',
    storage: localStorage,
  }
});