import { Icon } from '@chakra-ui/react';
import {
  MdDashboard,
  MdArticle,
  MdPeople,
  MdDesignServices,
  MdWorkOutline,
  MdPermMedia,
  MdOutlineRequestPage,
} from 'react-icons/md';
import { IRoute } from 'types/navigation';

const routes: IRoute[] = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Articles',
    layout: '/admin',
    path: '/articles',
    icon: <Icon as={MdArticle} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Clients',
    layout: '/admin',
    path: '/clients',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Services',
    layout: '/admin',
    path: '/services',
    icon: <Icon as={MdDesignServices} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Projects',
    layout: '/admin',
    path: '/projects',
    icon: <Icon as={MdWorkOutline} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Branding Requests',
    layout: '/admin',
    path: '/branding-requests',
    icon: <Icon as={MdOutlineRequestPage} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Media',
    layout: '/admin',
    path: '/media',
    icon: <Icon as={MdPermMedia} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;
