import { createStore } from 'vuex';

import exchange from './modules/exchange'
import user from './modules/user'
import toast from './modules/toast'
import opportunity from './modules/opportunity';

export default createStore({
    modules: {
        exchange,
        user,
        toast,
        opportunity
    }
});
