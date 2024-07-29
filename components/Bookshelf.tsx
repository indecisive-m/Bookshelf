import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Bookshelf = ({ bookshelf }) => {
  const fetchBooks = useQuery(api.books.getAllBooksOnABookshelf, {
    bookshelf: bookshelf,
  });

  const DATA = [];

  const info = fetchBooks?.map((i) => {
    const authors = i.authorsNames.map((name) => (
      <ThemedText>{name}</ThemedText>
    ));

    return (
      <ThemedView>
        <Image
          height={100}
          width={100}
          source={{
            uri: `https://covers.openlibrary.org/b/isbn/${i.isbn}-L.jpg`,
          }}
        />
        <ThemedText>{i?.bookTitle}</ThemedText>
        {authors}
        <ThemedText>Average Rating: {i?.averageRating}</ThemedText>
        <ThemedText>First Published: {i?.firstPublishYear}</ThemedText>
        <ThemedText>{i?.firstSentence}</ThemedText>
        <ThemedText>{i?.isbn}</ThemedText>
      </ThemedView>
    );
  });

  return (
    <ThemedView>
      <ThemedText>{bookshelf}</ThemedText>

      {info}
    </ThemedView>
  );
};

export default Bookshelf;

const styles = StyleSheet.create({});
