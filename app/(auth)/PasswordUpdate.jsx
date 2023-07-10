import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { supabase } from "../../lib/supabase";
import { useRoute } from '@react-navigation/native';


export default function PasswordUpdate() {
  const route = useRoute();

  const { userId } = route.params;

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handlePasswordUpdate = async () => {
    setErrMsg("");

    if (password === "") {
      setErrMsg("Password cannot be empty");
      return;
    }

    //const { data: { user }, error: userError } = await supabase.auth.getUser()
    setLoading(true);
    const { error } = await supabase.auth.updateUser(userId, {
      password: password,
    });
    setLoading(false);

    if (error) {
      setErrMsg(error.message);
      return;
    }
  };

  return (
    <View>
      <Text>Enter your new password:</Text>
      <TextInput
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handlePasswordUpdate} title="Update Password" />
      {errMsg !== "" && <Text>{errMsg}</Text>}
      {loading && <ActivityIndicator />}
    </View>
  );
}
