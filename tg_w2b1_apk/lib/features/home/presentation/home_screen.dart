import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../app/localization/app_localizations.dart';
import '../../../core/constants/api_constants.dart';
import '../../auth/application/auth_controller.dart';
import '../application/home_controller.dart';
import '../domain/banner_item.dart';
import '../domain/game_item.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _pageController = PageController(viewportFraction: 0.92);
  final _scrollController = ScrollController();
  int _currentBanner = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<HomeController>().ensureInitialized();
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final localization = AppLocalizations.of(context);

    return Consumer<HomeController>(
      builder: (context, controller, _) {
        final state = controller.state;
        final isInitialLoading =
            state.isLoading && state.gameTypes.isEmpty && state.banners.isEmpty;
        final user = context.watch<AuthController>().user;

        return RefreshIndicator(
          onRefresh: controller.loadInitialData,
          child: ListView(
            controller: _scrollController,
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 120),
            children: [
              if (state.errorMessage != null)
                _ErrorBanner(message: state.errorMessage!),
              if (state.banners.isNotEmpty)
                _buildBannerCarousel(state.banners)
              else if (isInitialLoading)
                const _SectionLoader(height: 180),
              const SizedBox(height: 16),
              _BalanceCard(
                mainBalance: user?.mainBalance,
                gameBalance: user?.balance,
                locale: localization,
              ),
              const SizedBox(height: 24),
              _SectionHeader(title: localization.translate('providers')),
              const SizedBox(height: 12),
              if (state.gameTypes.isEmpty && isInitialLoading)
                const _SectionLoader(height: 88)
              else
                _buildGameTypes(controller, state),
              const SizedBox(height: 24),
              _SectionHeader(title: localization.translate('hot_games')),
              const SizedBox(height: 12),
              if (state.hotGames.isEmpty && isInitialLoading)
                const _GridLoader()
              else
                _GamesGrid(
                  games: state.hotGames,
                  onTap: (game) => _handleLaunch(controller, game),
                ),
              const SizedBox(height: 24),
              _SectionHeader(title: 'Game Lists'),
              const SizedBox(height: 12),
              if (state.games.isEmpty && state.isLoading)
                const _GridLoader()
              else
                _GamesGrid(
                  games: state.games,
                  onTap: (game) => _handleLaunch(controller, game),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBannerCarousel(List<BannerItem> banners) {
    return Column(
      children: [
        SizedBox(
          height: 180,
          child: PageView.builder(
            controller: _pageController,
            itemCount: banners.length,
            onPageChanged: (index) {
              setState(() => _currentBanner = index);
            },
            itemBuilder: (context, index) {
              final banner = banners[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: _NetworkOrAssetImage(url: banner.imageUrl),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            banners.length,
            (index) => AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: _currentBanner == index ? 16 : 8,
              height: 8,
              decoration: BoxDecoration(
                color: _currentBanner == index
                    ? Colors.amber
                    : Colors.white.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGameTypes(HomeController controller, HomeState state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: state.gameTypes
                .map(
                  (type) => Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(type.name),
                      selected: state.selectedType?.id == type.id,
                      onSelected: (_) => controller.selectType(type),
                    ),
                  ),
                )
                .toList(),
          ),
        ),
        const SizedBox(height: 16),
        if (state.providers.isNotEmpty)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: state.providers
                  .map(
                    (provider) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(
                          provider.shortName?.isNotEmpty == true
                              ? provider.shortName!
                              : provider.productTitle,
                        ),
                        selected: state.selectedProvider?.id == provider.id,
                        onSelected: (_) => controller.selectProvider(provider),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
      ],
    );
  }

  Future<void> _handleLaunch(
    HomeController controller,
    GameItem game,
  ) async {
    final messenger = ScaffoldMessenger.of(context);
    messenger.hideCurrentSnackBar();
    final url = await controller.launchGame(game);
    if (!mounted) return;

    if (url == null || url.isEmpty) {
      messenger.showSnackBar(
        const SnackBar(content: Text('Unable to launch game. Please login.')),
      );
      return;
    }

    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      messenger.showSnackBar(
        const SnackBar(content: Text('Failed to open game link.')),
      );
    }
  }

  String _resolveImageUrl(String? path) {
    if (path == null || path.isEmpty) {
      return '';
    }
    if (path.startsWith('http')) {
      return path;
    }
    return '${ApiConstants.baseUrl}/$path';
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context).textTheme.headlineSmall,
    );
  }
}

class _BalanceCard extends StatelessWidget {
  const _BalanceCard({
    required this.locale,
    this.mainBalance,
    this.gameBalance,
  });

  final AppLocalizations locale;
  final double? mainBalance;
  final double? gameBalance;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [Color(0xFF1B3060), Color(0xFF243C78)],
        ),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        children: [
          const Icon(Icons.account_balance_wallet_outlined,
              color: Colors.amber),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  locale.translate('home_title'),
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                Text(
                  'Main: ${_format(mainBalance)}  ·  Game: ${_format(gameBalance)}',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static String _format(double? value) {
    if (value == null) return '--';
    return value.toStringAsFixed(2);
  }
}

class _GamesGrid extends StatelessWidget {
  const _GamesGrid({required this.games, required this.onTap});

  final List<GameItem> games;
  final ValueChanged<GameItem> onTap;

  @override
  Widget build(BuildContext context) {
    if (games.isEmpty) {
      return const _CenteredMessage(message: 'No games available for now.');
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: games.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 0.82,
      ),
      itemBuilder: (context, index) {
        final game = games[index];
        final imageUrl = _resolveStatic(game.imageUrl);
        return InkWell(
          onTap: () => onTap(game),
          borderRadius: BorderRadius.circular(18),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              color: const Color(0xFF0F214F),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(18),
                    ),
                    child: imageUrl != null
                        ? _NetworkOrAssetImage(url: imageUrl)
                        : const _GamePlaceholder(),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    game.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  static String? _resolveStatic(String path) {
    if (path.isEmpty) {
      return null;
    }
    if (path.startsWith('http')) {
      return path;
    }
    return '${ApiConstants.baseUrl}/$path';
  }
}

class _NetworkOrAssetImage extends StatelessWidget {
  const _NetworkOrAssetImage({required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    if (url.isEmpty) {
      return const _GamePlaceholder();
    }
    if (url.startsWith('http')) {
      return CachedNetworkImage(
        imageUrl: url,
        fit: BoxFit.cover,
        errorWidget: (_, __, ___) => const _GamePlaceholder(),
        placeholder: (_, __) => const _Shimmer(),
      );
    }
    return Image.asset(url, fit: BoxFit.cover);
  }
}

class _Shimmer extends StatelessWidget {
  const _Shimmer();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white.withValues(alpha: 0.1),
    );
  }
}

class _GamePlaceholder extends StatelessWidget {
  const _GamePlaceholder();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white.withValues(alpha: 0.04),
      child: const Icon(
        Icons.sports_esports_rounded,
        color: Colors.white38,
        size: 36,
      ),
    );
  }
}

class _SectionLoader extends StatelessWidget {
  const _SectionLoader({required this.height});

  final double height;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
      ),
      alignment: Alignment.center,
      child: const CircularProgressIndicator(strokeWidth: 2),
    );
  }
}

class _GridLoader extends StatelessWidget {
  const _GridLoader();

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      height: 220,
      child: Center(
        child: CircularProgressIndicator(strokeWidth: 2),
      ),
    );
  }
}

class _CenteredMessage extends StatelessWidget {
  const _CenteredMessage({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 32),
      child: Center(
        child: Text(
          message,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.red.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.withValues(alpha: 0.4)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.redAccent),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(color: Colors.redAccent),
            ),
          ),
        ],
      ),
    );
  }
}

