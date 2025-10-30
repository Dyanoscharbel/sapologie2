export const COUNTRIES = [
  // Afrique du Nord
  { code: 'DZ', name: 'Algérie', prefix: '+213', flag: '🇩🇿' },
  { code: 'EG', name: 'Égypte', prefix: '+20', flag: '🇪🇬' },
  { code: 'LY', name: 'Libye', prefix: '+218', flag: '🇱🇾' },
  { code: 'MA', name: 'Maroc', prefix: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisie', prefix: '+216', flag: '🇹🇳' },
  { code: 'SD', name: 'Soudan', prefix: '+249', flag: '🇸🇩' },
  
  // Afrique de l'Ouest
  { code: 'BJ', name: 'Bénin', prefix: '+229', flag: '🇧🇯' },
  { code: 'BF', name: 'Burkina Faso', prefix: '+226', flag: '🇧🇫' },
  { code: 'CV', name: 'Cap-Vert', prefix: '+238', flag: '🇨🇻' },
  { code: 'CI', name: 'Côte d\'Ivoire', prefix: '+225', flag: '🇨🇮' },
  { code: 'GM', name: 'Gambie', prefix: '+220', flag: '🇬🇲' },
  { code: 'GH', name: 'Ghana', prefix: '+233', flag: '🇬🇭' },
  { code: 'GN', name: 'Guinée', prefix: '+224', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinée-Bissau', prefix: '+245', flag: '🇬🇼' },
  { code: 'LR', name: 'Liberia', prefix: '+231', flag: '🇱🇷' },
  { code: 'ML', name: 'Mali', prefix: '+223', flag: '🇲🇱' },
  { code: 'MR', name: 'Mauritanie', prefix: '+222', flag: '🇲🇷' },
  { code: 'NE', name: 'Niger', prefix: '+227', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigéria', prefix: '+234', flag: '🇳🇬' },
  { code: 'SN', name: 'Sénégal', prefix: '+221', flag: '🇸🇳' },
  { code: 'SL', name: 'Sierra Leone', prefix: '+232', flag: '🇸🇱' },
  { code: 'TG', name: 'Togo', prefix: '+228', flag: '🇹🇬' },
  
  // Afrique centrale
  { code: 'AO', name: 'Angola', prefix: '+244', flag: '🇦🇴' },
  { code: 'CM', name: 'Cameroun', prefix: '+237', flag: '🇨🇲' },
  { code: 'CF', name: 'Centrafrique', prefix: '+236', flag: '🇨🇫' },
  { code: 'CG', name: 'Congo', prefix: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'RD Congo', prefix: '+243', flag: '🇨🇩' },
  { code: 'GQ', name: 'Guinée Équatoriale', prefix: '+240', flag: '🇬🇶' },
  { code: 'GA', name: 'Gabon', prefix: '+241', flag: '🇬🇦' },
  { code: 'ST', name: 'São Tomé-et-Príncipe', prefix: '+239', flag: '🇸🇹' },
  { code: 'TD', name: 'Tchad', prefix: '+235', flag: '🇹🇩' },
  
  // Afrique de l'Est
  { code: 'BI', name: 'Burundi', prefix: '+257', flag: '🇧🇮' },
  { code: 'KM', name: 'Comores', prefix: '+269', flag: '🇰🇲' },
  { code: 'DJ', name: 'Djibouti', prefix: '+253', flag: '🇩🇯' },
  { code: 'ER', name: 'Érythrée', prefix: '+291', flag: '🇪🇷' },
  { code: 'ET', name: 'Éthiopie', prefix: '+251', flag: '🇪🇹' },
  { code: 'KE', name: 'Kenya', prefix: '+254', flag: '🇰🇪' },
  { code: 'MG', name: 'Madagascar', prefix: '+261', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', prefix: '+265', flag: '🇲🇼' },
  { code: 'MU', name: 'Maurice', prefix: '+230', flag: '🇲🇺' },
  { code: 'YT', name: 'Mayotte', prefix: '+262', flag: '🇾🇹' },
  { code: 'MZ', name: 'Mozambique', prefix: '+258', flag: '🇲🇿' },
  { code: 'RW', name: 'Rwanda', prefix: '+250', flag: '🇷🇼' },
  { code: 'SC', name: 'Seychelles', prefix: '+248', flag: '🇸🇨' },
  { code: 'SO', name: 'Somalie', prefix: '+252', flag: '🇸🇴' },
  { code: 'SS', name: 'Soudan du Sud', prefix: '+211', flag: '🇸🇸' },
  { code: 'TZ', name: 'Tanzanie', prefix: '+255', flag: '🇹🇿' },
  { code: 'UG', name: 'Ouganda', prefix: '+256', flag: '🇺🇬' },
  { code: 'ZM', name: 'Zambie', prefix: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', prefix: '+263', flag: '🇿🇼' },
  
  // Afrique du Sud
  { code: 'BW', name: 'Botswana', prefix: '+267', flag: '🇧🇼' },
  { code: 'LS', name: 'Lesotho', prefix: '+266', flag: '🇱🇸' },
  { code: 'NA', name: 'Namibie', prefix: '+264', flag: '🇳🇦' },
  { code: 'ZA', name: 'Afrique du Sud', prefix: '+27', flag: '🇿🇦' },
  { code: 'SZ', name: 'Eswatini', prefix: '+268', flag: '🇸🇿' },

  // Europe du Nord
  { code: 'DK', name: 'Danemark', prefix: '+45', flag: '🇩🇰' },
  { code: 'EE', name: 'Estonie', prefix: '+372', flag: '🇪🇪' },
  { code: 'FI', name: 'Finlande', prefix: '+358', flag: '🇫🇮' },
  { code: 'IS', name: 'Islande', prefix: '+354', flag: '🇮🇸' },
  { code: 'IE', name: 'Irlande', prefix: '+353', flag: '🇮🇪' },
  { code: 'LV', name: 'Lettonie', prefix: '+371', flag: '🇱🇻' },
  { code: 'LT', name: 'Lituanie', prefix: '+370', flag: '🇱🇹' },
  { code: 'NO', name: 'Norvège', prefix: '+47', flag: '🇳🇴' },
  { code: 'SE', name: 'Suède', prefix: '+46', flag: '🇸🇪' },
  { code: 'GB', name: 'Royaume-Uni', prefix: '+44', flag: '🇬🇧' },

  // Europe de l'Ouest
  { code: 'AT', name: 'Autriche', prefix: '+43', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgique', prefix: '+32', flag: '🇧🇪' },
  { code: 'FR', name: 'France', prefix: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Allemagne', prefix: '+49', flag: '🇩🇪' },
  { code: 'LU', name: 'Luxembourg', prefix: '+352', flag: '🇱🇺' },
  { code: 'NL', name: 'Pays-Bas', prefix: '+31', flag: '🇳🇱' },
  { code: 'CH', name: 'Suisse', prefix: '+41', flag: '🇨🇭' },

  // Europe du Sud
  { code: 'AL', name: 'Albanie', prefix: '+355', flag: '🇦🇱' },
  { code: 'AD', name: 'Andorre', prefix: '+376', flag: '🇦🇩' },
  { code: 'BA', name: 'Bosnie-Herzégovine', prefix: '+387', flag: '🇧🇦' },
  { code: 'HR', name: 'Croatie', prefix: '+385', flag: '🇭🇷' },
  { code: 'CY', name: 'Chypre', prefix: '+357', flag: '🇨🇾' },
  { code: 'GR', name: 'Grèce', prefix: '+30', flag: '🇬🇷' },
  { code: 'IT', name: 'Italie', prefix: '+39', flag: '🇮🇹' },
  { code: 'MT', name: 'Malte', prefix: '+356', flag: '🇲🇹' },
  { code: 'ME', name: 'Monténégro', prefix: '+382', flag: '🇲🇪' },
  { code: 'PT', name: 'Portugal', prefix: '+351', flag: '🇵🇹' },
  { code: 'SM', name: 'Saint-Marin', prefix: '+378', flag: '🇸🇲' },
  { code: 'RS', name: 'Serbie', prefix: '+381', flag: '🇷🇸' },
  { code: 'ES', name: 'Espagne', prefix: '+34', flag: '🇪🇸' },
  { code: 'VA', name: 'Vatican', prefix: '+379', flag: '🇻🇦' },

  // Europe centrale et de l'Est
  { code: 'BY', name: 'Biélorussie', prefix: '+375', flag: '🇧🇾' },
  { code: 'CZ', name: 'Tchéquie', prefix: '+420', flag: '🇨🇿' },
  { code: 'HU', name: 'Hongrie', prefix: '+36', flag: '🇭🇺' },
  { code: 'PL', name: 'Pologne', prefix: '+48', flag: '🇵🇱' },
  { code: 'RO', name: 'Roumanie', prefix: '+40', flag: '🇷🇴' },
  { code: 'RU', name: 'Russie', prefix: '+7', flag: '🇷🇺' },
  { code: 'SK', name: 'Slovaquie', prefix: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovénie', prefix: '+386', flag: '🇸🇮' },
  { code: 'UA', name: 'Ukraine', prefix: '+380', flag: '🇺🇦' },

  // Asie du Sud
  { code: 'AF', name: 'Afghanistan', prefix: '+93', flag: '🇦🇫' },
  { code: 'BD', name: 'Bangladesh', prefix: '+880', flag: '🇧🇩' },
  { code: 'BT', name: 'Bhoutan', prefix: '+975', flag: '🇧🇹' },
  { code: 'IN', name: 'Inde', prefix: '+91', flag: '🇮🇳' },
  { code: 'IR', name: 'Iran', prefix: '+98', flag: '🇮🇷' },
  { code: 'KP', name: 'Corée du Nord', prefix: '+850', flag: '🇰🇵' },
  { code: 'MV', name: 'Maldives', prefix: '+960', flag: '🇲🇻' },
  { code: 'NP', name: 'Népal', prefix: '+977', flag: '🇳🇵' },
  { code: 'PK', name: 'Pakistan', prefix: '+92', flag: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka', prefix: '+94', flag: '🇱🇰' },

  // Asie du Sud-Est
  { code: 'BN', name: 'Brunei', prefix: '+673', flag: '🇧🇳' },
  { code: 'KH', name: 'Cambodge', prefix: '+855', flag: '🇰🇭' },
  { code: 'ID', name: 'Indonésie', prefix: '+62', flag: '🇮🇩' },
  { code: 'LA', name: 'Laos', prefix: '+856', flag: '🇱🇦' },
  { code: 'MY', name: 'Malaisie', prefix: '+60', flag: '🇲🇾' },
  { code: 'MM', name: 'Birmanie', prefix: '+95', flag: '🇲🇲' },
  { code: 'PH', name: 'Philippines', prefix: '+63', flag: '🇵🇭' },
  { code: 'SG', name: 'Singapour', prefix: '+65', flag: '🇸🇬' },
  { code: 'TH', name: 'Thaïlande', prefix: '+66', flag: '🇹🇭' },
  { code: 'TL', name: 'Timor oriental', prefix: '+670', flag: '🇹🇱' },
  { code: 'VN', name: 'Viêt Nam', prefix: '+84', flag: '🇻🇳' },

  // Asie du Moyen-Orient
  { code: 'BH', name: 'Bahreïn', prefix: '+973', flag: '🇧🇭' },
  { code: 'IQ', name: 'Irak', prefix: '+964', flag: '🇮🇶' },
  { code: 'IL', name: 'Israël', prefix: '+972', flag: '🇮🇱' },
  { code: 'JO', name: 'Jordanie', prefix: '+962', flag: '🇯🇴' },
  { code: 'KW', name: 'Koweït', prefix: '+965', flag: '🇰🇼' },
  { code: 'LB', name: 'Liban', prefix: '+961', flag: '🇱🇧' },
  { code: 'OM', name: 'Oman', prefix: '+968', flag: '🇴🇲' },
  { code: 'QA', name: 'Qatar', prefix: '+974', flag: '🇶🇦' },
  { code: 'SA', name: 'Arabie Saoudite', prefix: '+966', flag: '🇸🇦' },
  { code: 'SY', name: 'Syrie', prefix: '+963', flag: '🇸🇾' },
  { code: 'AE', name: 'Émirats Arabes Unis', prefix: '+971', flag: '🇦🇪' },
  { code: 'YE', name: 'Yémen', prefix: '+967', flag: '🇾🇪' },

  // Asie de l'Est
  { code: 'CN', name: 'Chine', prefix: '+86', flag: '🇨🇳' },
  { code: 'HK', name: 'Hong Kong', prefix: '+852', flag: '🇭🇰' },
  { code: 'JP', name: 'Japon', prefix: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Corée du Sud', prefix: '+82', flag: '🇰🇷' },
  { code: 'MO', name: 'Macao', prefix: '+853', flag: '🇲🇴' },
  { code: 'MN', name: 'Mongolie', prefix: '+976', flag: '🇲🇳' },
  { code: 'TW', name: 'Taïwan', prefix: '+886', flag: '🇹🇼' },

  // Asie centrale
  { code: 'KZ', name: 'Kazakhstan', prefix: '+7', flag: '🇰🇿' },
  { code: 'KG', name: 'Kirghizistan', prefix: '+996', flag: '🇰🇬' },
  { code: 'TJ', name: 'Tadjikistan', prefix: '+992', flag: '🇹🇯' },
  { code: 'TM', name: 'Turkménistan', prefix: '+993', flag: '🇹🇲' },
  { code: 'UZ', name: 'Ouzbékistan', prefix: '+998', flag: '🇺🇿' },

  // Asie du Caucase
  { code: 'AM', name: 'Arménie', prefix: '+374', flag: '🇦🇲' },
  { code: 'AZ', name: 'Azerbaïdjan', prefix: '+994', flag: '🇦🇿' },
  { code: 'GE', name: 'Géorgie', prefix: '+995', flag: '🇬🇪' },
  { code: 'TR', name: 'Turquie', prefix: '+90', flag: '🇹🇷' },

  // Amérique du Nord
  { code: 'CA', name: 'Canada', prefix: '+1', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexique', prefix: '+52', flag: '🇲🇽' },
  { code: 'US', name: 'États-Unis', prefix: '+1', flag: '🇺🇸' },

  // Amérique centrale
  { code: 'BZ', name: 'Belize', prefix: '+501', flag: '🇧🇿' },
  { code: 'CR', name: 'Costa Rica', prefix: '+506', flag: '🇨🇷' },
  { code: 'SV', name: 'Salvador', prefix: '+503', flag: '🇸🇻' },
  { code: 'GT', name: 'Guatemala', prefix: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', prefix: '+504', flag: '🇭🇳' },
  { code: 'NI', name: 'Nicaragua', prefix: '+505', flag: '🇳🇮' },
  { code: 'PA', name: 'Panama', prefix: '+507', flag: '🇵🇦' },

  // Caraïbes
  { code: 'AG', name: 'Antigua-et-Barbuda', prefix: '+1268', flag: '🇦🇬' },
  { code: 'BS', name: 'Bahamas', prefix: '+1242', flag: '🇧🇸' },
  { code: 'BB', name: 'Barbade', prefix: '+1246', flag: '🇧🇧' },
  { code: 'CU', name: 'Cuba', prefix: '+53', flag: '🇨🇺' },
  { code: 'DM', name: 'Dominique', prefix: '+1767', flag: '🇩🇲' },
  { code: 'DO', name: 'République Dominicaine', prefix: '+1829', flag: '🇩🇴' },
  { code: 'GD', name: 'Grenade', prefix: '+1473', flag: '🇬🇩' },
  { code: 'HT', name: 'Haïti', prefix: '+509', flag: '🇭🇹' },
  { code: 'JM', name: 'Jamaïque', prefix: '+1876', flag: '🇯🇲' },
  { code: 'KN', name: 'Saint-Kitts-et-Nevis', prefix: '+1869', flag: '🇰🇳' },
  { code: 'LC', name: 'Sainte-Lucie', prefix: '+1758', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint-Vincent-et-les-Grenadines', prefix: '+1784', flag: '🇻🇨' },
  { code: 'TT', name: 'Trinité-et-Tobago', prefix: '+1868', flag: '🇹🇹' },

  // Amérique du Sud
  { code: 'AR', name: 'Argentine', prefix: '+54', flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivie', prefix: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brésil', prefix: '+55', flag: '🇧🇷' },
  { code: 'CL', name: 'Chili', prefix: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombie', prefix: '+57', flag: '🇨🇴' },
  { code: 'EC', name: 'Équateur', prefix: '+593', flag: '🇪🇨' },
  { code: 'GF', name: 'Guyane française', prefix: '+594', flag: '🇬🇫' },
  { code: 'GY', name: 'Guyana', prefix: '+592', flag: '🇬🇾' },
  { code: 'PY', name: 'Paraguay', prefix: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Pérou', prefix: '+51', flag: '🇵🇪' },
  { code: 'SR', name: 'Suriname', prefix: '+597', flag: '🇸🇷' },
  { code: 'UY', name: 'Uruguay', prefix: '+598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', prefix: '+58', flag: '🇻🇪' },

  // Océanie
  { code: 'AU', name: 'Australie', prefix: '+61', flag: '🇦🇺' },
  { code: 'FJ', name: 'Fidji', prefix: '+679', flag: '🇫🇯' },
  { code: 'KI', name: 'Kiribati', prefix: '+686', flag: '🇰🇮' },
  { code: 'MH', name: 'Îles Marshall', prefix: '+692', flag: '🇲🇭' },
  { code: 'FM', name: 'Micronésie', prefix: '+691', flag: '🇫🇲' },
  { code: 'NR', name: 'Nauru', prefix: '+674', flag: '🇳🇷' },
  { code: 'NZ', name: 'Nouvelle-Zélande', prefix: '+64', flag: '🇳🇿' },
  { code: 'PW', name: 'Palaos', prefix: '+680', flag: '🇵🇼' },
  { code: 'PG', name: 'Papouasie-Nouvelle-Guinée', prefix: '+675', flag: '🇵🇬' },
  { code: 'WS', name: 'Samoa', prefix: '+685', flag: '🇼🇸' },
  { code: 'SB', name: 'Îles Salomon', prefix: '+677', flag: '🇸🇧' },
  { code: 'TO', name: 'Tonga', prefix: '+676', flag: '🇹🇴' },
  { code: 'TV', name: 'Tuvalu', prefix: '+688', flag: '🇹🇻' },
  { code: 'VU', name: 'Vanuatu', prefix: '+678', flag: '🇻🇺' },
];

export function getCountryByCode(code: string) {
  return COUNTRIES.find(country => country.code === code);
}

export function getCountryByName(name: string) {
  return COUNTRIES.find(country => country.name === name);
}

export function getPrefixByCountry(countryName: string) {
  const country = getCountryByName(countryName);
  return country?.prefix || '';
}