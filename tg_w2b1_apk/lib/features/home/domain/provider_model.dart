class ProviderModel {
  ProviderModel({
    required this.id,
    required this.productName,
    required this.productTitle,
    required this.gameType,
    required this.productCode,
    this.shortName,
    this.imageUrl,
  });

  final int id;
  final String productName;
  final String productTitle;
  final String gameType;
  final String productCode;
  final String? shortName;
  final String? imageUrl;

  factory ProviderModel.fromJson(Map<String, dynamic> json) {
    return ProviderModel(
      id: json['id'] as int? ?? 0,
      productName: json['product_name']?.toString() ?? '',
      productTitle: json['product_title']?.toString() ?? '',
      gameType: json['game_type']?.toString() ?? '',
      productCode: json['product_code']?.toString() ?? '',
      shortName: json['short_name']?.toString(),
      imageUrl: json['img_url']?.toString(),
    );
  }
}

