import { adminService } from '@/services';

/**
 * Admin Module
 */
export default {
  namespaced: true,
  state: {
    form: {},
    formList: [],
    user: {},
    userList: []
  },
  getters: {
    form: state => state.form,
    formList: state => state.formList,
    user: state => state.user,
    userList: state => state.userList
  },
  mutations: {
    SET_FORM(state, form) {
      state.form = form;
    },
    SET_FORMLIST(state, forms) {
      state.formList = forms;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USERLIST(state, users) {
      state.userList = users;
    }
  },
  actions: {
    //
    // Forms
    //
    async getForms({ commit, dispatch }, activeOnly) {
      try {
        commit('SET_FORMLIST', []);
        // Get all forms
        const response = await adminService.listForms(activeOnly);
        commit('SET_FORMLIST', response.data);
      } catch (error) {
        dispatch('notifications/addNotification', {
          message:
            'An error occurred while fetching forms.',
          consoleError: `Error getting admin form data: ${error}`,
        }, { root: true });
      }
    },
    async readForm({ commit, dispatch }, formId) {
      try {
        commit('SET_FORM', {});
        // Get specific form
        const response = await adminService.readForm(formId);
        commit('SET_FORM', response.data);
      } catch (error) {
        dispatch('notifications/addNotification', {
          message:
            'An error occurred while fetching this form.',
          consoleError: `Error getting admin form ${formId} data: ${error}`,
        }, { root: true });
      }
    },
    async restoreForm({ commit, dispatch }, formId) {
      try {
        // Get specific form
        const response = await adminService.restoreForm(formId);
        commit('SET_FORM', response.data);
      } catch (error) {
        dispatch('notifications/addNotification', {
          message:
            'An error occurred while restoring this form.',
          consoleError: `Error restoring form ${formId} data: ${error}`,
        }, { root: true });
      }
    },

    //
    // Users
    //
    async getUsers({ commit, dispatch }) {
      try {
        // Get all users
        commit('SET_USERLIST', []);
        const response = await adminService.listUsers();
        commit('SET_USERLIST', response.data);
      } catch (error) {
        dispatch('notifications/addNotification', {
          message:
            'An error occurred while fetching users.',
          consoleError: `Error getting admin users data: ${error}`,
        }, { root: true });
      }
    },
    async readUser({ commit, dispatch }, userId) {
      try {
        // Get a users
        commit('SET_USER', {});
        const response = await adminService.readUser(userId);
        commit('SET_USER', response.data);
      } catch (error) {
        dispatch('notifications/addNotification', {
          message:
            'An error occurred while fetching this user.',
          consoleError: `Error getting admin user ${userId} data: ${error}`,
        }, { root: true });
      }
    },
  },
};
