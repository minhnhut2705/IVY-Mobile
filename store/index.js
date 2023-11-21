import { atom, useAtom } from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';


export const defaultSong = {
    _id: "641c50234ab39bd00e7c6d80",
    name: "Xuôi Dòng Cửu Long",
    thumbnail: "https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/img%2Fsongs%2FXu%C3%B4i%20D%C3%B2ng%20C%E1%BB%ADu%20Long.jpg?alt=media&token=dd95cc1b-28c1-4dd4-aaba-f7d54c826ae8",
    banner: "https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/img%2Fsongs%2FXu%C3%B4i%20D%C3%B2ng%20C%E1%BB%ADu%20Long.jpg?alt=media&token=dd95cc1b-28c1-4dd4-aaba-f7d54c826ae8",
    songURL: "https://firebasestorage.googleapis.com/v0/b/athena-4d002.appspot.com/o/mp3%2FXu%C3%B4i%20D%C3%B2ng%20C%E1%BB%ADu%20Long.mp3?alt=media&token=b19d42bb-7668-4f85-bad9-76f43690b849",
    artist: [
        "641c58a94ab39bd00e7c6daa"
    ],
    stream: 1,
    genres: [
        "6364705f45683df115923736"
    ],
    type: "system",
    createdAt: "2023-03-23T13:12:03.414Z"
    ,
    updatedAt: "2023-10-12T14:02:33.965Z"
    ,
    __v: 0
}
export const currentUserAtom = atom(null)
export const soundPlayingAtom = atom(null)
export const routingStateAtom = atom({ key: "Home", name: "Home", params: null })
export const songStateAtom = atom({
    song: defaultSong,
    index: 0,
    currentTime: 0,
    durationTime: 0,
    progress: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false
})
