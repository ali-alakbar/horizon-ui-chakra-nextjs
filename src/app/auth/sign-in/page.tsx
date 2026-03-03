'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Button, Flex, FormControl, FormLabel, Heading,
  Input, Text, useColorModeValue, useToast,
} from '@chakra-ui/react';
import { authApi, setToken } from 'services/api';

export default function SignIn() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();
  const toast  = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const bgColor   = useColorModeValue('white', 'navy.800');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await authApi.login(email, password);
      setToken(token);
      router.push('/admin/default');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, status: 'error', duration: 4000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('secondaryGray.300', 'navy.900')}>
      <Box bg={bgColor} p={8} borderRadius="xl" shadow="xl" w={{ base: '90%', md: '420px' }}>
        <Heading color={textColor} fontSize="36px" mb={2}>Sign In</Heading>
        <Text color="gray.400" mb={8}>Enter your admin credentials</Text>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel color={textColor} fontWeight="bold" fontSize="sm">Email</FormLabel>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel color={textColor} fontWeight="bold" fontSize="sm">Password</FormLabel>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </FormControl>
          <Button type="submit" isLoading={loading} w="full" colorScheme="brand" bg="brand.500" color="white" _hover={{ bg: 'brand.600' }} borderRadius="xl">
            Sign In
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
