import React, { Component } from "react";
import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { supabase } from "../lib/supabase";

class ForgetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
      emailErrMsg: '',
      otp: '',
      isEmailSent: false,
      error: null,
    };
  }

  handleSendEmail = async () => {
    this.setState({ emailErrMsg: '', error: null });

    try {
      const { email } = this.state;
      if (email === '') {
        this.setState({ emailErrMsg: "Email cannot be empty" });
        return;
      }

      this.setState({ loading: true });
      const { error } = await supabase.auth.signInWithOtp({ email });
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.message });
      } else {
        this.setState({ isEmailSent: true });
      }
    } catch (error) {
      this.setState({ error: 'Error sending email: ' + error.message });
    }
  };

  handleVerifyOTP = async () => {
    this.setState({ error: null, loading: true });
    try {
      //.setState({ loading: true });
      const { email, otp } = this.state;
      // Use the token as the OTP for password reset
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.message });
      }
    } catch (error) {
      this.setState({ error: 'Error resetting password and logging in: ' + error.message });
    }
  };

  render() {
    const {
      email,
      loading,
      emailErrMsg,
      otp,
      isEmailSent,
      error
    } = this.state;

    return (
      <View style={styles.container}>
        {!isEmailSent ? (
          <>
            <View style={styles.innerContainer}>
              <Text style={styles.title}>Forget Password</Text>
              <View style={styles.emailContainer}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Email"
                  placeholderTextColor={"#dfd8dc"}
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => this.setState({ email: text })}
                />
              </View>
              {emailErrMsg !== "" && <Text style={styles.errorText}>{emailErrMsg}</Text>}
              <Button style={styles.button} onPress={this.handleSendEmail}>
                <Text style={styles.buttonText}>Continue</Text>
              </Button>
              {error && <Text style={styles.errorText}>{error}</Text>}
              {loading && <ActivityIndicator />}
            </View>
          </>
        ) : (
            <>
              <View style={styles.innerContainer1}>
                <Text style={styles.title1}>Enter OTP</Text>
                <Text style={styles.subtitle}>An 6 digit code has been sent to</Text>
                <Text style={styles.subtitle}>{email}</Text>
                <View style={styles.emailContainer}>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Enter OTP"
                    placeholderTextColor={"#dfd8dc"}
                    style={styles.input}
                    value={otp}
                    onChangeText={(text) => this.setState({ otp: text })}
                  />
                </View>
                <Button style={styles.button} onPress={this.handleVerifyOTP}>
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </Button>
                {error && <Text style={styles.errorText}>{error}</Text>}
                {loading && <ActivityIndicator />}
              </View>
            </>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    backButton: {
        position: 'left',
        top: -220,
        left: 16,
        zIndex: 1,
        padding: 10,
        borderRadius: 10,
        alignSelf: 'left'
      },
      backButton1: {
        position: 'left',
        top: -200,
        left: 16,
        zIndex: 1,
        padding: 10,
        borderRadius: 10,
        alignSelf: 'left'
      },
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      innerContainer1: {
        justifyContent: 'center',
        alignItems: 'flex-start',
      },
      innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        height: '35%',
        width: '50%',
        borderRadius: 60,
        marginBottom: 20,
      },
      title: {
        color: "black",
          marginTop: 20,
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 34,
          textAlign: 'left',
          marginRight: 50,
          marginBottom: 15,
      },
      title1: {
        color: "black",
          marginTop: 20,
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 34,
          textAlign: 'left',
          marginRight: 170,
          marginBottom: 15,
      },
      subtitle: {
        color: "black",
        fontSize: 16,
        alignItems: 'flex-start',
        textAlign: 'left',
        //marginBottom: 20,
      },
      input: {
        borderColor: "white",
        borderWidth: 1,
        borderBottomColor: "grey",
        backgroundColor: "white",
        width: 260,
        marginTop: 15,
      },
      button: {
        borderColor: "black",
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: "#c7dede",
        width: 320,
        height: 60,
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 20,
        //overflow: 'hidden',
      },
      buttonText: {
        color: "black",
        fontWeight: 'bold',
        fontSize: 19,
        textAlign: 'center',
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
      errorText: {
        color: "red",
      },
      emailIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 20,
      },
      otpIcon: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
        marginRight: 20,
      },
      emailContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 20,
      },
    
});

export default ForgetPasswordScreen;
