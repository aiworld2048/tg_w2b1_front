class AuthUser {
  AuthUser({
    required this.id,
    required this.username,
    required this.displayName,
    required this.balance,
    required this.mainBalance,
  });

  final int id;
  final String username;
  final String displayName;
  final double balance;
  final double mainBalance;

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as int? ?? 0,
      username: json['user_name'] as String? ?? '',
      displayName: json['name'] as String? ?? '',
      balance: _parseBalance(json['balance']),
      mainBalance: _parseBalance(json['main_balance']),
    );
  }

  static double _parseBalance(dynamic value) {
    if (value is num) {
      return value.toDouble();
    }
    if (value is String) {
      return double.tryParse(value) ?? 0;
    }
    return 0;
  }

  AuthUser copyWith({
    String? displayName,
    double? balance,
    double? mainBalance,
  }) {
    return AuthUser(
      id: id,
      username: username,
      displayName: displayName ?? this.displayName,
      balance: balance ?? this.balance,
      mainBalance: mainBalance ?? this.mainBalance,
    );
  }
}

