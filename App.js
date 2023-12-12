import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'; // 별도의 파일에서 구현할 것입니다.
import AddTaskScreen from './screens/AddTaskScreen'; // 별도의 파일에서 구현할 것입니다.
import ChatGPTScreen from './screens/ChatGPTScreen'; // ChatGPT 화면 추가


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="ChatGPT" component={ChatGPTScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
