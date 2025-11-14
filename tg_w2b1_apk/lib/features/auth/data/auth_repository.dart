import 'package:dio/dio.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/token_storage.dart';
import '../domain/auth_user.dart';

class AuthRepository {
  AuthRepository({
    required ApiClient apiClient,
    required TokenStorage tokenStorage,
  })  : _tokenStorage = tokenStorage,
        _dio = apiClient.dio;

  final Dio _dio;
  final TokenStorage _tokenStorage;

  Future<AuthUser?> login({
    required String username,
    required String password,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/login',
      data: <String, dynamic>{
        'user_name': username,
        'password': password,
      },
    );

    final data = response.data?['data'] as Map<String, dynamic>?;
    if (data == null) {
      return null;
    }

    final token = data['token'] as String?;
    final userJson = data['user'] as Map<String, dynamic>?;
    if (token != null) {
      await _tokenStorage.saveToken(token);
    }

    return userJson != null ? AuthUser.fromJson(userJson) : null;
  }

  Future<AuthUser?> fetchProfile() async {
    final response = await _dio.get<Map<String, dynamic>>('/user');
    final data = response.data?['data'] as Map<String, dynamic>?;
    if (data == null) {
      return null;
    }
    return AuthUser.fromJson(data);
  }

  Future<void> logout() async {
    try {
      await _dio.post('/logout');
    } finally {
      await _tokenStorage.clearToken();
    }
  }

  Future<String?> readPersistedToken() => _tokenStorage.readToken();
}

