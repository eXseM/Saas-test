<script setup lang="ts">
import { useAccountStore } from "@/stores/accountStore";
import { computed, ref } from "vue";
import type { Account } from "@/types/account";

const store = useAccountStore();
const showPassword = ref(false);

const accounts = computed(() => store.accounts);
const recordTypes = [
  { title: "Локальная", value: "local" },
  { title: "LDAP", value: "ldap" },
];

const localAccountsCount = computed(
  () => store.accounts.filter((acc) => acc.recordType === "local").length
);

const ldapAccountsCount = computed(
  () => store.accounts.filter((acc) => acc.recordType === "ldap").length
);

const addAccount = () => {
  store.addAccount();
};

const removeAccount = (id: string) => {
  store.removeAccount(id);
};

const updateLabels = (account: Account, labelsString: string) => {
  const updated = {
    ...account,
    labels: store.parseLabels(labelsString),
  };
  store.updateAccount(updated);
};

const updateRecordType = (account: Account, recordType: string) => {
  const updated = {
    ...account,
    recordType: recordType as "local" | "ldap",
    password: recordType === "ldap" ? null : account.password || "",
  };
  store.updateAccount(updated);
  store.validateAccount(updated);
};

const updateLogin = (account: Account, login: string) => {
  const updated = { ...account, login };
  store.updateAccount(updated);
};

const updatePassword = (account: Account, password: string) => {
  const updated = { ...account, password };
  store.updateAccount(updated);
};

const validateAccount = (account: Account) => {
  store.validateAccount(account);
};

const formatLabels = (labels: any[]) => {
  return store.formatLabels(labels);
};

const getAccountIcon = (account: Account) => {
  return account.recordType === "local" ? "mdi-account" : "mdi-account-network";
};

const getAccountIconColor = (account: Account) => {
  if (account.errors && Object.keys(account.errors).length > 0) {
    return "error";
  }
  return account.recordType === "local" ? "green-lighten-2" : "blue-lighten-2";
};
</script>

<template>
  <v-card class="account-form" elevation="4">
    <v-card-title
      class="d-flex justify-space-between align-center bg-purple-darken-2"
    >
      <h2 class="text-h5 font-weight-bold">Учетные записи</h2>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="addAccount"
        size="large"
      >
        Добавить учетную запись
      </v-btn>
    </v-card-title>

    <v-card-text class="bg-surface">
      <div v-if="accounts.length > 0" class="accounts-list">
        <v-card
          v-for="account in accounts"
          :key="account.id"
          class="account-item mt-2"
          elevation="2"
        >
          <v-card-text>
            <v-row>
              <v-col cols="12" class="d-flex align-center">
                <v-icon :color="getAccountIconColor(account)">
                  {{ getAccountIcon(account) }}
                </v-icon>
                <span class="text-subtitle-1 font-weight-medium ml-1">
                  {{ account.login || "Новая учетная запись" }}
                </span>
                <v-chip
                  size="small"
                  variant="outlined"
                  class="ml-2"
                >
                  {{ account.recordType === "local" ? "Локальная" : "LDAP" }}
                </v-chip>
                
                <v-spacer />
                
                <v-btn
                  color="error"
                  variant="outlined"
                  icon="mdi-delete"
                  @click="removeAccount(account.id)"
                  size="small"
                  title="Удалить учетную запись"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="formatLabels(account.labels)"
                  @update:model-value="(val) => updateLabels(account, val)"
                  @blur="validateAccount(account)"
                  label="Метка"
                  placeholder="Введите метки через ;"
                  :maxlength="50"
                  variant="outlined"
                  density="comfortable"
                  hint="Метки через знак ; (максимум 50 символов, необязательно)"
                  persistent-hint
                  color="primary"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  :model-value="account.recordType"
                  @update:model-value="(val) => updateRecordType(account, val)"
                  :items="recordTypes"
                  label="Тип записи"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="account.login"
                  @update:model-value="(val) => updateLogin(account, val)"
                  @blur="validateAccount(account)"
                  label="Логин"
                  placeholder="Введите логин"
                  :maxlength="100"
                  :error-messages="account.errors?.login"
                  variant="outlined"
                  density="comfortable"
                  required
                  color="primary"
                />
              </v-col>

              <v-col cols="12" md="6" v-if="account.recordType === 'local'">
                <v-text-field
                  :model-value="account.password || ''"
                  @update:model-value="(val) => updatePassword(account, val)"
                  @blur="validateAccount(account)"
                  label="Пароль"
                  placeholder="Введите пароль"
                  :maxlength="100"
                  :error-messages="account.errors?.password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  required
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  color="primary"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <v-alert
        v-else
        type="info"
        variant="tonal"
        class="my-6"
        icon="mdi-information"
        color="primary"
      >
        Нет учетных записей. Нажмите кнопку выше чтобы добавить первую.
      </v-alert>

      <v-divider class="my-6" />
      <div class="text-caption text-grey-lighten-1">
        Всего записей: {{ accounts.length }} | Локальных:
        {{ localAccountsCount }} | LDAP: {{ ldapAccountsCount }}
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.account-form {
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.account-item {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: #2d2d2d !important;
}

:deep(.v-card-title) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

:deep(.v-field__outline) {
  border-radius: 8px;
}
</style>
