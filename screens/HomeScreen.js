import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, FlatList, Text, StyleSheet, Alert, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { createStackNavigator } from '@react-navigation/stack';

// ChatGPT 화면 컴포넌트
function ChatGPTScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* ChatGPT 화면 내용을 구현 */}
      <Text>Chat with ChatGPT</Text>
    </View>
  );
}

const Stack = createStackNavigator(); // Stack Navigator 생성

export default function HomeScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const tasksFromStorage = await AsyncStorage.getItem('TASKS');
      const parsedTasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : {};
      setTasks(parsedTasks);
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks.");
    }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const deleteTask = async (id) => {
    const updatedTasks = { ...tasks };
    updatedTasks[selectedDate] = updatedTasks[selectedDate].filter(task => task.id !== id);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
  };

  const renderRightActions = (progress, dragX, id) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Button title="Delete" color="red" onPress={() => deleteTask(id)} />
      </Animated.View>
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case '매우 중요하다':
        return 'red';
      case '중요하다':
        return 'orange';
      case '보통':
        return 'blue';
      case '중요하지 않다':
        return 'black';
      default:
        return 'grey'; // 기본 색상
    }
  };

  const renderTasks = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
    >
      <View style={styles.taskItem}>
        <Text style={styles.taskText}>{item.title}</Text>
        <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
          {item.priority}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Calendar 
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: 'blue',
          },
        }}
      />
      <FlatList
        data={tasks[selectedDate] || []}
        renderItem={renderTasks}
        keyExtractor={(item) => item.id}
        style={styles.tasksList}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Add Task"
          onPress={() => navigation.navigate('AddTask', { date: selectedDate })}
          color="green"
        />
        <Button
          title="Chat GPT"
          onPress={() => navigation.navigate('ChatGPT')}
          color="blue"
      />
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  tasksList: {
    flex: 1,
    marginTop: 16,
  },
  taskItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskText: {
    fontSize: 20,
    flex: 1,
  },
  deleteButton: {
    color: 'red',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
