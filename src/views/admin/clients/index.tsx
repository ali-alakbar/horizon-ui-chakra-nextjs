'use client';
import {
  Box, Button, Flex, Heading, IconButton, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  NumberInput, NumberInputField, Table, Tbody, Td, Th, Thead, Tr,
  useColorModeValue, useDisclosure, useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { Client, clientsApi } from 'services/api';

const EMPTY: Partial<Client> = { name: '', url: '', order: 0 };

export default function ClientsView() {
  const [rows, setRows]   = useState<Client[]>([]);
  const [form, setForm]   = useState<Partial<Client>>(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const tableBg   = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');

  const load = () => clientsApi.index().then(setRows).catch(e => toast({ title: e.message, status: 'error' }));
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setEditId(null); onOpen(); }
  function openEdit(c: Client) { setForm({ name: c.name, url: c.url, order: c.order }); setEditId(c.id); onOpen(); }

  async function save() {
    try {
      if (editId) await clientsApi.update(editId, form);
      else await clientsApi.create(form);
      toast({ title: 'Saved', status: 'success' });
      onClose(); load();
    } catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  async function del(id: number) {
    if (!confirm('Delete this client?')) return;
    try { await clientsApi.destroy(id); load(); }
    catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color={textColor}>Clients</Heading>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={openCreate}>New Client</Button>
      </Flex>

      <Box bg={tableBg} borderRadius="xl" shadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr><Th>Name</Th><Th>URL</Th><Th>Order</Th><Th>Actions</Th></Tr>
          </Thead>
          <Tbody>
            {rows.map(c => (
              <Tr key={c.id}>
                <Td fontWeight="bold">{c.name}</Td>
                <Td><a href={c.url} target="_blank" rel="noreferrer">{c.url}</a></Td>
                <Td>{c.order}</Td>
                <Td>
                  <IconButton aria-label="edit"   icon={<MdEdit />}   size="sm" mr={2} onClick={() => openEdit(c)} />
                  <IconButton aria-label="delete" icon={<MdDelete />} size="sm" colorScheme="red" onClick={() => del(c.id)} />
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && <Tr><Td colSpan={4} textAlign="center" py={8} color="gray.400">No clients yet</Td></Tr>}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? 'Edit Client' : 'New Client'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" gap={4}>
            <Input placeholder="Name" value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="URL (https://...)" value={form.url ?? ''} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            <NumberInput value={form.order ?? 0} onChange={v => setForm(f => ({ ...f, order: Number(v) }))} min={0}>
              <NumberInputField placeholder="Display order" />
            </NumberInput>
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
