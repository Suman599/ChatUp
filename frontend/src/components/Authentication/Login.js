import React, { useState } from 'react';
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from '@chakra-ui/react';
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [show, setshow] = useState(false);
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading,setLoading]=useState(false);
    const toast=useToast();
    const history=useHistory();
    const handleClick = () => setshow(!show);
    const submitHandler=async()=>{
        setLoading(true);
        if(!email || !password){
        toast({
                title:"Please fill out all fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
            return;
        }
        
        try{
            const config={
                headers:{
                    "Content-type":"application/json",
                },
            };
            const { data } =await axios.post(
                "/api/user/login",
                { email, password },
                config
            );
            toast({
                title:"Registration Successful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            localStorage.setItem("userInfo",JSON.stringify(data));
            setLoading(false);
            history.push('/chats')
        }
        catch (error) {
    console.error(error); // Log the full error for debugging
    toast({
        title: "Error occurred!",
        status: "error",
        description: error.response ? error.response.data.message : error.message,
        duration: 5000,
        isClosable: true,
        position: "bottom"
    });
    setLoading(false);
}
    };

    return (
        <VStack spacing="5px">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                color="white"
                style={{ margin: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                onClick={() => {
                    setemail("guest@example.com");
                    setpassword("123456");
                }}
                variant="solid"
                colorScheme="red"
                width="100%"
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
}

export default Login;
