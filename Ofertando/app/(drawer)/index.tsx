// app/(drawer)/index.tsx (se você realmente precisar dele aqui)
import { Redirect } from 'expo-router';

export default function DrawerIndex() {
  return <Redirect href="/(drawer)/(tabs)/home" />; // Ou apenas '/(drawer)/(tabs)'
}