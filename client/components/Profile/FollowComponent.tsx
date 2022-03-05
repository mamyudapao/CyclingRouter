import {
  Avatar,
  Button,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { Follow } from "../../types/users";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type PropsType = {
  open: boolean;
  title: string;
  follows: Follow[];
  handleOpenClose: (open: boolean) => void;
};

const FollowComponent = (props: PropsType) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <Button onClick={handleClick} variant="outlined">
        {props.title}: {props.follows.length}
      </Button>
      <Dialog open={open}>
        <DialogTitle>{props.title}</DialogTitle>
        <List sx={{ pt: 0 }}>
          {props.follows.map((follow, index) => {
            return (
              <ListItem
                button
                key={index}
                onClick={() => {
                  router.push(`/${follow.follow.id}/profile`);
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Image
                      src={`https://ddx5fuyp1f5xu.cloudfront.net/${follow.follow.userImage}`}
                      layout="fill"
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={follow.follow.username}
                  secondary={follow.follow.biography}
                ></ListItemText>
              </ListItem>
            );
          })}
        </List>
        <Button onClick={handleClick}>閉じる</Button>
      </Dialog>
    </>
  );
};

export default FollowComponent;
