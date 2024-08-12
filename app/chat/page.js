'use client'

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm here to help you better understand your taste in music. Let me know some songs you enjoy listening to!",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      color="#FFFFFF"
      sx={{
        background: 'linear-gradient(to right, #3B82F6, #9333EA)',
      }}
    >
      <Stack
        direction={'column'}
        width="600px"
        height="80vh"
        borderRadius={8}
        bgcolor="#111111"
        p={3}
        spacing={2}
        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)"
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{ scrollbarWidth: 'thin', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#555' } }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? '#3E3E3E'
                    : '#007AFF'
                }
                color="white"
                borderRadius={8}
                p={2}
                maxWidth="75%"
              >
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {message.content}
                </ReactMarkdown>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Type a message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#3E3E3E',
                color: '#FFF',
                borderRadius: '16px',
              },
              '& .MuiInputLabel-root': {
                color: '#AAAAAA',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3E3E3E',
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              bgcolor: '#007AFF',
              borderRadius: '16px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#0062CC',
              },
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
