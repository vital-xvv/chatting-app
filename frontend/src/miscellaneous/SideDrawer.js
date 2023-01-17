import React, { useState } from "react";
import { Avatar, Box, MenuDivider, Text } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { BsSearch } from "react-icons/bs";
import { BsFillBellFill } from "react-icons/bs";
import { AiFillCaretDown } from "react-icons/ai";
import { ChatState } from "../Context/ChatProvider";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setUSer } = ChatState();

  return (
    <>
      <Flex
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
      >
        <Tooltip
          label="Search users to start a chat"
          hasArrow
          placement="bottom"
        >
          <Button variant="ghost">
            <BsSearch />
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl">Hablo</Text>
        <div style={{ display: "flex", alighnItems: "center" }}>
          <Menu>
            <MenuButton p={1}>
              <BsFillBellFill size={20} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<AiFillCaretDown />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <MenuItem>My profile</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Flex>
    </>
  );
};

export default SideDrawer;
