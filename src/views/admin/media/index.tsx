'use client';
import {
  Box, Button, Flex, Grid, Heading, IconButton, Image, Input, Text,
  useColorModeValue, useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { MdDelete, MdUpload } from 'react-icons/md';
import { Medium, mediaApi } from 'services/api';

export default function MediaView() {
  const [items, setItems]   = useState<Medium[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast    = useToast();
  const bgCard   = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');

  const load = () => mediaApi.index().then(setItems).catch(e => toast({ title: e.message, status: 'error' }));
  useEffect(() => { load(); }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setLoading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('medium[file]', file);
        await mediaApi.create(fd);
      }
      toast({ title: `${files.length} file(s) uploaded`, status: 'success' });
      load();
    } catch (err: any) {
      toast({ title: err.message, status: 'error' });
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function del(id: number) {
    if (!confirm('Delete this file?')) return;
    try { await mediaApi.destroy(id); load(); }
    catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  const isImage = (m: Medium) => m.content_type?.startsWith('image/');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color={textColor}>Media</Heading>
        <Button leftIcon={<MdUpload />} colorScheme="brand" isLoading={loading} onClick={() => inputRef.current?.click()}>
          Upload Files
        </Button>
        <Input ref={inputRef} type="file" multiple display="none" onChange={upload} />
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap={4}>
        {items.map(m => (
          <Box key={m.id} bg={bgCard} borderRadius="xl" overflow="hidden" shadow="sm" position="relative" role="group">
            {isImage(m) ? (
              <Image src={m.url} alt={m.filename} w="full" h="140px" objectFit="cover" />
            ) : (
              <Flex h="140px" align="center" justify="center" bg="gray.100">
                <Text fontSize="xs" color="gray.500" textAlign="center" px={2}>{m.filename}</Text>
              </Flex>
            )}
            <Box p={2}>
              <Text fontSize="xs" isTruncated title={m.filename}>{m.filename}</Text>
              <Text fontSize="xs" color="gray.400">{new Date(m.created_at).toLocaleDateString()}</Text>
            </Box>
            <IconButton
              aria-label="delete" icon={<MdDelete />} size="xs" colorScheme="red"
              position="absolute" top={2} right={2} opacity={0}
              _groupHover={{ opacity: 1 }} transition="opacity 0.2s"
              onClick={() => del(m.id)}
            />
          </Box>
        ))}
        {items.length === 0 && (
          <Text color="gray.400" gridColumn="1/-1" textAlign="center" py={12}>No media yet — upload some files</Text>
        )}
      </Grid>
    </Box>
  );
}