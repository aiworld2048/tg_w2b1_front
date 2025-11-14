class BannerItem {
  BannerItem({
    required this.id,
    required this.imageUrl,
  });

  final int id;
  final String imageUrl;

  factory BannerItem.fromJson(Map<String, dynamic> json) {
    return BannerItem(
      id: json['id'] as int? ?? 0,
      imageUrl: json['img_url']?.toString() ?? json['image']?.toString() ?? '',
    );
  }
}

