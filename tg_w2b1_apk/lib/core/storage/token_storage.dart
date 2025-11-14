import 'package:shared_preferences/shared_preferences.dart';

class TokenStorage {
  TokenStorage();

  static const _tokenKey = 'auth_token';

  SharedPreferences? _prefs;

  Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  Future<void> saveToken(String token) async {
    await init();
    await _prefs!.setString(_tokenKey, token);
  }

  Future<String?> readToken() async {
    await init();
    final token = _prefs!.getString(_tokenKey);
    if (token == null) {
      return null;
    }
    final sanitized = token.trim();
    if (sanitized.isEmpty) {
      await clearToken();
      return null;
    }
    return sanitized.startsWith('Bearer ') ? sanitized.substring(7) : sanitized;
  }

  Future<void> clearToken() async {
    await init();
    await _prefs!.remove(_tokenKey);
  }
}

