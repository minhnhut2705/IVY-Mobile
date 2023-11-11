import { atom, useAtom } from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export const currentUserAtom = atom(null)
export const playingSongAtom = atom('')
export const songStateAtom = atom({
    song: null,
    isPlaying: false,
    isRandom: false,
    isRepeat: false
})