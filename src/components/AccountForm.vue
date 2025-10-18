<script setup lang="ts">
import { useAccountStore } from "../stores/accountStore";
import { computed, ref } from "vue";
import type { Account } from "../types/account";

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
  store.updateLabels(account, labelsString);
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

const getLabelsRaw = (account: Account) => {
  return store.getLabelsRaw(account);
};
</script>

<template>
  <v-card class="account-form" elevation="4">
    <v-card-title
      class="d-flex justify-space-between align-center bg-purple-darken-2"
    >
      <h5 class="text-h5 font-weight-bold">Учетные записи</h5>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="addAccount"
        size="large"
      >
        Добавить учетную запись
      </v-btn>
    </v-card-title>

    <v-card-text class="bg-surface pa-0">
      <div class="px-4 py-2 bg-grey-darken-4 text-caption text-grey-lighten-1">
        Для указания нескольких меток для одной пары логин/пароль используйте
        разделитель ;
      </div>

      <v-container fluid class="table-header bg-grey-darken-3">
        <v-row class="align-center text-caption font-weight-bold">
          <v-col cols="3" class="py-3">Метки</v-col>
          <v-col cols="2" class="py-3">Тип записи</v-col>
          <v-col cols="3" class="py-3"> Логин </v-col>
          <v-col cols="3" class="py-3"> Пароль </v-col>
          <v-col cols="1" class="py-3 text-center">Действия</v-col>
        </v-row>
      </v-container>

      <div v-if="accounts.length > 0" class="accounts-list">
        <v-container
          v-for="(account, index) in accounts"
          :key="account.id"
          fluid
          class="account-item py-3"
          :class="{ 'bg-grey-darken-4': index % 2 === 0 }"
        >
          <v-row class="align-center">
            <v-col cols="3">
              <v-text-field
                :model-value="getLabelsRaw(account)"
                @update:model-value="(val) => updateLabels(account, val)"
                @blur="validateAccount(account)"
                placeholder="Введите метки через ;"
                :maxlength="50"
                variant="outlined"
                density="compact"
                hide-details
                color="primary"
                class="compact-field"
              />
            </v-col>

            <v-col cols="2">
              <v-select
                :model-value="account.recordType"
                @update:model-value="(val) => updateRecordType(account, val)"
                :items="recordTypes"
                variant="outlined"
                density="compact"
                hide-details
                color="primary"
                class="compact-field"
              />
            </v-col>

            <v-col :cols="account.recordType === 'ldap' ? 6 : 3">
              <v-text-field
                :model-value="account.login"
                @update:model-value="(val) => updateLogin(account, val)"
                @blur="validateAccount(account)"
                placeholder="Введите логин"
                :maxlength="100"
                :error="!!account.errors?.login"
                variant="outlined"
                density="compact"
                hide-details
                color="primary"
                class="compact-field"
                required
              />
            </v-col>

            <v-col cols="3" v-if="account.recordType === 'local'">
              <v-text-field
                :model-value="account.password || ''"
                @update:model-value="(val) => updatePassword(account, val)"
                @blur="validateAccount(account)"
                placeholder="Введите пароль"
                :maxlength="100"
                :error="!!account.errors?.password"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                density="compact"
                hide-details
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                color="primary"
                class="compact-field"
                required
              />
            </v-col>
            <v-col cols="1" class="text-center">
              <v-btn
                color="error"
                variant="text"
                icon="mdi-close"
                @click="removeAccount(account.id)"
                size="small"
                title="Удалить учетную запись"
                class="delete-btn"
              />
            </v-col>
          </v-row>
          <v-row
            v-if="
              account.errors &&
              (account.errors.login || account.errors.password)
            "
            class="mt-1"
          >
            <v-col cols="12">
              <div class="error-messages">
                <span
                  v-if="account.errors.login"
                  class="text-error text-caption mr-3"
                >
                  {{ account.errors.login }}
                </span>
                <span
                  v-if="account.errors.password"
                  class="text-error text-caption"
                >
                  {{ account.errors.password }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-alert
        v-else
        type="info"
        variant="tonal"
        class="my-6 mx-4"
        icon="mdi-information"
        color="primary"
      >
        Нет учетных записей. Нажмите кнопку выше чтобы добавить первую.
      </v-alert>
    </v-card-text>

    <v-card-actions class="bg-grey-darken-4 px-4 py-3">
      <div class="text-caption text-grey-lighten-1">
        Всего записей: {{ accounts.length }} | Локальных:
        {{ localAccountsCount }} | LDAP: {{ ldapAccountsCount }}
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.account-form {
  max-width: 1400px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.table-header {
  border-bottom: 2px solid rgba(255, 255, 255, 0.12);
}

.accounts-list {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.account-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 64px;
}

.account-item:last-child {
  border-bottom: none;
}

.compact-field {
  :deep(.v-field) {
    min-height: 40px;
    font-size: 14px;
  }

  :deep(.v-field__input) {
    padding-top: 0;
    padding-bottom: 0;
    min-height: 40px;
  }
}

.labels-field {
  :deep(.v-field__input) {
    white-space: pre-line;
  }
}

.delete-btn {
  color: rgb(207, 102, 121) !important;
}

.error-messages {
  padding-left: 12px;
}

:deep(.v-field--error) {
  .v-field__outline {
    border-color: rgb(207, 102, 121) !important;
  }
}

@media (max-width: 1200px) {
  .account-form {
    margin: 0 16px;
  }
}

@media (max-width: 768px) {
  .table-header {
    display: none;
  }

  .account-item .v-row {
    flex-direction: column;
    gap: 16px;
  }

  .account-item .v-col {
    width: 100%;
    max-width: 100%;
    flex: none;
  }
}
</style>
