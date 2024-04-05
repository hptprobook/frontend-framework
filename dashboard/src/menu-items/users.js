// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const users = {
  id: 'users',
  title: 'Users',
  type: 'group',
  children: [
    {
      id: 'list-user',
      title: 'List User',
      type: 'item',
      url: '/users/list',
      icon: icons.ChromeOutlined,
    },
    {
      id: 'add-user',
      title: 'Add Admin User',
      type: 'item',
      url: '/users/add',
      icon: icons.QuestionOutlined,
    },
  ],
};

export default users;
