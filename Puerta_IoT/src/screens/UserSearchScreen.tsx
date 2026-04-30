import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { searchUsers } from '../services/userService';
import { User, UserType } from '../types';

export function UserSearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [userType, setUserType] = useState<'all' | UserType>('all');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async () => {
    if (query.trim() === '' && userType === 'all') {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const type = userType === 'all' ? undefined : userType;
      const searchResults = await searchUsers(query, type);
      setResults(searchResults);
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la búsqueda');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, userType]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleUserSelect = (user: User) => {
    navigation.navigate('UserProfile', { userId: user.id });
  };

  const renderUserItem = (user: User) => (
    <TouchableOpacity
      key={user.id}
      style={styles.userCard}
      onPress={() => handleUserSelect(user)}
    >
      <View style={styles.userCardContent}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.userMetaContainer}>
            <Text style={styles.userMeta}>
              {user.type === 'student' ? 'Alumno' : 'Personal'}
            </Text>
            {user.controlNumber && (
              <Text style={styles.userMeta}> • {user.controlNumber}</Text>
            )}
            {user.department && (
              <Text style={styles.userMeta}> • {user.department}</Text>
            )}
          </View>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBanner}>
        <Text style={styles.topBannerLabel}>Usuarios</Text>
        <Text style={styles.topBannerTitle}>Busca y administra permisos con rapidez</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o número de control"
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Type Filter */}
      <View style={styles.filterContainer}>
        {['all', 'student', 'staff'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              userType === type && styles.filterButtonActive,
            ]}
            onPress={() => setUserType(type as any)}
          >
            <Text
              style={[
                styles.filterButtonText,
                userType === type && styles.filterButtonTextActive,
              ]}
            >
              {type === 'all'
                ? 'Todos'
                : type === 'student'
                  ? 'Alumnos'
                  : 'Personal'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : results.length === 0 && query.trim() === '' && userType === 'all' ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Ingresa un término para buscar</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        ) : (
          results.map(user => renderUserItem(user))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBanner: {
    marginHorizontal: spacing[4],
    marginTop: spacing[2],
    marginBottom: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  topBannerLabel: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  topBannerTitle: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 28,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 20,
    color: colors.textLight,
    marginRight: spacing[3],
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: typography.fontSize.base,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    gap: spacing[2],
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  resultsContainer: {
    flex: 1,
    padding: spacing[4],
  },
  userCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  userCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    paddingLeft: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing[1],
  },
  userMetaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: typography.fontSize.xl,
    color: colors.textLight,
    marginLeft: spacing[2],
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textLight,
    textAlign: 'center',
  },
});
