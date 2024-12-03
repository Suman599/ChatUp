import React, { useState } from 'react';
import { VStack } from '@chakra-ui/react'; // Corrected Chakra UI import
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'; // Corrected Chakra UI imports
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Corrected for React Router v6

const Signup = () => {
  const [show, setshow] = useState(false);
  const [show1, setshow1] = useState(false);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
  const [pic, setpic] = useState();
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Using useNavigate for routing in React Router v6
  const toast = useToast();
  
  const handleClick = () => setshow(!show);
  const handleClick1 = () => setshow1(!show1);
  
  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const data = new FormData();
      data.append('file', pic);
      data.append('upload_preset', 'chatapp');
      data.append('cloud_name', 'dgpi8snug');
      fetch('https://api.cloudinary.com/v1_1/dgpi8snug/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: 'Please fill out all fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post('/api/user', { name, email, password, pic }, config);
      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats'); // Corrected to use navigate
    } catch (error) {
      console.error(error); // Log the full error for debugging
      toast({
        title: 'Error occurred!',
        status: 'error',
        description: error.response ? error.response.data.message : error.message,
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing='5px'>
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter your Name' onChange={(e) => setname(e.target.value)} />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your email' onChange={(e) => setemail(e.target.value)} />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter your password'
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width='4.5rem' onClick={handleClick}>
            <Button h='1.75rem' size='sm'>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='confirmpassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show1 ? 'text' : 'password'}
            placeholder='Enter your password to confirm'
            onChange={(e) => setconfirmpassword(e.target.value)}
          />
          <InputRightElement width='4.5rem' onClick={handleClick1}>
            <Button h='1.75rem' size='sm'>
              {show1 ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic'>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
