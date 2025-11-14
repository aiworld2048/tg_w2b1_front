import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../features/auth/application/auth_controller.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    final user = auth.user;

    if (user == null) {
      return const _CenteredMessage(
        message: 'Login to view profile information.',
      );
    }

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        CircleAvatar(
          radius: 40,
          backgroundColor: Colors.amber.withValues(alpha: 0.2),
          child: const Icon(
            Icons.person_rounded,
            size: 48,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        Center(
          child: Text(
            user.displayName.isNotEmpty ? user.displayName : user.username,
            style: Theme.of(context).textTheme.headlineSmall,
          ),
        ),
        const SizedBox(height: 32),
        _ProfileTile(
          icon: Icons.badge_outlined,
          label: 'Username',
          value: user.username,
        ),
        _ProfileTile(
          icon: Icons.account_balance_wallet_outlined,
          label: 'Main Balance',
          value: user.mainBalance.toStringAsFixed(2),
        ),
        _ProfileTile(
          icon: Icons.sports_esports_outlined,
          label: 'Game Balance',
          value: user.balance.toStringAsFixed(2),
        ),
      ],
    );
  }
}

class _ProfileTile extends StatelessWidget {
  const _ProfileTile({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: const Color(0xFF101A38),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: Icon(icon, color: Colors.amber),
        title: Text(label),
        subtitle: Text(value),
      ),
    );
  }
}

class _CenteredMessage extends StatelessWidget {
  const _CenteredMessage({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        message,
        style: Theme.of(context).textTheme.bodyMedium,
      ),
    );
  }
}

