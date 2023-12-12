import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Doctor Appointment', completed: false },
    // ... 기타 할 일들
  ]);

  const toggleCompletion = id => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const confirmDeleteTask = id => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteTask(id) }
      ]
    );
  };

  const deleteTask = id => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Switch
        value={item.completed}
        onValueChange={() => toggleCompletion(item.id)}
      />
      <Text style={[styles.taskText, item.completed && styles.completed]}>
        {item.title}
      </Text>
      <TouchableOpacity onPress={() => confirmDeleteTask(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
  },
  taskText: {
    flex: 1,
    marginLeft: 8,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#a0a0a0',
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TaskList;
