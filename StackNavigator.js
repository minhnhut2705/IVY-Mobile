import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './screens/HomeScreen'
import { AntDesign, FontAwesome5, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import ProfileScreen from './screens/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import SongScreen from './screens/SongScreen';
import ArtistScreen from './screens/ArtistScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import { MD3Colors } from 'react-native-paper';
import AudioPlayer from './components/Player';
import { useAtom } from 'jotai';
import { routingStateAtom } from './store';
const Tab = createBottomTabNavigator()

const BottomTabs = () => {
    const [routingState, setRoutingState] = useAtom(routingStateAtom)
    return (
        <>
        <Tab.Navigator screenOptions={{
            tabBarStyle: {
                backgroundColor: "#131624",
                position: "absolute",
                bottom: 0,
                height: 50,
                left: 0,
                right: 0,
                shadowOpacity: 4,
                shadowRadius: 4,
                elevation: 0,
                shadowOffset: {
                    width: 0,
                    height: -4
                },
                borderTopWidth: 0
            }
            }}
            >
            <Tab.Screen name='Home' component={HomeScreen} options={{
                tabBarLabel: 'Home', headerShown: false, tabBarLabelStyle: { color: 'white' },
                tabBarIcon: ({ focused }) => {
                    return focused ? (
                        <Entypo name="home" size={24} color={MD3Colors.error50} />
                    ) : (<Entypo name="home" size={24} color="white" />)
                }
            }} />
            <Tab.Screen name='Song' component={SongScreen} options={{
                tabBarLabel: 'Song', headerShown: false, tabBarLabelStyle: { color: 'white' },
                tabBarIcon: ({ focused }) => {
                    return focused ? (
                        <Ionicons name="musical-notes" size={24} color={MD3Colors.error50} />
                    ) : (<Ionicons name="musical-notes" size={24} color="white" />)
                }
            }} />
            <Tab.Screen name='Artist' component={ArtistScreen} options={{
                tabBarLabel: 'Artist', headerShown: false, tabBarLabelStyle: { color: 'white' },
                tabBarIcon: ({ focused }) => {
                    return focused ? (
                        <FontAwesome5 name="diagnoses" size={24} color={MD3Colors.error50} />
                    ) : (<FontAwesome5 name="diagnoses" size={24} color='white' />)
                }
            }} />
            <Tab.Screen name='Playlist' component={PlaylistScreen} options={{
                tabBarLabel: 'Playlist', headerShown: false, tabBarLabelStyle: { color: 'white' },
                tabBarIcon: ({ focused }) => {
                    return focused ? (
                        <MaterialIcons name="playlist-play" size={24} color={MD3Colors.error50} />
                    ) : (<MaterialIcons name="playlist-play" size={24} color="white" />)
                }
            }} />
            <Tab.Screen name='Profile' component={ProfileScreen} options={{
                tabBarLabel: 'Profile', headerShown: false, tabBarLabelStyle: { color: 'white' },
                tabBarIcon: ({ focused }) => {
                    return focused ? (
                        <Ionicons name="person" size={24} color={MD3Colors.error50} />
                    ) : (<Ionicons name="person" size={24} color="white" />)
                }
                }} />
        </Tab.Navigator>
            <AudioPlayer visible={routingState.name != 'Song'} ></AudioPlayer >

        </>
    )
}

const Stack = createNativeStackNavigator()

const Navigation = () => {
    return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Main' component={BottomTabs} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
}

export default Navigation