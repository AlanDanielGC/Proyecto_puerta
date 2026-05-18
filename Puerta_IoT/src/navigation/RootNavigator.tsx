import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, shadows } from '../theme';
import {
  DashboardScreen,
  UserSearchScreen,
  UserProfileScreen,
  CreatePermissionScreen,
  AccessLogsScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Stack Navigator para la sección de Usuarios
 * Contiene: SearchScreen -> UserProfileScreen -> CreatePermissionScreen
 */
function UserSearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="UserSearchHome"
        component={UserSearchScreen}
        options={{
          title: 'Buscar Usuario',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={({ route }: any) => ({
          title: 'Perfil de Usuario',
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="CreatePermission"
        component={CreatePermissionScreen}
        options={{
          title: 'Crear Permiso',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * Bottom Tab Navigator (Raíz de la app)
 * Contiene: Dashboard, Usuarios (con stack interno), Logs
 */
export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
          tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'UserSearch') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'AccessLogs') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
            position: 'absolute',
            left: spacing[4],
            right: spacing[4],
            bottom: spacing[4],
            height: 68,
            backgroundColor: colors.tabBar,
            borderRadius: borderRadius['2xl'],
            borderTopWidth: 0,
            paddingBottom: 8,
            paddingTop: 8,
            ...shadows.lg,
        },
        tabBarLabelStyle: {
          fontSize: 12,
            fontWeight: '700',
            marginBottom: 2,
        },
          tabBarItemStyle: {
            borderRadius: borderRadius.lg,
          },
          tabBarBackground: () => <View style={{ flex: 1, backgroundColor: colors.tabBar, borderRadius: borderRadius['2xl'] }} />,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Inicio',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="UserSearch"
        component={UserSearchStack}
        options={{
          title: 'Usuarios',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AccessLogs"
        component={AccessLogsScreen}
        options={{
          title: 'Registros',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default RootNavigator;
