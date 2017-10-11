import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import SocketIOClient from 'socket.io-client';
import {GiftedChat} from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {checkWord, suggestWords} from './api'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: "",
      messages: [],
      inputSpellcheck: [],
      footerWords: [],
      showSuggestions: false,
      showDefinitions: false,
      showMessageWords: false,
      showSpellcheck: false,
      showMessageWordDefinition: false,
      suggestionIndex: null
    }
    this.socket = SocketIOClient('http://kimaiserver.herokuapp.com');
    this.socket.on('test', this.addMessage)
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Kia Ora ki te kī mai! Tīmatatanga ki konei!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  addMessage = (message) => {
    const messages = [...this.state.messages, message]
    this.setState({
      messages: messages
    })
  }

  handleTextInput = (text) => {
    const words = text.split(" ").map((word, i) => {
      if ((this.state.inputSpellcheck.length > i) && this.state.inputSpellcheck[i].word === word) {
        return this.state.inputSpellcheck[i]
      }
      const isWordCorrect = checkWord(word)
      const suggestions = isWordCorrect ? [] : suggestWords(word)
      return {
        word: word,
        correct: checkWord(word),
        suggestions: suggestions
      }
    })
    this.setState({
      input: text,
      inputSpellcheck: words,
      showMessageWords: false,
      showSpellcheck: true
    })
  }

  // This is the footer rigdht below the chat screen
  renderFooter = () => {
    return (
      <View style={styles.footer}>
        {this.state.showSpellcheck && this.state.inputSpellcheck.map((word, i) => {
          return (
            <Text key={i} style={word.correct?styles.footerTextCorrect:styles.footerTextIncorrect} onPress={() => this.handleWordSuggestion(word, word.suggestions, i)}>
              {word.word}
            </Text>
          )
        })}
        {this.state.showMessageWords &&
          this.state.footerWords.map((word, i) =>{
            return (
              <Text key={i} style={{fontSize: 20, padding: 10}} onPress={() => this.handleMessageWordPress(word)}>
                {word}
              </Text>
            )
          })
        }
      </View>
    )
  }

  handleMessageWordPress = (word) => {
    this.setState({
      showMessageWordDefinition: true,
      messageWordDefinition: word,
      showSuggestions: false
    })
  }

  handleWordSuggestion = (word, suggestions = [], i) => {
    console.log(suggestions)
    if (suggestions.length > 0) {
      this.setState({
        footerWords: suggestions,
        suggestionIndex: i,
        showSuggestions: true,
        showMessageWordDefinition: false
      })
    }
  }

  // This is the footer right at the bottom
  renderChatFooter = () => {
      return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {this.state.showSuggestions && this.state.footerWords.map((word, i) => {
          return (
            <Text key={i} onPress={() => this.replaceWord(word)} style={{fontSize: 20, padding: 10}}>
              {word}
            </Text>
          )
        })}
        {this.state.showMessageWordDefinition &&
            <Text style={{fontSize: 20, padding: 10}}>{this.state.messageWordDefinition}</Text>
        }
        </View>
      )
  }

  replaceWord = (word) => {
    const newInput = this.state.input.split(" ")
    newInput[this.state.suggestionIndex] = word
    const newInputJoined = newInput.join(" ")
    this.setState({
      input: newInputJoined,
      showSuggestions: false,
      suggestionIndex: null,
      footerWords: []
    })
    this.handleTextInput(newInputJoined)
  }

  onLongPress = (context, message) => {
    const footerWords = message.text.split(" ")
    this.setState({
      footerWords,
      showMessageWords: true
    })
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.title}>Kī Mai</Text>
          <GiftedChat
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: 1,
            }}
            renderFooter={this.renderFooter}
            renderChatFooter={this.renderChatFooter}
            onLongPress={this.onLongPress}
            text={this.state.input}
            onInputTextChanged={this.handleTextInput}
          />
          <KeyboardSpacer/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FCF3DB',
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
  },
  header: {
    top: 30,
    alignItems: 'center' 
  },
  footer: {
    flexDirection: 'row',
    padding: 10
  },
  footerTextCorrect: {
    fontSize: 20,
    padding: 10
  },
  footerTextIncorrect: {
    fontSize: 20,
    backgroundColor: 'tomato',
    padding: 10
  }
});
