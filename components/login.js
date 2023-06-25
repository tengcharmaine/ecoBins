import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
//import { useNavigation, NavigationContainer } from '@react-navigation/native';
// import { Link } from "expo-router";
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer, useNavigation } from '@react-navigation/native';

//import { supabase } from "../../lib/supabase";
import { supabase } from "../lib/supabase";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      errMsg: '',
      emailErrMsg: '',
      passwordErrMsg: ''
    };
  }

  handleSubmit = async () => {
    const { email, password } = this.state;
    this.setState({
      errMsg: '',
      emailErrMsg: '',
      passwordErrMsg: ''
    });

    if (email === '' && password === '') {
      this.setState({ emailErrMsg: 'Email cannot be empty' });
      this.setState({ passwordErrMsg: 'Password cannot be empty' })
      return;
    } else if (password === '') {
      this.setState({ passwordErrMsg: 'Password cannot be empty' });
      return;
    }

    this.setState({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    this.setState({ loading: false });

    if (error) {
      this.setState({ errMsg: error.message });
    }
  }

  render() {
    const { email, password, loading, errMsg, emailErrMsg, passwordErrMsg } = this.state;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      input: {
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "white",
        width: '75%',
        borderRadius: 5
      },
      button: {
        borderColor: "black",
        alignItems: 'center',
        backgroundColor: "#c7dede",
        width: '25%',
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
      error: {
        color: "red",
        marginTop: 4,
        marginBottom: 5,
      }
    });

    return (
      <View style={styles.container}>
        {/* <Image source={require('./../../images/finalicon.jpeg')} style={{ height: '30%', width: '50%', borderRadius: 60 }} /> */}
        <Text style={styles.text3}>Email</Text>
        <TextInput
          placeholder='Email'
          placeholderTextColor={"#dfd8dc"}
          style={styles.input}
          autoCapitalize='none'
          textContentType='emailAddress'
          value={email}
          onChangeText={email => this.setState({ email })}
        />
        {emailErrMsg !== "" && <Text style={styles.error}>{emailErrMsg}</Text>}

        <Text style={styles.text1}>Password</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder='Password'
          placeholderTextColor={"#dfd8dc"}
          autoCapitalize='none'
          textContentType='password'
          value={password}
          onChangeText={password => this.setState({ password })}
        />
        {passwordErrMsg !== "" && <Text style={styles.error}>{passwordErrMsg}</Text>}

        <Button style={styles.button} onPress={this.handleSubmit}>
          <Text style={styles.text1}> Login </Text>
        </Button>

        {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
        {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("../app/(auth)/Register")}> */}
          <Button style={styles.text2}>
            <Text>First time user? Register here.</Text>
          </Button>
        {/* </TouchableOpacity> */}
      </View>
    );
  }
}

// const LoginPageWithNavigation = (props) => {
//     const navigation = useNavigation();
  
//     return <LoginPage {...props} navigation={navigation} />;
//   };
  
//   export default LoginPageWithNavigation;

// import React, { Component } from "react";
// import { StyleSheet, View, Image } from "react-native";
// import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
// import { Link } from "expo-router";
// import { supabase } from "../lib/supabase";

// export default class LoginPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email: '',
//       password: '',
//       loading: false,
//       errMsg: '',
//       emailErrMsg: '',
//       passwordErrMsg: ''
//     };
//   }

//   handleSubmit = async () => {
//     const { email, password } = this.state;
//     this.setState({
//       errMsg: '',
//       emailErrMsg: '',
//       passwordErrMsg: ''
//     });

//     if (email === '') {
//       this.setState({ emailErrMsg: 'Email cannot be empty' });
//       return;
//     }

//     if (password === '') {
//       this.setState({ passwordErrMsg: 'Password cannot be empty' });
//       return;
//     }

//     this.setState({ loading: true });
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     this.setState({ loading: false });

//     if (error) {
//       this.setState({ errMsg: error.message });
//     }
//   }

//   render() {
//     const { email, password, loading, errMsg, emailErrMsg, passwordErrMsg } = this.state;

//     const styles = StyleSheet.create({
//       container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//       input: {
//         borderColor: "black",
//         borderWidth: 1,
//         backgroundColor: "white",
//         width: '75%',
//         borderRadius: 5
//       },
//       button: {
//         borderColor: "black",
//         alignItems: 'center',
//         backgroundColor: "#c7dede",
//         width: '25%',
//         marginTop: 20,
//         marginBottom: 10,
//         borderRadius: 10,
//       },
//       text1: {
//         color: "black",
//         marginTop: 20,
//         textAlign: 'left',
//         marginRight: 230,
//         marginBottom: 5,
//       },
//       text2: {
//         color: "black",
//         textAlign: "left",
//       },
//       text3: {
//         color: "black",
//         marginTop: 20,
//         textAlign: 'left',
//         marginRight: 255,
//         marginBottom: 5,
//       },
//       error: {
//         color: "red",
//         marginTop: 4,
//         marginBottom: 5,
//       }
//     });

//     return (
//       <View style={styles.container}>
//         <Image source={require('./../../images/finalicon.jpeg')} style={{ height: '30%', width: '50%', borderRadius: 60 }} />
//         <Text style={styles.text3}>Email</Text>
//         <TextInput
//           placeholder='Email'
//           placeholderTextColor={"#dfd8dc"}
//           style={styles.input}
//           autoCapitalize='none'
//           textContentType='emailAddress'
//           value={email}
//           onChangeText={email => this.setState({ email })}
//         />
//         {emailErrMsg !== "" && <Text style={styles.error}>{emailErrMsg}</Text>}

//         <Text style={styles.text1}>Password</Text>
//         <TextInput
//           secureTextEntry
//           style={styles.input}
//           placeholder='Password'
//           placeholderTextColor={"#dfd8dc"}
//           autoCapitalize='none'
//           textContentType='password'
//           value={password}
//           onChangeText={password => this.setState({ password })}
//         />
//         {passwordErrMsg !== "" && <Text style={styles.error}>{passwordErrMsg}</Text>}

//         <Button style={styles.button} onPress={this.handleSubmit}>
//           <Text style={styles.text1}> Login </Text>
//         </Button>

//         {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
//         {loading && <ActivityIndicator />}
//         <Link href="/Register">
//           <Button style={styles.text2}>
//             <Text>First time user? Register here.</Text>
//           </Button>
//         </Link>
//       </View>
//     );
//   }
// }
