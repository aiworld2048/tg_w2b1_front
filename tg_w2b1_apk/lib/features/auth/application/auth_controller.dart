import 'package:flutter/foundation.dart';

import '../data/auth_repository.dart';
import '../domain/auth_user.dart';

enum AuthStatus {
  unknown,
  authenticated,
  unauthenticated,
}

class AuthController extends ChangeNotifier {
  AuthController(this._repository);

  final AuthRepository _repository;

  AuthStatus _status = AuthStatus.unknown;
  AuthUser? _user;
  bool _isLoading = false;
  String? _errorMessage;

  AuthStatus get status => _status;
  AuthUser? get user => _user;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> bootstrap() async {
    final token = await _repository.readPersistedToken();
    if (token == null) {
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      return;
    }
    await refreshProfile();
  }

  Future<void> login({
    required String username,
    required String password,
  }) async {
    _setLoading(true);
    try {
      final user = await _repository.login(
        username: username,
        password: password,
      );
      if (user == null) {
        _errorMessage = 'Invalid credentials';
        _status = AuthStatus.unauthenticated;
      } else {
        _user = user;
        _status = AuthStatus.authenticated;
        _errorMessage = null;
      }
    } catch (error) {
      _errorMessage = 'Failed to login. Please try again.';
      _status = AuthStatus.unauthenticated;
      if (kDebugMode) {
        print('Login error: $error');
      }
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    _setLoading(true);
    try {
      await _repository.logout();
    } finally {
      _user = null;
      _status = AuthStatus.unauthenticated;
      _setLoading(false);
    }
  }

  Future<void> refreshProfile() async {
    _setLoading(true);
    try {
      final user = await _repository.fetchProfile();
      if (user == null) {
        _status = AuthStatus.unauthenticated;
      } else {
        _user = user;
        _status = AuthStatus.authenticated;
      }
    } catch (error) {
      if (kDebugMode) {
        print('Refresh profile error: $error');
      }
      _status = AuthStatus.unauthenticated;
    } finally {
      _setLoading(false);
    }
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}

