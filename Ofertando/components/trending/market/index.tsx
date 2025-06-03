import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

interface MarketCardProps {
  logo: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  description: string;
  isFavorite: boolean;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  logo,
  name,
  location,
  rating,
  verified,
  description,
  isFavorite
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: logo }} style={styles.logo} />
        <TouchableOpacity>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>
        {name} {verified && <Ionicons name="checkmark-circle" size={14} color="green" />}
      </Text>
      <Text style={styles.location}>{location}</Text>
      <View style={styles.rating}>
        <FontAwesome name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
      <Text numberOfLines={1} style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    padding: 10,
    backgroundColor: '#FDEFE5',
    borderRadius: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#333',
  }
});
