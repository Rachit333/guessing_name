import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
} from 'react-native';
import {
  CheckCircle,
  ArrowDown,
  ArrowUp,
  RefreshCcw,
  Target,
  History,
  Flame,
  Lightbulb,
  CircleDot,
} from 'lucide-react-native';

export default function App() {
  const [target, setTarget] = useState(generateRandomNumber());
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [previousGuesses, setPreviousGuesses] = useState([]);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      Alert.alert('Invalid Input', 'Please enter a number between 1 and 100.');
      return;
    }

    if (previousGuesses.includes(num)) {
      Alert.alert('Repeated Guess', `You already tried ${num}. Try something else.`);
      return;
    }

    setPreviousGuesses(prev => [...prev, num]);
    setAttempts(prev => prev + 1);
    Keyboard.dismiss();

    const diff = Math.abs(num - target);

    if (num === target) {
      setMessage('correct');
    } else if (diff <= 5) {
      setMessage('very-close');
    } else if (diff <= 15) {
      setMessage('close');
    } else if (num < target) {
      setMessage('low');
    } else {
      setMessage('high');
    }

    setGuess('');
  };

  const resetGame = () => {
    setTarget(generateRandomNumber());
    setGuess('');
    setMessage('');
    setAttempts(0);
    setPreviousGuesses([]);
  };

  const renderMessage = () => {
    const Icon = {
      correct: CheckCircle,
      'very-close': Flame,
      close: Lightbulb,
      low: ArrowDown,
      high: ArrowUp,
    }[message];

    const messageText = {
      correct: `Correct! It was ${target}. You guessed it in ${attempts} tries.`,
      'very-close': 'Very close! You are nearly there.',
      close: 'You are getting warm...',
      low: 'Too low. Try again.',
      high: 'Too high. Try again.',
    }[message];

    if (!message) return null;

    return (
      <View style={styles.resultContainer}>
        <Icon size={28} color={message === 'correct' ? 'green' : '#666'} />
        <Text
          style={[
            styles.hintText,
            message === 'correct' && { color: 'green', fontWeight: '600' },
          ]}
        >
          {messageText}
        </Text>
      </View>
    );
  };

  const getGuessColor = (num) => {
    if (num === target) return '#28a745';
    const diff = Math.abs(num - target);
    if (diff <= 5) return '#ffc107'; 
    if (diff <= 15) return '#17a2b8'; 
    return '#ddd';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Target color="#000" size={32} />
        <Text style={styles.title}>Guess the Number</Text>
      </View>

      <Text style={styles.subtitle}>Enter a number between 1 and 100</Text>

      <TextInput
        style={styles.input}
        placeholder="Your guess..."
        value={guess}
        onChangeText={setGuess}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleGuess}>
        <Text style={styles.buttonText}>Submit Guess</Text>
      </TouchableOpacity>

      {renderMessage()}

      {previousGuesses.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <History size={20} color="#666" />
            <Text style={styles.historyLabel}>Previous Guesses:</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.guesses}>
              {previousGuesses.map((num, index) => (
                <View
                  key={index}
                  style={[
                    styles.guessItem,
                    { backgroundColor: getGuessColor(num) },
                  ]}
                >
                  <Text style={styles.guessText}>{num}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {message === 'correct' && (
        <TouchableOpacity style={styles.playAgain} onPress={resetGame}>
          <RefreshCcw color="#fff" size={20} />
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#444',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  hintText: {
    fontSize: 16,
    color: '#555',
    marginTop: 6,
    textAlign: 'center',
  },
  playAgain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 16,
  },
  historyContainer: {
    marginTop: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  historyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  guesses: {
    flexDirection: 'row',
    gap: 8,
  },
  guessItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
  },
  guessText: {
    fontSize: 16,
    color: '#333',
  },
});
