'use client';
import {
  Box, Button, Flex, Heading, IconButton, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Table, Tbody, Td, Textarea, Th, Thead, Tr,
  useColorModeValue, useDisclosure, useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { Service, servicesApi } from 'services/api';

const EMPTY: Partial<Service> = { title: '', description: '', slug: '' };

export default function ServicesView() {
  const [rows, setRows]     = useState<Service[]>([]);
  const [form, setForm]     = useState<Partial<Service>>(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast    = useToast();
  const tableBg  = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');

  const load = () => servicesApi.index().then(setRows).catch(e => toast({ title: e.message, status: 'error' }));
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setEditId(null); onOpen(); }
  function openEdit(s: Service) { setForm({ title: s.title, description: s.description, slug: s.slug }); setEditId(s.id); onOpen(); }

  async function save() {
    try {
      if (editId) await servicesApi.update(editId, form);
      else await servicesApi.create(form);
      toast({ title: 'Saved', status: 'success' });
      onClose(); load();
    } catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  async function del(id: number) {
    if (!confirm('Delete this service?')) return;
    try { await servicesApi.destroy(id); load(); }
    catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color={textColor}>Services</Heading>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={openCreate}>New Service</Button>
      </Flex>

      <Box bg={tableBg} borderRadius="xl" shadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead><Tr><Th>Title</Th><Th>Slug</Th><Th>Description</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {rows.map(s => (
              <Tr key={s.id}>
                <Td fontWeight="bold">{s.title}</Td>
                <Td fontFamily="mono" fontSize="sm">{s.slug}</Td>
                <Td maxW="300px" isTruncated>{s.description}</Td>
                <Td>
                  <IconButton aria-label="edit"   icon={<MdEdit />}   size="sm" mr={2} onClick={() => openEdit(s)} />
                  <IconButton aria-label="delete" icon={<MdDelete />} size="sm" colorScheme="red" onClick={() => del(s.id)} />
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && <Tr><Td colSpan={4} textAlign="center" py={8} color="gray.400">No services yet</Td></Tr>}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? 'Edit Service' : 'New Service'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" gap={4}>
            <Input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Input placeholder="Slug (e.g. brand-strategy)" value={form.slug ?? ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
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
