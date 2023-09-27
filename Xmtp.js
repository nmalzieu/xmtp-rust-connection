import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { Client } from "@xmtp/react-native-sdk";


export default function Xmtp() {
  const clientRef = useRef(null);
  const [isInternetReachable, setIsInternetReachable] = useState(false);

  const reachableRef = useRef(isInternetReachable);
  useEffect(() => {
    reachableRef.current = isInternetReachable;
  }, [isInternetReachable]);

  useEffect(() => {
    const unsubscribeNetworkInfo = NetInfo.addEventListener((netState) => {
      const reachable = !!netState.isInternetReachable;
      if (reachable !== reachableRef.current) {
        setIsInternetReachable(reachable);
      }
    });

    return () => {
      unsubscribeNetworkInfo();
    };
  }, [setIsInternetReachable]);

  const listConversations = useCallback(async () => {
    try {
      if (!clientRef.current) {
        clientRef.current = await Client.createRandom();
      }
      const before = new Date().getTime();
      const conversations = await clientRef.current.conversations.list();
      const after = new Date().getTime();
      const duration = (after - before) / 1000;
      alert(`Listing ${conversations.length} convos took ${duration} seconds`);
    } catch (e) {
      alert(`Error: ${e}`);
    }
  }, []);
  return (
    <View style={styles.container}>
      <Text>Internet reachable: {isInternetReachable ? "YES" : "NO"}</Text>
      <Button title="List Conversations" onPress={listConversations} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
