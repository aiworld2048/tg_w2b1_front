import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AppLocalizations {
  AppLocalizations._(this.locale);

  final Locale locale;

  static const supportedLocales = <Locale>[
    Locale('en'),
    Locale('mm'),
    Locale('th'),
    Locale('zh'),
  ];

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const _localizedValues = <String, Map<String, String>>{
    'en': {
      'app_name': 'TG Slot',
      'login': 'Login',
      'logout': 'Logout',
      'username': 'Username',
      'password': 'Password',
      'home_title': 'Home',
      'hot_games': 'Hot Games',
      'providers': 'Providers',
    },
    'mm': {
      'app_name': 'TG Slot',
      'login': 'လော့ဂ်အင်',
      'logout': 'ထွက်ရန်',
      'username': 'အသုံးပြုသူအမည်',
      'password': 'စကားဝှက်',
      'home_title': 'ပင်မစာမျက်နှာ',
      'hot_games': 'လူကြိုက်များသောဂိမ်းများ',
      'providers': 'ပံ့ပိုးသူများ',
    },
  };

  String translate(String key) {
    final langCode = locale.languageCode;
    final values = _localizedValues[langCode] ?? _localizedValues['en']!;
    return values[key] ?? key;
  }
}

class AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) =>
      AppLocalizations.supportedLocales.any((supported) =>
          supported.languageCode == locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    Intl.defaultLocale = locale.languageCode;
    return AppLocalizations._(locale);
  }

  @override
  bool shouldReload(covariant LocalizationsDelegate<AppLocalizations> old) =>
      false;
}

