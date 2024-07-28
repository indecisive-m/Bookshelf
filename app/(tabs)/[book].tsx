import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { BookObject } from "@/utils/types";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

const bookPage = () => {
  const { isbn } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState({
    authorsNames: [""],
    bookTitle: "",
    firstPublishYear: 0,
    averageRating: 0,
    firstSentence: "",
  });
  const fetchBooks = useAction(api.books.fetchBookInfoFromOpenLibaryWithISBN);

  console.log(isbn);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  useEffect(() => {
    const getBookFromAPI = async () => {
      try {
        const getBookFromAPI: BookObject = await fetchBooks({ isbn: isbn });

        const bookResult = getBookFromAPI.docs[0];

        setBookInfo({ ...bookInfo, authorsNames: bookResult.author_name });
        setBookInfo({
          ...bookInfo,
          firstPublishYear: bookResult.first_publish_year,
        });
        setBookInfo({ ...bookInfo, bookTitle: bookResult.title });
        setBookInfo({ ...bookInfo, averageRating: bookResult.ratings_average });
        setBookInfo({
          ...bookInfo,
          firstSentence: bookResult.first_sentence[0],
        });
      } catch (err) {
        console.log(err);
      }
    };

    getBookFromAPI();
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedText>{isbn}</ThemedText>
      <ThemedText>{bookInfo.bookTitle}</ThemedText>
      <ThemedText>{bookInfo.authorsNames[0]}</ThemedText>
      <ThemedText>{bookInfo.firstPublishYear}</ThemedText>
      <ThemedText>{bookInfo.firstSentence}</ThemedText>
      <ThemedText>{bookInfo.averageRating}</ThemedText>

      <Image
        height={100}
        width={100}
        source={{ uri: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` }}
      />
    </ThemedView>
  );
};

export default bookPage;

const styles = StyleSheet.create({});
function fetchBooks(arg0: {
  isbn: string | string[] | undefined;
}): BookObject | PromiseLike<BookObject> {
  throw new Error("Function not implemented.");
}
