import type { LocaleDefinition } from '../types';

/**
 * Built-in dictionary of localized human-readable time strings.
 */
export const LOCALES: Record<string, LocaleDefinition> = {
  // English (Default)
  en: {
    human: {
      lessThanOne: '< 1 min read',
      one: '1 min read',
      other: '{minutes} min read',
    },
    compact: {
      lessThanOne: '< 1m',
      one: '1m',
      other: '{minutes}m',
    },
  },

  // Turkish
  tr: {
    human: {
      lessThanOne: '< 1 dk okuma',
      one: '1 dk okuma',
      other: '{minutes} dk okuma',
    },
    compact: {
      lessThanOne: '< 1dk',
      one: '1dk',
      other: '{minutes}dk',
    },
  },

  // Spanish
  es: {
    human: {
      lessThanOne: '< 1 min de lectura',
      one: '1 min de lectura',
      other: '{minutes} min de lectura',
    },
    compact: {
      lessThanOne: '< 1m',
      one: '1m',
      other: '{minutes}m',
    },
  },

  // French
  fr: {
    human: {
      lessThanOne: '< 1 min de lecture',
      one: '1 min de lecture',
      other: '{minutes} min de lecture',
    },
    compact: {
      lessThanOne: '< 1m',
      one: '1m',
      other: '{minutes}m',
    },
  },

  // German
  de: {
    human: {
      lessThanOne: '< 1 Min. Lesezeit',
      one: '1 Min. Lesezeit',
      other: '{minutes} Min. Lesezeit',
    },
    compact: {
      lessThanOne: '< 1m',
      one: '1m',
      other: '{minutes}m',
    },
  },

  // Italian
  it: {
    human: {
      lessThanOne: '< 1 min di lettura',
      one: '1 min di lettura',
      other: '{minutes} min di lettura',
    },
    compact: {
      lessThanOne: '< 1m',
      one: '1m',
      other: '{minutes}m',
    },
  },

  // Portuguese
  pt: {
    human: {
      lessThanOne: '< 1 min de leitura',
      one: '1 min de leitura',
      other: '{minutes} min de leitura',
    },
    compact: {
      lessThanOne: '< 1m',
      one: '1m',
      other: '{minutes}m',
    },
  },

  // Chinese (Simplified)
  zh: {
    human: {
      lessThanOne: '少于 1 分钟阅读',
      one: '1 分钟阅读',
      other: '{minutes} 分钟阅读',
    },
    compact: {
      lessThanOne: '< 1分',
      one: '1分',
      other: '{minutes}分',
    },
  },

  // Japanese
  ja: {
    human: {
      lessThanOne: '1分未満で読めます',
      one: '1分で読めます',
      other: '{minutes}分で読めます',
    },
    compact: {
      lessThanOne: '< 1分',
      one: '1分',
      other: '{minutes}分',
    },
  },

  // Korean
  ko: {
    human: {
      lessThanOne: '1분 미만 소요',
      one: '1분 소요',
      other: '{minutes}분 소요',
    },
    compact: {
      lessThanOne: '< 1분',
      one: '1분',
      other: '{minutes}분',
    },
  },

  // Russian
  ru: {
    human: {
      lessThanOne: '< 1 мин чтения',
      one: '1 мин чтения',
      other: '{minutes} мин чтения',
    },
    compact: {
      lessThanOne: '< 1м',
      one: '1м',
      other: '{minutes}м',
    },
  },

  // Dutch
  nl: {
    human: {
      lessThanOne: '< 1 min leestijd',
      one: '1 min leestijd',
      other: '{minutes} min leestijd',
    },
    compact: {
      lessThanOne: '< 1m',
      one: '1m',
      other: '{minutes}m',
    },
  },

  // Polish
  pl: {
    human: {
      lessThanOne: '< 1 min czytania',
      one: '1 min czytania',
      other: '{minutes} min czytania',
    },
    compact: {
      lessThanOne: '< 1m',
      one: '1m',
      other: '{minutes}m',
    },
  },

  // Arabic
  ar: {
    human: {
      lessThanOne: 'أقل من دقيقة للقراءة',
      one: 'دقيقة واحدة للقراءة',
      other: '{minutes} دقائق للقراءة',
    },
    compact: {
      lessThanOne: '< 1 د',
      one: '1 د',
      other: '{minutes} د',
    },
  },

  // Hindi
  hi: {
    human: {
      lessThanOne: '1 मिनट से कम पढ़ने का समय',
      one: '1 मिनट पढ़ने का समय',
      other: '{minutes} मिनट पढ़ने का समय',
    },
    compact: {
      lessThanOne: '< 1 मि',
      one: '1 मि',
      other: '{minutes} मि',
    },
  },
};
