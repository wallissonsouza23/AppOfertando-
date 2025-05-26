// app/(drawer)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
// Importe seu componente CustomDrawerContent.tsx
import CustomDrawerContent from '../CustomDrawer'; // Ajuste o caminho se seu arquivo for CustomDrawer.tsx

export default function DrawerLayout() {
  return (
    <Drawer
      // Aqui você especifica o componente customizado para o conteúdo do drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        // Opcional: Para ocultar o cabeçalho padrão do Drawer e deixar suas telas ou tabs controlarem isso
        headerShown: false,
      }}
    >
     
      <Drawer.Screen
        name="(tabs)" 
        options={{
          title: 'Principal', 
         
         
          headerShown: false,
        }}
      />

     
      {/* <Drawer.Screen
        name="profile" // Exemplo: se você tem app/(drawer)/profile.tsx
        options={{
          title: 'Meu Perfil',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      /> */}
    </Drawer>
  );
}