import React from 'react';
import { SafeAreaView,StyleSheet } from 'react-native';
import { Button, Divider, Layout, TopNavigation,Text } from '@ui-kitten/components';

export const HomeScreen = ({ navigation }) => {

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
         {/* <TopNavigation
        alignment='center'
        title='Memriez'
        subtitle='Access Your Memories'
        /> */}
      {/* <Divider/> */}
      <Layout style={styles.container}>
        <Text style={styles.header} category='h2'>Memriez</Text>
        <Text style={styles.subheader} category='s1'>Dolor aliqua laboris laborum pariatur.</Text>
        <Button style={styles.button} onPress={navigateDetails} status='warning'>Scan Your Gift</Button>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
      marginTop: 25
    },
    header: {
        // marginBottom:24
    },
    subheader:{
        paddingHorizontal: 24,
        textAlign:'center'
    }
  });