import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import {checkWord, suggestWords, getDefition} from './api'

export default class WordDefinition extends React.Component {
    state = {
        definitions: [],
        word: ""
    }
    componentDidMount() {
        const word = this.props.navigation.state.params.word
        getDefition(word)
        .then((result) => {
            const data = result.data // array
            if (data.length > 0) {
                const definitions = data[0]
                this.setState({
                    word: definitions.word.replace(/&#(\d+);/g, function(match, dec) {
                        return String.fromCharCode(dec);
                    }),
                    definitions: definitions.definitions.map((def, i) => {
                        return {
                            ...def,
                            key: def.id
                        }
                    })
                })
            } else {
                this.setState({
                    word: "",
                    definitions: []
                })
            }
        })
        .catch(err => console.error(err))
    }
    render() {
        return (
            <FlatList
                data={this.state.definitions}
                renderItem={(item) => {
                    return (
                        <Text style={styles.definition} key={item.item.indexId}>{unescape(this.state.word)} ({item.item.base ? item.item.base : item.item.class}): {item.item.description}</Text>
                    )
                }}
            />
        )
    }
}
const styles = {
    definition: {
        padding: 10,
        fontSize: 20
    }
}