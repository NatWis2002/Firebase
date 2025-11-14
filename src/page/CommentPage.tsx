import {
  Avatar,
  Button,
  Card,
  FluentProvider,
  teamsDarkTheme,
} from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Key } from "react";
import { Link } from "react-router-dom";

const CommentsFeach = async () => {
  const { data } = await axios.get("https://dummyjson.com/comments");
  //const { data } = await axios.get('https://dummyjson.com/comments?limit=12');
  return data.comments;
};

const Coment = () => {
  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: CommentsFeach,
  });

  return (
    <>
      <div>
        <FluentProvider theme={teamsDarkTheme}>
          <Link to={"/"}>
            <Card style={{ display: "flex", flexDirection: "row", gap: "2vh" }}>
              <Button
                style={{ width: "100%", display: "flex", flexDirection: "row" }}
              >
                Komentarze
              </Button>
            </Card>
          </Link>
        </FluentProvider>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
        {comments &&
          comments.map((comment: any, key: Key) => (
            <Card style={{ display: "flex", flexDirection: "row" }} key={key}>
              <Avatar
                image={{
                  src: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jameson",
                  alt: "Jameson",
                }}
                style={{ marginTop: "0.75vh" }}
              />
              <p style={{ display: "flex" }}>{comment.user.username}:</p>
              <p style={{ display: "flex" }}>{comment.body}</p>
            </Card>
          ))}
      </div>
    </>
  );
};

export default Coment;
