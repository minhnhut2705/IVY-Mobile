import { atom, useAtom } from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const currentUserAtom = atom(null)
