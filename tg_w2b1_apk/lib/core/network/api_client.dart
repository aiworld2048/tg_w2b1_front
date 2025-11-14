import 'dart:io';

import 'package:dio/dio.dart';

import '../constants/api_constants.dart';
import '../storage/token_storage.dart';

class ApiClient {
  ApiClient({
    Dio? dio,
    required TokenStorage tokenStorage,
  })  : _tokenStorage = tokenStorage,
        dio = dio ?? Dio();

  final TokenStorage _tokenStorage;
  final Dio dio;

  Future<void> configure() async {
    dio
      ..options.baseUrl = ApiConstants.baseUrl
      ..options.connectTimeout = ApiConstants.defaultTimeout
      ..options.receiveTimeout = ApiConstants.defaultTimeout
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) async {
            final token = await _tokenStorage.readToken();
            if (token != null && token.isNotEmpty) {
              options.headers[HttpHeaders.authorizationHeader] =
                  'Bearer $token';
            }
            return handler.next(options);
          },
        ),
      );
  }
}

