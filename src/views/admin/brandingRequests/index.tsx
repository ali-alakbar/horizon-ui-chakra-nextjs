'use client';
import {
  Badge, Box, Flex, Heading, IconButton, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalHeader, ModalOverlay, SimpleGrid, Table, Tbody, Td,
  Text, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdDelete, MdVisibility } from 'react-icons/md';
import { BrandingRequest, brandingRequestsApi } from 'services/api';

const statusColor: Record<string, string> = {
  pending: 'yellow', in_progress: 'blue', completed: 'green',
};

export default function BrandingRequestsView() {
  const [rows, setRows]       = useState<BrandingRequest[]>([]);
  const [selected, setSelected] = useState<BrandingRequest | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast    = useToast();
  const tableBg  = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');

  const load = () =>
    brandingRequestsApi.index().then(setRows).catch(e => toast({ title: e.message, status: 'error' }));
  useEffect(() => { load(); }, []);

  function view(r: BrandingRequest) { setSelected(r); onOpen(); }

  async function del(id: number) {
    if (!confirm('Delete this request?')) return;
    try { await brandingRequestsApi.destroy(id); load(); }
    catch (e: any) { toast({ title: e.message, status: 'error' }); }
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Heading size="lg" color={textColor} mb={6}>Branding Requests</Heading>

      <Box bg={tableBg} borderRadius="xl" shadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr><Th>Business</Th><Th>Contact</Th><Th>Email</Th><Th>Status</Th><Th>Date</Th><Th>Actions</Th></Tr>
          </Thead>
          <Tbody>
            {rows.map(r => (
              <Tr key={r.id}>
                <Td fontWeight="bold">{r.business_name}</Td>
                <Td>{r.contact_name}</Td>
                <Td>{r.email}</Td>
                <Td><Badge colorScheme={statusColor[r.status] ?? 'gray'}>{r.status}</Badge></Td>
                <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
                <Td>
                  <IconButton aria-label="view"   icon={<MdVisibility />} size="sm" mr={2} onClick={() => view(r)} />
                  <IconButton aria-label="delete" icon={<MdDelete />}     size="sm" colorScheme="red" onClick={() => del(r.id)} />
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && <Tr><Td colSpan={6} textAlign="center" py={8} color="gray.400">No requests yet</Td></Tr>}
          </Tbody>
        </Table>
      </Box>

      {selected && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selected.business_name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <SimpleGrid columns={2} spacing={4}>
                {([
                  ['Contact', selected.contact_name],
                  ['Email', selected.email],
                  ['Phone', selected.phone],
                  ['Industry', selected.industry],
                  ['Client Type', selected.client_type],
                  ['Website', selected.website],
                  ['Project Type', selected.project_type],
                  ['Logo Type', selected.logo_type],
                  ['Target Audience', selected.target_audience],
                  ['Favorite Colors', selected.favorite_colors],
                  ['Deadline', selected.deadline],
                  ['Milestones', selected.milestones],
                ] as [string, string][]).map(([label, value]) => (
                  <Box key={label}>
                    <Text fontSize="xs" color="gray.400" fontWeight="bold">{label}</Text>
                    <Text>{value || '—'}</Text>
                  </Box>
                ))}
              </SimpleGrid>
              {selected.about_project && (
                <Box mt={4}>
                  <Text fontSize="xs" color="gray.400" fontWeight="bold">About Project</Text>
                  <Text>{selected.about_project}</Text>
                </Box>
              )}
              {selected.additional_notes && (
                <Box mt={4}>
                  <Text fontSize="xs" color="gray.400" fontWeight="bold">Additional Notes</Text>
                  <Text>{selected.additional_notes}</Text>
                </Box>
              )}
              {selected.logo_applications?.length > 0 && (
                <Box mt={4}>
                  <Text fontSize="xs" color="gray.400" fontWeight="bold">Logo Applications</Text>
                  <Flex wrap="wrap" gap={2} mt={1}>
                    {selected.logo_applications.map(a => <Badge key={a}>{a}</Badge>)}
                  </Flex>
                </Box>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
