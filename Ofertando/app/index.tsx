import React from 'react';
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';


export default function WelcomeScreen() {
  const router = useRouter(); // ⬅️ Aqui é onde o hook deve ser chamado

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Animatable.Image
        animation="flipInY"
          source={require('../assets/logo.png')}
          style={{
            width: '70%',
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
          <Animatable.Text animation="flipInY" style={styles.title}>Ofertando</Animatable.Text>
      </View>
      <Animatable.View delay= {600}animation="fadeInUp" style={styles.containerForm}>
      
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Acessar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCadastro} onPress={() => router.push('/cadastro')}>
          <Text style={styles.buttonTextCad}>Criar Conta</Text>
            </TouchableOpacity>
           
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#f5f5f5',
 },
  containerLogo: {
    marginTop: 0,
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
 containerForm: {
flex: 1,
backgroundColor: '#f5f5f5',
borderTopLeftRadius: 25,
borderTopRightRadius: 25,
paddingStart: '5%',
paddingEnd: '5%',

 },
 title: {
  fontSize: 40,
  fontWeight: 'bold',
  color: '#000',
  marginTop: -200,

 },
  
 button: {
  position: 'absolute',
  backgroundColor: '#ff7000',
  width: '80%',
  height: 50,
  borderRadius: 15,
  paddingVertical: 8,
  alignSelf: 'center',
  bottom: '35%',
  alignItems: 'center',
  justifyContent: 'center',
 },
 buttonCadastro: {
  position: 'absolute',
  backgroundColor: '#fff',
  width: '80%',
  height: 50,
  borderRadius: 15,
  paddingVertical: 8,
  alignSelf: 'center',
  bottom: '15%',
  alignItems: 'center',
  justifyContent: 'center',
  borderStyle: 'solid',
  borderWidth: 1,
 },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  buttonTextCad: {
    fontSize: 20,
    color: '#000',
    borderColor: '#000',
  },


});
