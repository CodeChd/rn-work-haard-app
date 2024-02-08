import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  const onChangeText = (payload) => setText(payload);

  const saveTodos = async (todoSave) => {
    await AsyncStorage.setItem("TODOS", JSON.stringify(todoSave));
  };

  const addTodo = async () => {
    if (text === "") return;

    const newTodos = Object.assign({}, todos, {
      [Date.now()]: { text, working },
    });

    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  const TODOS_DATA = async () => {
    const res = await AsyncStorage.getItem("TODOS");
    const parsedData = JSON.parse(res);

    setTodos(parsedData);
  };

  const deleteTodo = async (key) => {
    Alert.alert("Delete this todo?", "Are you sure", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[key];
          setTodos(newTodos);
          await saveTodos(newTodos);
        },
      },
    ]);
  };

  useEffect(() => {
    TODOS_DATA();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addTodo}
        onChangeText={onChangeText}
        value={text}
        returnKeyType="done"
        autoCapitalize="words"
        placeholder={working ? "Add a Todo" : "Where do you wanna go?"}
        style={styles.input}
      />

      <ScrollView>
        {Object.keys(todos).map((keys) =>
          todos[keys].working === working ? (
            <View key={keys} style={styles.todos}>
              <Text style={styles.todoText}>{todos[keys].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(keys)}>
                <Fontisto name="trash" size={20} color="#a8a29e" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  btnText: {
    fontSize: 44,
    color: "white",
    // color: theme.gray,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  todos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.accent,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  todoText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
});
