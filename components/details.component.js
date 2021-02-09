import React from 'react';
import {  SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    Alert,
    Platform,
    TouchableOpacity } from 'react-native';
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);



export const DetailsScreen = ({ navigation }) => {

    let state = {
        log: "Ready...",
        text: ""
    }
    const componentDidMount = () =>  {
        NfcManager.start();
    }
    const componentWillUnMount = () => {
        cleanUp();
    }
    const cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
    const onChangeText = (text) => {
        state.text = text;
    }
    writeData = async () => {
        if (!state.text){
            Alert.alert("Enter some text");
            return;
        }
        try {
                let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
                let resp = await NfcManager.requestTechnology(tech, {
                    alertMessage: "Ready for magic"
                });
                let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;
                        let text = state.text;
                        let fullLength = text.length + 7;
                        let payloadLength = text.length + 3;
                resp = await cmd([0xA2, 0x04, 0x03, fullLength, 0xD1, 0x01]);
                        resp = await cmd([0xA2, 0x05, payloadLength, 0x54, 0x02, 0x65]) // T enYourPayload
                let currentPage = 6;
                        let currentPayload = [0xA2, currentPage, 0x6E]; // n
                for(let i=0; i<text.length; i++){
                            currentPayload.push(text.charCodeAt(i));
                            if (currentPayload.length == 6){
                                resp = await cmd(currentPayload);
                                currentPage += 1;
                                currentPayload = [0xA2, currentPage]
                            }
                        }
                currentPayload.push(254);
                        while(currentPayload.length < 6){
                            currentPayload.push(0);
                        }
                resp = await cmd(currentPayload);
                        state({
                            log: resp.toString() === "10" ? "Success" : resp.toString()
                        })
                //sendMifareCommandIOS
                    } catch(err){
                        state({
                            log: err.toString()
                        })
                        cleanUp();
                    }
    }

    readData = async () => {
        try {
            let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
            let resp = await NfcManager.requestTechnology(tech, {
                alertMessage: "Ready for magic"
            });
        let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;
        resp = await cmd([0x3A, 4, 4])
                let payloadLength = parseInt(resp.toString().split(",")[1]);
                let payloadPages = Math.ceil(payloadLength / 4);
                let startPage = 5;
                let endPage = startPage + payloadPages - 1;
        resp = await cmd([0x3A, startPage, endPage]);
                let bytes = resp.toString().split(",");
                let text = ""
        for(let i=0; i<bytes.length; i++){
                    if (i<5){
                        continue;
                    }
        if (parseInt(bytes[i]) === 254){
                        break;
                    }
        text = text + String.fromCharCode(parseInt(bytes[i]));
                }
        state.og= text;
            } catch(err){
            
                state.log= err.toString();
                cleanUp();
            }
    }

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title='Scan Your Gift' style={styles.topNavigation}  alignment='center' accessoryLeft={BackAction}/>
      <Divider/>
      <Layout style={styles.container}>
        <TouchableOpacity
                    onPress={writeData}
                    style={styles.buttonWrite}>
                    <Text style={styles.buttonText} >Write</Text>
        </TouchableOpacity>
        <TouchableOpacity
                    onPress={readData}
                    style={styles.buttonRead}>
                    <Text style={styles.buttonText}>Read</Text>
        </TouchableOpacity>
      </Layout>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    topNavigation: {
        paddingTop:15
    },
   buttonText:{
        marginTop: 20
    },
    textInput: {
        marginLeft: 20,
        marginRight: 20,
        height: 50,
        marginBottom: 10,
        textAlign:'center',
        color: 'black'
    },
    buttonWrite: {
        marginLeft: 20,
        marginRight: 20,
        height: 50,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#9D2235'
    },
    buttonRead: {
        marginLeft: 20,
        marginRight: 20,
        height: 50,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#006C5B'
    },
    buttonText: {
        color: 'white'
    },
    log: {
        marginTop: 30,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
  });