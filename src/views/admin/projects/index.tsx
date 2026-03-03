'use client';
import {
  Box, Button, Flex, Heading, IconButton, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Table, Tbody, Td, Textarea, Th, Thead, Tr,
  useColorModeValue, useDisclosure, useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { Project, projectsApi } from 'services/api';

const EMPTY: Partial<Project> = { title: '', description: '', url: '' };

export default function ProjectsView() {
  const [rows, setRows]     = useState<Project[]>([]);
  const [form, setForm]     = useState<Partial<Project>>(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast    = useToast();
  const tableBg  = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');

  const load = () => projectsApi.index().then(setRows).catch(e => toast({ title: e.message, status: 'error' }));
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setEditId(null); onOpen(); }
  function openEdit(p: Project) { setForm({ title: p.title, description: p.description, url: p.url }); setEditId(p.id); onOpen(); }

  async function save() {
    try {
      if (editId) await projectsApi.update(editId, form);
      else await projectsApi.create(form);
      toast({ title: 'Saved', status: 'success' });
      onClose(); load();
    } catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  async function del(id: number) {
    if (!confirm('Delete this project?')) return;
    try { await projectsApi.destroy(id); load(); }
    catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color={textColor}>Projects</Heading>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={openCreate}>New Project</Button>
      </Flex>

      <Box bg={tableBg} borderRadius="xl" shadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead><Tr><Th>Title</Th><Th>URL</Th><Th>Description</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {rows.map(p => (
              <Tr key={p.id}>
                <Td fontWeight="bold">{p.title}</Td>
                <Td><a href={p.url} target="_blank" rel="noreferrer">{p.url}</a></Td>
                <Td maxW="300px" isTruncated>{p.description}</Td>
                <Td>
                  <IconButton aria-label="edit"   icon={<MdEdit />}   size="sm" mr={2} onClick={() => openEdit(p)} />
                  <IconButton aria-label="delete" icon={<MdDelete />} size="sm" colorScheme="red" onClick={() => del(p.id)} />
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && <Tr><Td colSpan={4} textAlign="center" py={8} color="gray.400">No projects yet</Td></Tr>}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? 'Edit Project' : 'New Project'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" gap={4}>
            <Input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Input placeholder="URL" value={form.url ?? ''} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            <Textarea placeholder="Description" rows={5} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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