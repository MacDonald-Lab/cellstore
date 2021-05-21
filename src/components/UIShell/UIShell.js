import React, { useEffect, useState } from 'react';

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

const UIShell = ({ organizationName }) => {
  const location = useLocation()
  const history = useHistory()



  const MenuItems = (props) => <>
    <HeaderMenu aria-label="Link 4" menuLinkName="Libraries" isCurrentPage={location.pathname === '/library'}>
      <HeaderMenuItem element={Link} to="/library" onClick={props.onClick}>Human Cells</HeaderMenuItem>
      <HeaderMenuItem element={Link} to="/library" onClick={props.onClick}>STEM Cells</HeaderMenuItem>
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



          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Notifications">
              <Notification20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="User Avatar">
              <UserAvatar20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="Settings" onClick={() => history.push('/settings')}>
              <Settings20 />
            </HeaderGlobalAction>

          </HeaderGlobalBar>
        </Header>
      }
    />
  )
};
export default UIShell;