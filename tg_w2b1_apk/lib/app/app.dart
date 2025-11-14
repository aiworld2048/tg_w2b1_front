import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import '../app/localization/app_localizations.dart';
import '../app/router/app_router.dart';
import '../app/theme/app_theme.dart';
import '../core/network/api_client.dart';
import '../core/storage/token_storage.dart';
import '../features/auth/application/auth_controller.dart';
import '../features/auth/data/auth_repository.dart';
import '../features/home/application/home_controller.dart';
import '../features/home/data/home_repository.dart';

class AppBootstrap {
  AppBootstrap._({
    required this.tokenStorage,
    required this.apiClient,
    required this.authRepository,
    required this.authController,
    required this.homeRepository,
    required this.homeController,
  });

  final TokenStorage tokenStorage;
  final ApiClient apiClient;
  final AuthRepository authRepository;
  final AuthController authController;
  final HomeRepository homeRepository;
  final HomeController homeController;

  static Future<AppBootstrap> create() async {
    final tokenStorage = TokenStorage();
    await tokenStorage.init();

    final apiClient = ApiClient(tokenStorage: tokenStorage);
    await apiClient.configure();

    final authRepository = AuthRepository(
      apiClient: apiClient,
      tokenStorage: tokenStorage,
    );
    final authController = AuthController(authRepository);
    final homeRepository = HomeRepository(
      apiClient: apiClient,
      tokenStorage: tokenStorage,
    );
    final homeController = HomeController(
      homeRepository,
      authController,
      tokenStorage,
    );

    return AppBootstrap._(
      tokenStorage: tokenStorage,
      apiClient: apiClient,
      authRepository: authRepository,
      authController: authController,
      homeRepository: homeRepository,
      homeController: homeController,
    );
  }
}

class AppRoot extends StatelessWidget {
  const AppRoot({
    super.key,
    required this.bootstrap,
  });

  final AppBootstrap bootstrap;

  @override
  Widget build(BuildContext context) {
    final router = AppRouter(bootstrap.authController).router;

    return MultiProvider(
      providers: [
        Provider<TokenStorage>.value(value: bootstrap.tokenStorage),
        Provider<AuthRepository>.value(value: bootstrap.authRepository),
        ChangeNotifierProvider<AuthController>.value(
          value: bootstrap.authController,
        ),
        Provider<HomeRepository>.value(value: bootstrap.homeRepository),
        ChangeNotifierProvider<HomeController>.value(
          value: bootstrap.homeController,
        ),
      ],
      child: MaterialApp.router(
        title: 'TG Slot',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        routerConfig: router,
        supportedLocales: AppLocalizations.supportedLocales,
        localizationsDelegates: const [
          AppLocalizationsDelegate(),
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
      ),
    );
  }
}

