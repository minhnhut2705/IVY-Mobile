import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './screens/HomeScreen'
import { AntDesign, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';
import ProfileScreen from './screens/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import SongScreen from './screens/SongScreen';
const Tab = createBottomTabNavigator()

const BottomTabs = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarStyle: {
                backgroundColor: "rgba(0,0,0,0.5)",
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
        }}>
            <Tab.Screen name='Home' component={HomeScreen} options={{
                tabBarLabel: 'Home', headerShown: false, tabBarLabelStyle: { color: 'white' },
                tabBarIcon: ({ focused }) => {
                    return focused ? (
                        <Entypo name="home" size={24} color="white" />
                    ) : (<AntDesign name="home" size={24} color="white" />)
                }
            }} />
            <Tab.Screen name='Song' component={SongScreen} options={{
                tabBarLabel: 'Song', headerShown: false, tabBarLabelStyle: { color: 'white' },
                tabBarIcon: ({ focused }) => {
                    return focused ? (
                        <Ionicons name="musical-notes" size={24} color="white" />
                    ) : (<Ionicons name="musical-notes-outline" size={24} color="white" />)
                }
            }} />
            <Tab.Screen name='Profile' component={ProfileScreen} options={{
                tabBarLabel: 'Profile', headerShown: false, tabBarLabelStyle: { color: 'white' },
                tabBarIcon: ({ focused }) => {
                    return focused ? (
                        <Ionicons name="person" size={24} color="white" />
                    ) : (<Ionicons name="person-outline" size={24} color="white" />)
                }
            }} />

        </Tab.Navigator>
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