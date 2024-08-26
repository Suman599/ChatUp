import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState({});
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isFetching, setIsFetching] = useState(false);
  const toast = useToast();

  const fetchChats = async () => {
    if (isFetching) return; // Prevent fetching if already in progress
    setIsFetching(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);

      console.log("Fetched chats:", data); // Debugging line to check data structure

      setChats(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setChats([]); // Set chats to an empty array on error
    } finally {
      setIsFetching(false); // Reset fetching state
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    setLoggedUser(userInfo);
    if (user?.token) {
      fetchChats();
    }
  }, [user?.token, fetchAgain]); // Fetch again when fetchAgain or user.token changes

  console.log("Chats state:", chats); // Debugging line to check chats before render

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {isFetching ? (
          <ChatLoading />
        ) : (
          <Stack overflowY="scroll">
            {Array.isArray(chats) ? (
              chats.length > 0 ? (
                chats.map((chat) => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id} // Ensure this is unique for each chat
                  >
                    <Text>
                      {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text>No chats available</Text> // Handle the case where chats is empty
              )
            ) : (
              <Text>Unexpected data format received for chats.</Text> // Fallback if chats isn't an array
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
