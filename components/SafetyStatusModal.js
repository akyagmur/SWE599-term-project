import { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SafetyStatusModal = ({ isVisible, onRequestClose, onSubmit }) => {
  const [safetyStatus, setSafetyStatus] = useState('');
  const [additionalData, setAdditionalData] = useState('');

  const handleSubmit = () => {
    // Perform any validation or data processing if needed
    onSubmit(safetyStatus, additionalData);
    // Reset the form
    setSafetyStatus('');
    setAdditionalData('');
  };

  return (
    <Modal visible={isVisible} onRequestClose={onRequestClose} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Safety Status</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Safety Status:</Text>
          <TextInput
            style={styles.input}
            value={safetyStatus}
            onChangeText={setSafetyStatus}
            placeholder="Enter your safety status"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Additional Data:</Text>
          <TextInput
            style={styles.input}
            value={additionalData}
            onChangeText={setAdditionalData}
            placeholder="Enter additional data"
            multiline
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SafetyStatusModal;

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};