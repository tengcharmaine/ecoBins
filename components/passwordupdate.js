import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { supabase } from "../lib/supabase";

class PasswordUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      loading: false,
      errMsg: "",
      passwordVisible: false,
    };
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      passwordVisible: !prevState.passwordVisible,
    }));
  };

  handlePasswordUpdate = async () => {
    this.setState({ errMsg: "" });

    const { password } = this.state;
    if (password === "") {
      this.setState({ errMsg: "Password cannot be empty" });
      return;
    }

    this.setState({ loading: true });
    const { error } = await supabase.auth.updateUser({ password });
    this.setState({ loading: false });

    if (error) {
      this.setState({ errMsg: error.message });
    }
  };

  render() {
    const { password, loading, errMsg, passwordVisible } = this.state;
    const styles = StyleSheet.create({
      container: {
        flex: 1, 
      },
      input: {
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "white",
        width: '75%',
        borderRadius: 5
      },
      title: {
        color: "black",
        fontSize: 20,
        marginBottom: 20, 
        fontWeight: "bold",
      },
      button: {
        borderColor: "black",
        alignItems: 'center',
        backgroundColor: "#c7dede",
        width: '40%',
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 10,
        
      },
      text1: {
        color: "black",
        marginTop: 20,
        textAlign: 'left',
        marginRight: 230,
        marginBottom: 5,
      },
      text2: {
        color: "black",
        textAlign: "left",
      },
      text3: {
        color: "black",
        marginTop: 20,
        textAlign: 'left',
        marginRight: 255,
        marginBottom: 5,
      },
      passwordInput: {
        backgroundColor: "white",
        borderRadius: 5
      },
      error: {
        color: "red",
        marginTop: 4,
        marginBottom: 5,
      },
      innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '80%', 
        marginBottom: 30, 
      },
      passwordIcon: {
        position: 'absolute',
        right: 10,
        top: '30%',
        transform: [{ translateY: -12 }],
      },
      backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 1,
      },
    });

    return (
      <View>
        {/* <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity> */}
        <View style={styles.innerContainer}>
          <Text style={styles.title}> Reset password </Text>
          <Text style={styles.text1}>Password</Text>
          <View style={styles.input}>
            <TextInput
              secureTextEntry={!passwordVisible}
              placeholder="Password"
              placeholderTextColor={"#dfd8dc"}
              style={styles.passwordInput}
              autoCapitalize='none'
              textContentType='password'
              value={password}
              onChangeText={(password) => this.setState({ password })}
            />
            <Button
              style={styles.passwordIcon}
              onPress={this.togglePasswordVisibility}
            >
              {/* <IconButton
                    icon={passwordVisible ? "eye-off" : "eye"}
                    color="#000"
                    size={20}
                /> */}
            </Button>
          </View>
          <Button style={styles.button} onPress={this.handlePasswordUpdate}>
            <Text style={styles.text1}> Update password </Text>
          </Button>
          {errMsg !== "" && <Text>{errMsg}</Text>}
          {loading && <ActivityIndicator />}
        </View>
      </View>
    );
  }
}

export default PasswordUpdate;
