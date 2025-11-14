class GameType {
  GameType({
    required this.id,
    required this.code,
    required this.name,
    required this.imageUrl,
  });

  final int id;
  final String code;
  final String name;
  final String imageUrl;

  factory GameType.fromJson(Map<String, dynamic> json) {
    return GameType(
      id: json['id'] as int? ?? 0,
      code: json['code']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      imageUrl: json['img']?.toString() ?? '',
    );
  }
}

