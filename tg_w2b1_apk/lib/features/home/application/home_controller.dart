import 'package:flutter/foundation.dart';

import '../../../core/storage/token_storage.dart';
import '../../auth/application/auth_controller.dart';
import '../data/home_repository.dart';
import '../domain/banner_item.dart';
import '../domain/game_item.dart';
import '../domain/game_type.dart';
import '../domain/provider_model.dart';

class HomeState {
  HomeState({
    required this.banners,
    required this.gameTypes,
    required this.providers,
    required this.hotGames,
    required this.selectedType,
    required this.selectedProvider,
    this.games = const [],
    this.isLoading = false,
    this.errorMessage,
  });

  final List<BannerItem> banners;
  final List<GameType> gameTypes;
  final List<ProviderModel> providers;
  final List<GameItem> hotGames;
  final List<GameItem> games;
  final GameType? selectedType;
  final ProviderModel? selectedProvider;
  final bool isLoading;
  final String? errorMessage;

  HomeState copyWith({
    List<BannerItem>? banners,
    List<GameType>? gameTypes,
    List<ProviderModel>? providers,
    List<GameItem>? hotGames,
    List<GameItem>? games,
    GameType? selectedType,
    ProviderModel? selectedProvider,
    bool? isLoading,
    String? errorMessage,
  }) {
    return HomeState(
      banners: banners ?? this.banners,
      gameTypes: gameTypes ?? this.gameTypes,
      providers: providers ?? this.providers,
      hotGames: hotGames ?? this.hotGames,
      games: games ?? this.games,
      selectedType: selectedType ?? this.selectedType,
      selectedProvider: selectedProvider ?? this.selectedProvider,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }

  factory HomeState.initial() => HomeState(
        banners: const [],
        gameTypes: const [],
        providers: const [],
        hotGames: const [],
        selectedType: null,
        selectedProvider: null,
      );
}

class HomeController extends ChangeNotifier {
  HomeController(
    this._repository,
    this._authController,
    this._tokenStorage,
  );

  final HomeRepository _repository;
  final AuthController _authController;
  final TokenStorage _tokenStorage;

  HomeState _state = HomeState.initial();
  bool _initialized = false;

  HomeState get state => _state;

  Future<void> ensureInitialized() async {
    if (_initialized) return;
    _initialized = true;
    await loadInitialData();
  }

  Future<void> loadInitialData() async {
    _setState(_state.copyWith(isLoading: true, errorMessage: null));
    try {
      final banners = await _repository.fetchBanners();
      final gameTypes = await _repository.fetchGameTypes();
      GameType? selectedType;
      if (gameTypes.isNotEmpty) {
        selectedType = gameTypes.first;
      }

      List<ProviderModel> providers = const [];
      if (selectedType != null) {
        providers = await _repository.fetchProviders(selectedType.code);
      }
      ProviderModel? selectedProvider;
      if (providers.isNotEmpty) {
        selectedProvider = providers.first;
      }

      List<GameItem> games = const [];
      if (selectedType != null && selectedProvider != null) {
        games = await _repository.fetchGames(
          typeId: selectedType.id,
          providerId: selectedProvider.id,
        );
      }

      final hotGames = await _repository.fetchHotGames();

      _setState(
        _state.copyWith(
          banners: banners,
          gameTypes: gameTypes,
          providers: providers,
          selectedType: selectedType,
          selectedProvider: selectedProvider,
          games: games,
          hotGames: hotGames,
          isLoading: false,
          errorMessage: null,
        ),
      );
    } catch (error) {
      _setState(
        _state.copyWith(
          isLoading: false,
          errorMessage: 'Failed to load data. Please try again.',
        ),
      );
      if (kDebugMode) {
        print('HomeController loadInitialData error: $error');
      }
    }
  }

  Future<void> selectType(GameType type) async {
    if (_state.selectedType?.id == type.id) return;
    _setState(
      _state.copyWith(
        selectedType: type,
        isLoading: true,
        errorMessage: null,
      ),
    );
    try {
      final providers = await _repository.fetchProviders(type.code);
      ProviderModel? selectedProvider;
      if (providers.isNotEmpty) {
        selectedProvider = providers.first;
      }
      List<GameItem> games = const [];
      if (selectedProvider != null) {
        games = await _repository.fetchGames(
          typeId: type.id,
          providerId: selectedProvider.id,
        );
      }
      _setState(
        _state.copyWith(
          providers: providers,
          selectedProvider: selectedProvider,
          games: games,
          isLoading: false,
        ),
      );
    } catch (error) {
      _setState(
        _state.copyWith(
          isLoading: false,
          errorMessage: 'Failed to load providers',
        ),
      );
    }
  }

  Future<void> selectProvider(ProviderModel provider) async {
    if (_state.selectedProvider?.id == provider.id) return;
    final type = _state.selectedType;
    if (type == null) return;

    _setState(
      _state.copyWith(
        selectedProvider: provider,
        isLoading: true,
        errorMessage: null,
      ),
    );
    try {
      final games = await _repository.fetchGames(
        typeId: type.id,
        providerId: provider.id,
      );
      _setState(
        _state.copyWith(
          games: games,
          isLoading: false,
        ),
      );
    } catch (error) {
      _setState(
        _state.copyWith(
          isLoading: false,
          errorMessage: 'Failed to load games',
        ),
      );
    }
  }

  Future<String?> launchGame(GameItem game) async {
    try {
      return await _repository.launchGame(
        typeId: game.typeId,
        providerId: game.providerId,
        gameId: game.id,
      );
    } on HomeAuthRequiredException {
      await _authController.refreshProfile();
      final token = await _tokenStorage.readToken();
      if (token == null) {
        return null;
      }
      return await _repository.launchGame(
        typeId: game.typeId,
        providerId: game.providerId,
        gameId: game.id,
      );
    } catch (_) {
      return null;
    }
  }

  void _setState(HomeState next) {
    _state = next;
    notifyListeners();
  }
}

