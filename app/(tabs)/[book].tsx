import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { BookObject } from "@/utils/types";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const bookPage = () => {
  const { isbn } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState({});

  if (isLoading) {
    return <ActivityIndicator />;
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchBookInfoFromIsbn = useQuery(api.books.getBookFromDBWIthIsbn, {
      isbn: isbn,
    });

    setIsLoading(false);
  });

  return (
    <ThemedView style={{ flex: 1 }}>
      <Image
        height={100}
        width={100}
        source={{ uri: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` }}
      />
      {/* {fetchBookInfoFromIsbn[0] && (
        <>
          <ThemedText>{fetchBookInfoFromIsbn[0]?.bookTitle}</ThemedText>
          <ThemedText>{fetchBookInfoFromIsbn[0]?.averageRating}</ThemedText>
          <ThemedText>{fetchBookInfoFromIsbn[0]?.firstSentence}</ThemedText>
          <ThemedText>{fetchBookInfoFromIsbn[0]?.authorsNames[0]}</ThemedText>
          <ThemedText>{fetchBookInfoFromIsbn[0]?.firstPublishYear}</ThemedText>
        </>
      )} */}
    </ThemedView>
  );
};

export default bookPage;

const styles = StyleSheet.create({});
