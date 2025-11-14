import {
  Button,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import "./App.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

//import { API_KEY, PROJECT_ID } from "./ApiBaza.tsx";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./ApiBaza.tsx";

type Comment = {
  id: string;
  tresc: string;
  autor: string;
  date: string;
  idartykulu: string;
  [key: string]: any;
};

type Article = {
  id: string;
  tytul: string;
  tresc: string;
  date: string;
  komentarze?: Comment[];
  [key: string]: any;
};

const fetchArticles = async (): Promise<Article[]> => {
  const articlesSnap = await getDocs(collection(db, "Artykuly"));
  const articlesData: Article[] = articlesSnap.docs.map((doc) => {
    const article = { id: doc.id, ...doc.data() } as Article;
    article.date = new Date(
      article.data_added.seconds * 1000
    ).toLocaleDateString();
    return article;
  });

  return articlesData;
};

const fetchComments = async (): Promise<Comment[]> => {
  const commentsSnap = await getDocs(collection(db, "Komentarze"));

  const commentsData: Comment[] = commentsSnap.docs.map((doc) => {
    const comment = { id: doc.id, ...doc.data() } as Comment;
    comment.date = new Date(
      comment.data_added.seconds * 1000
    ).toLocaleDateString();

    return comment;
  });

  return commentsData;
};

function App() {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    contenct: "",
    author_fullname: "",
  });

  const [formDataComment, setFormDataComment] = useState({
    id: "",
    content: "",
    author_fullname: "",
    article_id: "",
  });
  const [customDate, setCustomDate] = useState("");
  const [customDateComment, setCustomDateComment] = useState("");

  const { data: articles } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });
  const Articulscolumns = [
    { columnKey: "id", label: "ID" },
    { columnKey: "title", label: "Tytuł" },
    { columnKey: "contenct", label: "Content" },
    { columnKey: "author_fullname", label: "Autor" },
    { columnKey: "data_added", label: "Data dodania" },
  ];

  //Komentarze
  const { data: comments } = useQuery<Comment[], Error>({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  const Commentscolumns = [
    { columnKey: "id", label: "ID" },
    { columnKey: "content", label: "Content" },
    { columnKey: "author_fullname", label: "author_fullname" },
    { columnKey: "data_added", label: "data_added" },
    { columnKey: "article_id", label: "article_id" },
  ];

  //Dodanie Artykulow
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        date_added: customDate ? new Date(customDate) : serverTimestamp(),
      };

      await addDoc(collection(db, "Artykuly"), dataToSend);
      alert("Artykuł dodany pomyślnie!");
      setFormData({
        id: "",
        title: "",
        contenct: "",
        author_fullname: "",
      });
      setCustomDate(""); // wyczyść datę po dodaniu
    } catch (error) {
      console.error("Błąd przy dodawaniu artykułu:", error);
    }
  };

  //Dodawnie Komentarzy:
  const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitComment = async () => {
    try {
      const dataToSend = {
        ...formDataComment,
        data_added: customDate ? new Date(customDate) : serverTimestamp(),
      };

      await addDoc(collection(db, "Komentarze"), dataToSend);
      alert("Komentarz dodany pomyślnie!");

      setFormDataComment({
        id: "",
        content: "",
        author_fullname: "",
        article_id: "",
      });
      setCustomDate("");
    } catch (error) {
      console.error("Błąd przy dodawaniu komentarza:", error);
    }
  };
  return (
    <>
      <div style={{ padding: "20px", background: "#252525" }}>
        <h1 className="text-2xl font-bold mb-4" style={{ textAlign: "center" }}>
          📚 Lista Artykułów
        </h1>
        <Table arial-label="Default table" style={{ minWidth: "510px" }}>
          <TableHeader>
            <TableRow>
              {Articulscolumns.map((column) => (
                <TableHeaderCell key={column.columnKey}>
                  {column.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles && articles.length > 0 ? (
              articles.map((articles) => (
                <TableRow key={articles.id}>
                  <TableCell>{articles.id}</TableCell>
                  <TableCell>{articles.title}</TableCell>
                  <TableCell>{articles.contenct}</TableCell>
                  <TableCell>{articles.author_fullname}</TableCell>
                  <TableCell>{articles.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Brak artykułów</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            padding: "20px",
          }}
        >
          {[
            { id: "id", label: "ID" },
            { id: "title", label: "Tytuł" },
            { id: "contenct", label: "Zawartość" },
            { id: "author_fullname", label: "Autor" },
          ].map((field) => (
            <div
              key={field.id}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              <Label htmlFor={field.id} style={{ minWidth: "120px" }}>
                {field.label}:
              </Label>
              <Input
                id={field.id}
                value={(formData as any)[field.id]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Label htmlFor="customDate" style={{ minWidth: "120px" }}>
              Data dodania:
            </Label>
            <input
              id="customDate"
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                width: "200px",
              }}
            />
          </div>
          <Button appearance="primary" onClick={handleSubmit}>
            Dodaj artykuł
          </Button>
          <h1
            className="text-2xl font-bold mb-4"
            style={{ textAlign: "center" }}
          >
            💬 Lista Komentarzy
          </h1>
          <Table arial-label="Tabela komentarzy" style={{ minWidth: "510px" }}>
            <TableHeader>
              <TableRow>
                {Commentscolumns.map((column) => (
                  <TableHeaderCell key={column.columnKey}>
                    {column.label}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments && comments.length > 0 ? (
                comments.map((comments) => (
                  <TableRow key={comments.id}>
                    <TableCell>{comments.id}</TableCell>
                    <TableCell>{comments.content}</TableCell>
                    <TableCell>{comments.author_fullname}</TableCell>
                    <TableCell>{comments.date}</TableCell>
                    <TableCell>{comments.article_id}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>Brak komentarzy</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "20px",
              background: "#252525",
              maxWidth: "600px",
              margin: "0 auto",
              color: "white",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Label htmlFor="id" style={{ minWidth: "120px" }}>
                ID:
              </Label>
              <Input
                name="id"
                value={formDataComment.id}
                onChange={handleChangeComment}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Label htmlFor="content" style={{ minWidth: "120px" }}>
                Treść komentarza:
              </Label>
              <Input
                name="content"
                value={formDataComment.content}
                onChange={handleChangeComment}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Label htmlFor="author_fullname" style={{ minWidth: "120px" }}>
                Autor:
              </Label>
              <Input
                name="author_fullname"
                value={formDataComment.author_fullname}
                onChange={handleChangeComment}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Label htmlFor="article_id" style={{ minWidth: "120px" }}>
                ID artykułu:
              </Label>
              <Input
                name="article_id"
                value={formDataComment.article_id}
                onChange={handleChangeComment}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Label htmlFor="customDate" style={{ minWidth: "120px" }}>
                Data dodania:
              </Label>
              <input
                type="date"
                value={customDateComment}
                onChange={(e) => setCustomDateComment(e.target.value)}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  width: "200px",
                }}
              />
            </div>

            <Button appearance="primary" onClick={handleSubmitComment}>
              Dodaj komentarz
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
