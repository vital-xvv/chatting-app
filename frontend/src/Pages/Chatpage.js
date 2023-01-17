import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../miscellaneous/SideDrawer";
import { Box } from "@chakra-ui/layout";

const Chatpage = () => {
  const { user, setUser } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box>
        {/* {user && <MyChats />}
        {user && <ChatBox />} */}
        {"ChatPage"}
      </Box>
    </div>
  );
};

export default Chatpage;
