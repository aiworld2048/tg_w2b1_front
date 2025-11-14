import 'package:dio/dio.dart';

import '../../../core/network/api_client.dart';
import '../../../core/storage/token_storage.dart';
import '../domain/banner_item.dart';
import '../domain/game_item.dart';
import '../domain/game_type.dart';
import '../domain/provider_model.dart';

class HomeRepository {
  HomeRepository({
    required ApiClient apiClient,
    required TokenStorage tokenStorage,
  })  : _dio = apiClient.dio,
        _tokenStorage = tokenStorage;

  final Dio _dio;
  final TokenStorage _tokenStorage;

  Future<List<BannerItem>> fetchBanners() async {
    final response = await _dio.get<dynamic>('/banner');
    final raw = _extractList(response.data);
    return raw
        .map((e) => BannerItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<GameType>> fetchGameTypes() async {
    final response = await _dio.get<dynamic>('/game_types');
    final raw = _extractList(response.data);
    return raw
        .map((e) => GameType.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<ProviderModel>> fetchProviders(String typeCode) async {
    final response = await _dio.get<dynamic>('/providers/$typeCode');
    final raw = _extractList(response.data);
    return raw
        .map((e) => ProviderModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<GameItem>> fetchGames({
    required int typeId,
    required int providerId,
  }) async {
    final response = await _dio.get<dynamic>('/game_lists/$typeId/$providerId');
    final raw = _extractList(response.data);
    return raw
        .map((e) => GameItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<GameItem>> fetchHotGames() async {
    final response = await _dio.get<dynamic>('/hot_game_lists');
    final raw = _extractList(response.data);
    return raw
        .map((e) => GameItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<String?> launchGame({
    required int typeId,
    required int providerId,
    required int gameId,
  }) async {
    await _ensureToken();
    final response = await _dio.post<Map<String, dynamic>>(
      '/launch_game',
      data: <String, dynamic>{
        'type_id': typeId,
        'provider_id': providerId,
        'game_id': gameId,
      },
    );
    final data = response.data;
    if (data == null) {
      return null;
    }
    return data['Url'] as String? ?? data['url'] as String?;
  }

  List<dynamic> _extractList(dynamic raw) {
    if (raw is List) {
      return raw;
    }
    if (raw is Map<String, dynamic>) {
      final data = raw['data'];
      if (data is List) {
        return data;
      }
      if (data is Map<String, dynamic>) {
        return [data];
      }
    }
    return const [];
  }

  Future<void> _ensureToken() async {
    final token = await _tokenStorage.readToken();
    if (token == null || token.isEmpty) {
      throw const HomeAuthRequiredException();
    }
  }
}

class HomeAuthRequiredException implements Exception {
  const HomeAuthRequiredException();
}

