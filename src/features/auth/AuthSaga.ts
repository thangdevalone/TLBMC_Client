import authApi from '@/api/authApi';
import StorageKeys from '@/constants/storage-keys';
import { AuthRes, LoginForm } from '@/models';
import History from '@/router/History';

import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { authActions } from './AuthSlice';

function* handleLogin(action: PayloadAction<LoginForm>) {
    try {
        const res: AuthRes = yield call(authApi.login, action.payload);
        yield put(authActions.loginSuccess(res.data));
        localStorage.setItem(StorageKeys.TOKEN, res.tokens.access);
        History.push('/');
    } catch (error) {
        // Handle the error here
        yield put(authActions.loginFailed());
        yield delay(100);
        yield put(authActions.resetAction());
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* handleRegister(action: PayloadAction<any>) {
    try {
        const res: AuthRes = yield call(authApi.register, action.payload)
        yield put(authActions.registerSuccess(res.data))
        localStorage.setItem(StorageKeys.TOKEN, res.tokens.access)
        History.push('/');
    } catch (error) {
        // Handle the error here
        yield put(authActions.registerFailed());
        yield delay(100);
        yield put(authActions.resetAction());
    }
}
function handleLogout() {
    localStorage.removeItem(StorageKeys.TOKEN);
    History.push('/login');

}

export function* authSaga() {
    yield takeLatest(authActions.login.type, handleLogin);
    yield takeLatest(authActions.register.type, handleRegister);
    yield takeLatest(authActions.logout.type, handleLogout);
}
