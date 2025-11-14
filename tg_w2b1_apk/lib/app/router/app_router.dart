import 'package:go_router/go_router.dart';

import '../../features/auth/application/auth_controller.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/home/presentation/home_shell.dart';
import '../../features/splash/presentation/splash_screen.dart';

class AppRouter {
  AppRouter(this._authController);

  final AuthController _authController;

  late final GoRouter router = GoRouter(
    initialLocation: SplashScreen.routeName,
    refreshListenable: _authController,
    routes: <GoRoute>[
      GoRoute(
        path: SplashScreen.routeName,
        name: SplashScreen.routeName,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: LoginScreen.routeName,
        name: LoginScreen.routeName,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: HomeShell.routeName,
        name: HomeShell.routeName,
        builder: (context, state) => const HomeShell(),
      ),
    ],
    redirect: (context, state) {
      final status = _authController.status;
      final location = state.uri.path;
      final isLoggingIn = location == LoginScreen.routeName;

      if (status == AuthStatus.unknown) {
        return SplashScreen.routeName;
      }

      if (status == AuthStatus.unauthenticated) {
        return isLoggingIn ? null : LoginScreen.routeName;
      }

      if (status == AuthStatus.authenticated &&
          (isLoggingIn || location == SplashScreen.routeName)) {
        return HomeShell.routeName;
      }

      return null;
    },
  );
}

