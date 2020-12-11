<template>
  <div>
    <v-expansion-panels
      v-model="settingsPanel"
      flat
      class="nrmc-expand-collapse"
    >
      <v-expansion-panel flat>
        <v-expansion-panel-header>
          <template v-slot:actions>
            <v-icon class="icon">$expand</v-icon>
          </template>
          <div class="header">
            <span>Form Settings</span>
            <span>
              <small>
                Created: {{ form.createdAt | formatDate }} ({{
                  form.createdBy
                }})
              </small>
              <v-btn
                v-if="canEditForm"
                small
                icon
                color="primary"
                @click.native.stop="enableSettingsEdit"
              >
                <v-icon>edit</v-icon>
              </v-btn>
            </span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form
            ref="settingsForm"
            :disabled="formSettingsDisabled"
            v-model="settingsFormValid"
            lazy-validation
          >
            <FormSettings :disabled="formSettingsDisabled" />
          </v-form>

          <div v-if="canEditForm && !formSettingsDisabled" class="mb-5">
            <v-btn class="mr-5" color="primary" @click="updateSettings">
              <span>Update</span>
            </v-btn>
            <v-btn outlined @click="cancelSettingsEdit">
              <span>Cancel</span>
            </v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels
      v-model="versionsPanel"
      flat
      class="nrmc-expand-collapse"
    >
      <v-expansion-panel flat>
        <v-expansion-panel-header>
          <template v-slot:actions>
            <v-icon class="icon">$expand</v-icon>
          </template>
          <div class="header">
            <span>Form Design</span>
            <span>
              <strong>Current Version:</strong>
              {{ currentVersion.version }}
            </span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ManageVersions />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { FormPermissions, NotificationTypes } from '@/utils/constants';
import FormSettings from '@/components/designer/FormSettings.vue';
import ManageVersions from '@/components/forms/manage/ManageVersions.vue';

export default {
  name: 'ManageForm',
  components: { FormSettings, ManageVersions },
  data() {
    return {
      formSettingsDisabled: true,
      settingsFormValid: false,
      settingsPanel: 0,
      versionsPanel: 0,
    };
  },
  computed: {
    ...mapGetters('form', ['form', 'permissions']),
    canEditForm() {
      return this.permissions.includes(FormPermissions.FORM_UPDATE);
    },
    currentVersion() {
      return this.form.versions && this.form.versions.length
        ? this.form.versions[0]
        : { version: 'N/A' };
    },
  },
  methods: {
    ...mapActions('form', ['fetchForm', 'updateForm']),
    ...mapActions('notifications', ['addNotification']),
    cancelSettingsEdit() {
      this.formSettingsDisabled = true;
      this.fetchForm(this.form.id);
    },
    enableSettingsEdit() {
      if (this.settingsPanel === undefined) this.settingsPanel = 0;
      this.formSettingsDisabled = false;
    },
    async updateSettings() {
      try {
        if (this.$refs.settingsForm.validate()) {
          await this.updateForm();
          this.formSettingsDisabled = true;
          this.addNotification({
            type: NotificationTypes.SUCCESS,
            message: 'Your form settings have been updated successfully.',
          });
          this.fetchForm(this.form.id);
        }
      } catch (error) {
        this.addNotification({
          message:
            'An error occurred while attempting to update the settings for this form.',
          consoleError: `Error updating settings for ${this.form.id}: ${error}`,
        });
      }
    },
  },
};
</script>