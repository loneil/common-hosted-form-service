import { createLocalVue, shallowMount } from '@vue/test-utils';
import AdministerUser from '@/components/admin/AdministerUser.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('AdministerUser.vue', () => {
  const mockAdminGetter = jest.fn();
  let store;
  let actions = {
    readUser: jest.fn()
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        admin: {
          namespaced: true,
          getters: {
            user: mockAdminGetter
          },
          actions: actions
        }
      }
    });
  });

  afterEach(() => {
    mockAdminGetter.mockReset();
    actions.readUser.mockReset();
  });

  it('renders ', async () => {
    mockAdminGetter.mockReturnValue({ fullName: 'alice', keycloakId: '1' });
    const wrapper = shallowMount(AdministerUser, {
      localVue,
      store, mocks: {
        $config: {
          keycloak: {
            serverUrl: 'servU',
            realm: 'theRealm'
          }
        }
      },
      propsData: { userId: 'me' }
    });
    await localVue.nextTick();

    expect(wrapper.text()).toMatch('alice');
    expect(wrapper.html()).toMatch('servU/admin/theRealm/console/#/realms/theRealm/users/1');
    expect(actions.readUser).toHaveBeenCalledTimes(1);
  });
});
