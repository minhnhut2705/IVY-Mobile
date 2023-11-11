import { atom, useAtom } from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export const currentUserAtom = atom(null)
export const songPlayingListAtom = atom([])
export const songStateAtom = atom({
    song: null,
    index: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false
})