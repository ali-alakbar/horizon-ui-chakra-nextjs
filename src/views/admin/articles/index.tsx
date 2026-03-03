'use client';
import {
  Box, Button, Flex, Heading, IconButton, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Select, Switch, Table, Tbody, Td, Text, Th, Thead, Tr,
  Textarea, useColorModeValue, useDisclosure, useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { Article, articlesApi } from 'services/api';

const EMPTY: Partial<Article> = { title: '', body: '', status: 0, published: false };

export default function ArticlesView() {
  const [rows, setRows]   = useState<Article[]>([]);
  const [form, setForm]   = useState<Partial<Article>>(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const tableBg  = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');

  const load = () => articlesApi.index().then(setRows).catch(e => toast({ title: e.message, status: 'error' }));
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setEditId(null); onOpen(); }
  function openEdit(a: Article) { setForm({ title: a.title, body: a.body, status: a.status, published: a.published }); setEditId(a.id); onOpen(); }

  async function save() {
    try {
      if (editId) await articlesApi.update(editId, form);
      else await articlesApi.create(form);
      toast({ title: editId ? 'Article updated' : 'Article created', status: 'success' });
      onClose(); load();
    } catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  async function del(id: number) {
    if (!confirm('Delete this article?')) return;
    try { await articlesApi.destroy(id); load(); }
    catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color={textColor}>Articles</Heading>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={openCreate}>New Article</Button>
      </Flex>

      <Box bg={tableBg} borderRadius="xl" shadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th><Th>Status</Th><Th>Published</Th><Th>Created</Th><Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map(a => (
              <Tr key={a.id}>
                <Td fontWeight="bold">{a.title}</Td>
                <Td>{a.status}</Td>
                <Td>{a.published ? '✅' : '—'}</Td>
                <Td>{new Date(a.created_at).toLocaleDateString()}</Td>
                <Td>
                  <IconButton aria-label="edit"   icon={<MdEdit />}   size="sm" mr={2} onClick={() => openEdit(a)} />
                  <IconButton aria-label="delete" icon={<MdDelete />} size="sm" colorScheme="red" onClick={() => del(a.id)} />
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && <Tr><Td colSpan={5} textAlign="center" py={8} color="gray.400">No articles yet</Td></Tr>}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? 'Edit Article' : 'New Article'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" gap={4}>
            <Input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Textarea placeholder="Body" rows={8} value={form.body ?? ''} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
            <Select value={form.status ?? 0} onChange={e => setForm(f => ({ ...f, status: Number(e.target.value) }))}>
              <option value={0}>Draft</option>
              <option value={1}>Published</option>
              <option value={2}>Archived</option>
            </Select>
            <Flex align="center" gap={3}>
              <Text>Published</Text>
              <Switch isChecked={form.published ?? false} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="brand" onClick={save}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
