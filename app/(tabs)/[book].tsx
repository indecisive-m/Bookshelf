import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { BookObject } from "@/utils/types";
import { useAction, useConvex, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const bookPage = () => {
  const { isbn } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState({});

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const fetchBookInfoFromIsbn = useQuery(api.books.getBookFromDBWIthIsbn, {
    isbn: isbn,
  });

  const fetchAllBooks = useQuery(api.books.getAllBooksFromDB);

  const stuff = fetchBookInfoFromIsbn?.map((i) => {
    return (
      <>
        <ThemedText>{i.authorsNames[0]}</ThemedText>
        <ThemedText>{i.bookTitle}</ThemedText>
        <ThemedText>{i.averageRating}</ThemedText>
        <ThemedText>{i.bookshelf}</ThemedText>
        <ThemedText>{i.firstSentence}</ThemedText>
        <ThemedText>{i.user}</ThemedText>
        <ThemedText>{i.firstPublishYear}</ThemedText>
      </>
    );
  });

  const otherStuff = fetchAllBooks?.map((i) => {
    return (
      <>
        <ThemedText>{i.authorsNames[0]}</ThemedText>
        <ThemedText>{i.bookTitle}</ThemedText>
        <ThemedText>{i.averageRating}</ThemedText>
        <ThemedText>{i.bookshelf}</ThemedText>
        <ThemedText>{i.firstSentence}</ThemedText>
        <ThemedText>{i.user}</ThemedText>
        <ThemedText>{i.firstPublishYear}</ThemedText>
      </>
    );
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <Image
        height={100}
        width={100}
        source={{ uri: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` }}
      />
      {stuff}
      {otherStuff}
    </ScrollView>
  );
};

export default bookPage;

const styles = StyleSheet.create({});
