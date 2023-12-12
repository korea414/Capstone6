import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet,
  KeyboardAvoidingView, Platform, FlatList, SafeAreaView
} from 'react-native';
import axios from 'axios';

const ChatGPTScreen = () => {
  const OPENAI_API_URL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
  const API_KEY = 'API'; // 보안을 위해 실제 API 키를 여기에 넣으세요
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const sendMessageToGPT = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          prompt: inputText,
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: { 'Authorization': `Bearer ${API_KEY}` },
        }
      );

      const botMessage = { text: response.data.choices[0].text.trim(), isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('OpenAI API 호출 오류:', error);
    }

    setInputText('');
  };

  const handleStartChat = () => {
    setIsChatVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>

        {/* Title and Welcome Message Section */}
        {!isChatVisible && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome to TODOGPT</Text>
            <Text style={styles.subtitle}>Ask anything, get your answer</Text>
          </View>
        )}

        {/* Information Cards Section */}
        {!isChatVisible && (
          <View style={styles.infoCardsContainer}>
            {/* Information cards can be added here */}
          </View>
        )}

        {/* Start Chat Button */}
        {!isChatVisible && (
          <TouchableOpacity style={styles.startChatButton} onPress={handleStartChat}>
            <Text style={styles.startChatButtonText}>Let's Chat →</Text>
          </TouchableOpacity>
        )}

        {/* Chat Interface Section */}
        {isChatVisible && (
          <View style={styles.chatContainer}>
            <FlatList
              style={styles.flatList}
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={[styles.message, item.isUser ? styles.user : styles.bot]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
              inverted={false}
            />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message here..."
                onSubmitEditing={sendMessageToGPT}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessageToGPT}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

// 여기에 스타일 정의
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#575757', // 다크 모드를 위한 배경색
  },
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center', // 타이틀과 부제목을 중앙 정렬
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#9e9e9e', // 서브타이틀 색상
    textAlign: 'center',
    marginTop: 8,
  },
  infoCardsContainer: {
    // 정보 카드 스타일링
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#1e1e1e', // 카드 배경색
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  infoCardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'normal',
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
  },
  flatList: {
    backgroundColor: '#575757', // 채팅 배경색
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#303030', // 입력란 테두리 색상
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#81c147', // 입력란 배경색
  },
  message: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 20,
    maxWidth: '80%',
    backgroundColor: '#0086b4', // 메시지 버블 배경색
    marginBottom: 10,
    marginTop: 0,
  },
  user: {
    backgroundColor: '#0B71EB', // 사용자 메시지 버블 색상 변경
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginRight: 8,
    marginLeft: 'auto',
  },
  // 봇 메시지 스타일
  bot: {
    backgroundColor: '#23395D', // 봇 메시지 버블 색상 변경
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 8,
    marginRight: 'auto',
  },
  messageText: {
    color: '#fff',
  },
  startChatButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1A73E8',
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 'auto',
  },
  startChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#1A73E8', // 전송 버튼 배경색
    borderRadius: 25,
    padding: 10,
  },
  sendButtonText: {
    color: '#fff', // 전송 버튼 텍스트 색상
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default ChatGPTScreen;
