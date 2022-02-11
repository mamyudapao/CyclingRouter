import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Image from "next/Image";
import { Tweet } from "../../types/timelines";
import { parseJSON, getDate, getYear, getMonth } from "date-fns";

const TweetComponent = (props: Tweet) => {
  const [expanded, setExpanded] = React.useState(false);
  const date = parseJSON(props.createdAt);
  const timeString = `${getYear(date)}年${getMonth(date)}月${getDate(date)}日`;

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/${props.user.userImage}`}
              layout="fill"
            />
          </Avatar>
        }
        title={props.user.username}
        subheader={timeString}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <CardContent>
        <Typography variant="inherit">{props.content}</Typography>
      </CardContent>
      <CardActions>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ChatBubbleOutlineIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TweetComponent;
