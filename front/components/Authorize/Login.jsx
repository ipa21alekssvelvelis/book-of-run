import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { storeToken, storeHearts } from '../../utils/storageUtils.jsx';
const Login = ({ sendCard, navigation, onLogin, setLoginToken }) => {
  const [isPasswordRevealed, setPasswordRevealed] = useState(false);
  const [errors, setErrors] = useState({}); 
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const togglePasswordVisibility = () => {
    setPasswordRevealed(!isPasswordRevealed);
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => { 
    const newErrors = {}; 
    
    if (!formData.username) {
        newErrors.username = 'Username is required.';
    } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters.';
    } else if (formData.username.length > 15) {
        newErrors.username = 'Username cannot exceed 15 characters.';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters and numbers.';
    }

    if (!formData.password) { 
        newErrors.password = 'Password is required.'; 
    } else if (formData.password.length < 8) { 
        newErrors.password = 'Password must be at least 8 characters.'; 
    }

    // if (!formData.confirm) {
    //     newErrors.confirm = 'Confirm password is required.';
    // } else if (formData.confirm.length < 8) {
    //     newErrors.confirm = 'Confirm password must be at least 8 characters.';
    // } else if (formData.confirm !== formData.password) {
    //     newErrors.confirm = 'Passwords do not match.';
    // } else {
    //     newErrors.confirm = '';
    // }

    // setErrors(newErrors);
    // if(Object.keys(newErrors).length === 0){
    //     console.log('Form submitted successfully!');
    //     setErrors({});
    // }

    console.log(formData)

    setErrors(newErrors);
    if(Object.keys(newErrors).length === 0){
      const backendErrors = {};
        try {
          const response = await fetch('http://172.20.10.2/api/login', {   //get local ip running ipconfig getifaddr en0 in mac terminal or through network settings. Also can find in expo start terminal, under metro hosted ip.
            method: 'POST',
            headers: {
              Accept: 'application/json',
              "Access-Control-Allow-Methods": "POST",
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
          });
          const responseData = await response.json();

          console.log(responseData)
          if (!response.ok) {
            if (responseData.error === 'Username is unrecognized') {
              backendErrors.username = 'User not found';
            }else if (responseData.error === 'Password is not correct'){
              backendErrors.password = 'Password is wrong';
            }
            setErrors(backendErrors);
          } else {
            console.log(responseData.access_token)
            onLogin();

            setLoginToken(responseData.access_token);
            // storeHearts(responseData.hearts);
            storeToken(responseData.access_token);
            navigation.navigate('Home');
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1,}}>
      <>
    <View style={{ width: 320, backgroundColor: '#181818', display: 'flex', alignItems: 'center', marginTop: 20, color: 'white', borderRadius: 20 }}>
        <Text style={{ textAlign: 'center', color: 'white', textTransform: 'uppercase', fontSize: 24, marginTop: 8,}}>Login</Text>
        <View style={{ margin: 2, }}>
            <Text style={{ marginTop: 4, marginBottom: 4, marginLeft: 5, color: 'white' }}>Username:</Text>
            <TextInput style={{ width: 300, height: 40, backgroundColor: '#323232', paddingHorizontal: 5, color: 'white', borderRadius: 8, borderWidth: 1,  borderColor: errors.username ? '#E42727' : 'transparent' }} placeholderTextColor="gray" placeholder='Username...' id='username' name='username' onChangeText={(text) => handleChange('username', text)} value={formData.username} maxLength={15}></TextInput>
            {errors.username && <Text style={{ marginTop: 4, marginBottom: 4, marginLeft: 5, color: 'red' }}>{errors.username}</Text>}
        </View>
        <View style={{ margin: 2, }}>
            <Text style={{ marginTop: 4, marginBottom: 4, marginLeft: 5, color: 'white' }}>Password:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput secureTextEntry={!isPasswordRevealed} style={{ width: 300, height: 40, backgroundColor: '#323232', paddingHorizontal: 5, color: 'white', borderRadius: 8, borderWidth: 1,  borderColor: errors.password ? '#E42727' : 'transparent' }} placeholderTextColor="gray" placeholder='Password...' id='password' name='password' onChangeText={(password) => handleChange('password', password)} value={formData.password}></TextInput>
            <TouchableOpacity onPress={togglePasswordVisibility} style={{ position: 'absolute', right: 10 }}>
                {isPasswordRevealed ? (
                <Svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='white' width={24} height={24}>
                    <Path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
                </Svg>
                ) : (
                <Svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='white' width={24} height={24}>
                    <Path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
                    <Path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </Svg>
                )}
            </TouchableOpacity>
            </View>
            {errors.password && <Text style={{ marginTop: 4, marginBottom: 4, marginLeft: 5, color: 'red' }}>{errors.password}</Text>}
        </View>
        <Pressable style={{backgroundColor: '#323232', width: 100, textAlign: 'center', margin: 2, marginTop: 8, marginBottom: 6, borderRadius: 6}} onPress={() => {handleSubmit()}}>
            <Text style={{color: 'white', margin: 2, textAlign: 'center', textTransform: 'uppercase', fontSize: 20,}}>Login</Text>
        </Pressable>
        <View style={{ margin: 2, marginTop: 8 }}>
          <View style={{ width: 290, backgroundColor: 'gray', height: 1}}></View>
          <Pressable style={{ textAlign: 'center', margin: 2, marginTop: 6, marginBottom: 6, borderRadius: 6}} onPress={sendCard}>
              <Text style={{color: 'white', margin: 2, textAlign: 'center', textTransform: 'uppercase', fontSize: 20,}}>Don't have an account?</Text>
          </Pressable>
        </View>
    </View>
    </>
    </TouchableWithoutFeedback>
  );
};

export default Login;
