import { Avatar, Card } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Key } from "react";

const CommentsFeach = async () => {
  // const { data } = await axios.get("https://dummyjson.com/comments");
  const { data } = await axios.get(
    "https://dummyjson.com/comments?limit=10&skip=10&select=body,postId"
  );
  return data.comments;
};

const Coment = () => {
  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: CommentsFeach,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "0vh",
      }}
    >
      {comments &&
        comments.map((comment: any, key: Key) => (
          <Card
            key={comment.id}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Avatar
              image={{
                src: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jameson",
                alt: "Jameson",
              }}
              style={{ marginTop: "0.75vh" }}
              key={key}
            />
            <p>{comment.use}</p>
            <p style={{ display: "flex" }}>{comment.id}</p>
          </Card>
        ))}
      {/* {comments && comments.map((comment : any) =>  (
    )*/}
    </div>
  );
};

export default Coment;
