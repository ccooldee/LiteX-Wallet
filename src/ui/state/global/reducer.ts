import { createSlice } from '@reduxjs/toolkit';

import { updateVersion } from '../global/actions';

export type TabOption = 'Wallet' | 'All' | 'LTC20' | 'Settings' | 'History';

export interface GlobalState {
  tab: TabOption;
  isUnlocked: boolean;
  isReady: boolean;
  isBooted: boolean;
}

export const initialState: GlobalState = {
  tab: 'Wallet',
  isUnlocked: false,
  isReady: false,
  isBooted: false
};

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    reset(state) {
      return initialState;
    },
    update(
      state,
      action: {
        payload: {
          tab?: TabOption;
          isUnlocked?: boolean;
          isReady?: boolean;
          isBooted?: boolean;
        };
      }
    ) {
      const { payload } = action;
      state = Object.assign({}, state, payload);
      return state;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateVersion, (state) => {
      // todo
    });
  }
});

export const globalActions = slice.actions;
export default slice.reducer;
