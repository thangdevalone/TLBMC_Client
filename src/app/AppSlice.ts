import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type Theme = 'dark' | 'light';

export interface AppState {
    theme: Theme;
    commandHide: boolean;
    width:number;
}

const initialState: AppState = {
    theme: 'light',
    commandHide: true,
    width:window.innerWidth
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
        setCommandHide: (state, action: PayloadAction<boolean>) => {
            state.commandHide = action.payload;
        },
        setWidth(state,action:PayloadAction<number>){
            if (state.width === undefined || Math.abs(state.width - action.payload) >= 20) {
              state.width = action.payload;
            }
          }
    },
});
export const appActions = appSlice.actions;
const appReducer = appSlice.reducer;
export default appReducer;
