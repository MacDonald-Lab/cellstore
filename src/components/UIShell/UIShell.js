import { useContext } from 'react';
import UserContext from '../../contexts/UserProvider'
// import Electron from 'electron'

import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from 'carbon-components-react';

import { Link, useLocation, useHistory } from 'react-router-dom'

import {
  Settings20,
  Notification20,
  UserAvatar20,
  Add16
} from '@carbon/icons-react';

// TODO: Loop header items and make isCurrentPage dynamic
// FIXME: iscurrentpage styling on sidebar

const UIShell = ({ organizationName, libraries }) => {
  const location = useLocation()
  const history = useHistory()

  const user = useContext(UserContext.context)
var userAgent = navigator.userAgent.toLowerCase()

  const MenuItems = (props) => <>
    <HeaderMenu aria-label="Link 4" menuLinkName="Libraries" isCurrentPage={location.pathname === '/library'}>
      {libraries.map(item =>

        <HeaderMenuItem element={Link} to={"/library/" + item.name} onClick={props.onClick}>{item.friendlyName}</HeaderMenuItem>
      )}
      <HeaderMenuItem element={Link} to="/settings/create" onClick={props.onClick}><Add16 />Create library</HeaderMenuItem>
    </HeaderMenu>
    <HeaderMenuItem isCurrentPage={location.pathname === '/computations'} element={Link} to="/computations" onClick={props.onClick}>Computations</HeaderMenuItem>

  </>

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) =>
        <Header aria-label="CellSTORE Header">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName element={Link} to="/" prefix={organizationName}>CellSTORE</HeaderName>
          <HeaderNavigation aria-label="CellSTORE Header">
            <MenuItems />
          </HeaderNavigation>
          <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} isPersistent={false}>
            <SideNavItems>
              <HeaderSideNavItems>
                <MenuItems onClick={onClickSideNavExpand} />
              </HeaderSideNavItems>
            </SideNavItems>
          </SideNav>
          {userAgent.indexOf(' electron/') > -1 &&

            <div style={{ backgroundColor: 'red', width: '50%', height: '100%', margin: 'auto' }}
              className='bx--header__draggable' >
            </div>
          }


          <HeaderGlobalBar>
            <HeaderGlobalAction
              style={{ width: 'auto', paddingRight: 10, paddingLeft: 10 }}
              onClick={() => {
                fetch('/api/auth/logout')
                history.push('/login')

              }}
            >

              Log out of <span style={{ fontWeight: 'bold' }}>{user.username}</span>
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="Notifications">
              <Notification20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="User Avatar">
              <UserAvatar20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="Settings" onClick={() => history.push('/settings')}>
              <Settings20 />
            </HeaderGlobalAction>

          {userAgent.indexOf(' electron/') > -1 &&
            <HeaderGlobalAction aria-label="Minimize" onClick={() => console.log('minimize')}>
              <Settings20 />
            </HeaderGlobalAction>


            }

          </HeaderGlobalBar>
        </Header>
      }
    />
  )
};
export default UIShell;