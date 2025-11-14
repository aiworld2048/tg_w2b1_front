class GameItem {
  GameItem({
    required this.id,
    required this.gameCode,
    required this.name,
    required this.imageUrl,
    required this.gameType,
    required this.productCode,
    required this.providerId,
    required this.typeId,
  });

  final int id;
  final String gameCode;
  final String name;
  final String imageUrl;
  final String gameType;
  final String productCode;
  final int providerId;
  final int typeId;

  factory GameItem.fromJson(Map<String, dynamic> json) {
    return GameItem(
      id: json['id'] as int? ?? json['game_id'] as int? ?? 0,
      gameCode: json['game_code']?.toString() ?? json['code']?.toString() ?? '',
      name: json['game_name']?.toString() ?? json['name']?.toString() ?? '',
      imageUrl: json['image_url']?.toString() ??
          json['image']?.toString() ??
          json['logo']?.toString() ??
          '',
      gameType: json['game_type']?.toString() ?? '',
      productCode: json['product_code']?.toString() ?? '',
      providerId: json['provider_id'] as int? ?? json['product_id'] as int? ?? 0,
      typeId: json['game_type_id'] as int? ?? json['type_id'] as int? ?? 0,
    );
  }
}

