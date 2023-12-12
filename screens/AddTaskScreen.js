import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Picker 임포트

export default function AddTaskScreen({ route, navigation }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState('보통'); // 중요도 상태
  const { date } = route.params;

  const handleAddTask = async () => {
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      date: date,
      priority: priority // 중요도 저장
    };

    try {
      const existingTasks = JSON.parse(await AsyncStorage.getItem('TASKS')) || {};
      const updatedTasks = {
        ...existingTasks,
        [date]: [...(existingTasks[date] || []), newTask],
      };

      await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving task', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <Text>중요도 선택:</Text>
      <Picker
        selectedValue={priority}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
      >
        <Picker.Item label="매우 중요하다" value="매우 중요하다" />
        <Picker.Item label="중요하다" value="중요하다" />
        <Picker.Item label="보통" value="보통" />
        <Picker.Item label="중요하지 않다" value="중요하지 않다" />
      </Picker>
      <Button title="Save Task" onPress={handleAddTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginBottom: 20,
  },
  picker: {
    width: '80%',
    marginBottom: 20,
  },
});
