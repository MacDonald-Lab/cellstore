import React from 'react';

import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from 'carbon-components-react';

import { Link, useLocation } from 'react-router-dom'

import {
  Settings20,
  Notification20,
  UserAvatar20,
} from '@carbon/icons-react';

// TODO: close sidebar on click
// TODO: Loop header items and make isCurrentPage dynamic


const UIShell = () => {
  const location = useLocation()

  return (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="CellSTORE Header">
        <SkipToContent />
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName element={Link} to="/" prefix="[Placeholder]">
          CellSTORE
        </HeaderName>
        <HeaderNavigation aria-label="CellSTORE Header">
          <HeaderMenuItem isCurrentPage={location.pathname === '/library'} element={Link} to="/library">Cell Library</HeaderMenuItem>
        </HeaderNavigation>
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          isPersistent={false}>
          <SideNavItems>
            <HeaderSideNavItems>
              <HeaderMenuItem element={Link} to="/library">Cell Library</HeaderMenuItem>
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
          <HeaderGlobalAction aria-label="Settings">
            <Settings20 />
          </HeaderGlobalAction>

        </HeaderGlobalBar>
      </Header>
    )}
  />
)};
export default UIShell;