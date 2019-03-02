import { createStackNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import UsersScreen from '../screens/UsersScreen';
import GhostsScreen from '../screens/GhostsScreen';
import PostsScreen from '../screens/PhotosScreen';
import CopyScreen from '../screens/CopyScreen';
import WhiteListScreen from '../screens/WhiteListScreen';
import ToolsScreen from '../screens/ToolsScreen';
import DrawerMenu from './DrawerMenu';
import FollowersNumber from '../screens/FollowersNumber';
import Purchase from '../screens/PurchaseScreen';

export default createStackNavigator({
  Login: {
    screen: LoginScreen, // LoginScreen
  },
  Home: {
    screen: DrawerMenu,
  },
  Users: {
    screen: UsersScreen,
  },
  Ghosts: {
    screen: GhostsScreen,
  },
  Posts: {
    screen: PostsScreen,
  },
  Copy: {
    screen: CopyScreen,
  },
  WhiteList: {
    screen: WhiteListScreen,
  },
  Tools: {
    screen: ToolsScreen,
  },
  FollowerNumber: {
    screen: FollowersNumber,
  },
  Purchase: {
    screen: Purchase,
  },
}, {
  headerMode: 'none',
});
  
