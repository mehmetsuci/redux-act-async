import {createAction} from 'redux-act'
import _defaults from 'lodash.defaults';

export const ASYNC_META = {
  REQUEST: "REQUEST",
  OK: "OK",
  ERROR: "ERROR"
}

const defaultOption = {
  request:{
    metaReducer: () => {
      return ASYNC_META.REQUEST
    }
  },
  ok:{
    metaReducer: () => {
      return ASYNC_META.OK
    }
  },
  error:{
    metaReducer: () => {
      return ASYNC_META.ERROR
    }
  }
}

export default function createActionAsync(description, api, options = defaultOption) {
  _defaults(options, defaultOption);
  let actions = {
    request: createAction(`${description}_REQUEST`, options.request.payloadReducer, options.request.metaReducer),
    ok: createAction(`${description}_OK`, options.ok.payloadReducer, options.ok.metaReducer),
    error: createAction(`${description}_ERROR`, options.error.payloadReducer, options.error.metaReducer)
  }

  let actionAsync = (...args) => {
    return (dispatch) => {
      dispatch(actions.request(...args));
      return api(...args)
      .then(res => {
        dispatch(actions.ok(res, ...args))
      })
      .catch(err => {
        dispatch(actions.error(err, ...args))
        if(options.rethrow) throw err;
      })
    }
  }
  actionAsync.request = actions.request;
  actionAsync.ok = actions.ok;
  actionAsync.error = actions.error;
  return actionAsync;

};
