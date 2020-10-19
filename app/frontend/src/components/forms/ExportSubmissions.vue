<template>
  <span>
    <v-dialog v-model="dialog" width="900">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" text small v-bind="attrs" v-on="on">
          <v-icon class="mr-1">cloud_download</v-icon>
          <span>Export CSV</span>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline pb-0">Export CSV</v-card-title>
        <v-card-text>
          <hr />
          <p>Select the submission date</p>
          <v-radio-group v-model="dateRange" hide-details="auto">
            <v-radio label="All" :value="false"></v-radio>
            <v-radio label="Select Date range" :value="true"></v-radio>
          </v-radio-group>
          <div v-if="dateRange">
            <v-row>
              <v-col cols="12" sm="6" offset-sm="0" offset-md="1" md="4">
                <v-menu
                  v-model="startDateMenu"
                  data-test="menu-form-startDate"
                  :close-on-content-click="true"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <label>From</label>
                    <v-text-field
                      v-model="startDate"
                      placeholder="yyyy-mm-dd"
                      append-icon="event"
                      v-on:click:append="startDateMenu = true"
                      readonly
                      v-on="on"
                      dense
                      flat
                      outlined
                      solo
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    data-test="picker-form-startDate"
                    @input="startDateMenu = false"
                    :readonly="reviewMode"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6" offset-sm="0" offset-md="1" md="4">
                <v-menu
                  v-model="endDateMenu"
                  data-test="menu-form-endDate"
                  :close-on-content-click="true"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <label>To</label>
                    <v-text-field
                      v-model="endDate"
                      placeholder="yyyy-mm-dd"
                      append-icon="event"
                      v-on:click:append="endDateMenu = true"
                      readonly
                      v-on="on"
                      dense
                      flat
                      outlined
                      solo
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    data-test="picker-form-endDate"
                    @input="endDateMenu = false"
                    :readonly="reviewMode"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>
          <p :class="!dateRange ? 'mt-5' : ''">
            File Name and Type: <strong>{{ fileName }}</strong>
          </p>
          <p>
            <small class="text--disabled">
              * The export data feature works well for simple form designs that
              don't contain complex nested arrays of form components. If you
              make changes to your form design the structure of your export will
              also change. We therefore caution against implementing automation
              with other systems without accounting for these factors.
            </small>
          </p>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn class="mb-5 mr-5" color="primary" @click="callExport">
            <span>Export</span>
          </v-btn>
          <v-btn class="mb-5" outlined @click="dialog = false">
            <span>Cancel</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import formService from '@/services/formService.js';

export default {
  data() {
    return {
      dateRange: false,
      dialog: false,
      endDate: '',
      startDate: '',
    };
  },
  computed: {
    ...mapGetters('form', ['form']),
    fileName() {
      return `${this.form.name}_submissions.csv`;
    },
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    async callExport() {
      try {
        const from =
          this.dateRange && this.startDate
            ? moment.utc(this.startDate).format()
            : undefined;
        const to =
          this.dateRange && this.endDate
            ? moment.utc(this.endDate).format()
            : undefined;

        const response = await formService.exportSubmissions(
          this.form.id,
          from,
          to
        );
        if (response && response.data) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', this.fileName); //or any other extension
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.dialog = false;
        } else {
          throw new Error('No data in response from exportSubmissions call');
        }
      } catch (error) {
        this.addNotification({
          message:
            'An error occurred while attempting to export submissions for this form.',
          consoleError: `Error export submissions for ${this.form.id}: ${error}`,
        });
      }
    },
  },
};
</script>