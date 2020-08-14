import React, { useCallback, useState } from 'react';

import { Application } from '@jsmodules/core';

import { useDidMount } from '../hooks/useDidMount';
import { AppContext } from './context';

interface IAppProviderProps {
    getInitialState: () => Promise<any>;
    children?: React.ReactNode;
}

const initState = {
    initialState: undefined,
    loading: true,
    error: undefined as Error | undefined,
};

export function AppProvider(props: IAppProviderProps) {
    const { children, getInitialState } = props;

    const [state, setState] = React.useState(initState);

    const refresh = useCallback(async () => {
        try {
            const asyncFunc = () => new Promise<ReturnType<typeof getInitialState>>((res) => res(getInitialState()));
            const ret = await asyncFunc();
            setState((prevState) => ({ ...prevState, initialState: ret, loading: false }));
        } catch (e) {
            setState((prevState) => ({ ...prevState, error: e, loading: false }));
        }
    }, []);

    useDidMount(async () => {
        refresh();
    });

    const setInitialState = useCallback(
        (initialState) => {
            setState((prevState) => {
                const prevInitialState = prevState.initialState;
                return { ...prevState, initialState: { ...prevInitialState, ...initialState }, loading: false };
            });
        },
        [state]
    );
    if (state.loading) {
        return null;
    }
    return (
        <AppContext.Provider
            value={{
                ...state,
                refresh,
                setInitialState,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}