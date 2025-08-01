"""
Constants and data for UN SDG tools and country/location codes.
"""

COUNTRY_CODES = {
    'Afghanistan': '4', 'Åland Islands': '248', 'Albania': '8', 'Algeria': '12', 
    'American Samoa': '16', 'Andorra': '20', 'Angola': '24', 'Anguilla': '660', 
    'Antarctica': '10', 'Antigua and Barbuda': '28', 'Argentina': '32', 'Armenia': '51', 
    'Aruba': '533', 'Australia': '36', 'Austria': '40', 'Azerbaijan': '31', 'Bahamas': '44', 
    'Bahrain': '48', 'Bangladesh': '50', 'Barbados': '52', 'Belarus': '112', 'Belgium': '56', 
    'Belize': '84', 'Benin': '204', 'Bermuda': '60', 'Bhutan': '64', 
    'Bolivia (Plurinational State of)': '68', 'Bosnia and Herzegovina': '70', 'Botswana': '72', 
    'Bouvet Island': '74', 'Brazil': '76', 'British Virgin Islands': '92', 
    'British Indian Ocean Territory': '86', 'Brunei Darussalam': '96', 'Bulgaria': '100', 
    'Burkina Faso': '854', 'Burundi': '108', 'Cambodia': '116', 'Cameroon': '120', 
    'Canada': '124', 'Cabo Verde': '132', 'Cayman Islands': '136', 'Central African Republic': '140', 
    'Chad': '148', 'Chile': '152', 'China': '156', 'China, Hong Kong Special Administrative Region': '344', 
    'China, Macao Special Administrative Region': '446', 'Christmas Island': '162', 
    'Cocos (Keeling) Islands': '166', 'Colombia': '170', 'Comoros': '174', 'Congo': '178', 
    'Democratic Republic of the Congo': '180', 'Cook Islands': '184', 'Costa Rica': '188', 
    "Côte d'Ivoire": '384', 'Croatia': '191', 'Cuba': '192', 'Cyprus': '196', 'Czechia': '203', 
    'Denmark': '208', 'Djibouti': '262', 'Dominica': '212', 'Dominican Republic': '214', 
    'Ecuador': '218', 'Egypt': '818', 'El Salvador': '222', 'Equatorial Guinea': '226', 
    'Eritrea': '232', 'Estonia': '233', 'Ethiopia': '231', 'Falkland Islands (Malvinas)': '238', 
    'Faroe Islands': '234', 'Fiji': '242', 'Finland': '246', 'France': '250', 'French Guiana': '254', 
    'French Polynesia': '258', 'French Southern Territories': '260', 'Gabon': '266', 'Gambia': '270', 
    'Georgia': '268', 'Germany': '276', 'Ghana': '288', 'Gibraltar': '292', 'Greece': '300', 
    'Greenland': '304', 'Grenada': '308', 'Guadeloupe': '312', 'Guam': '316', 'Guatemala': '320', 
    'Guernsey': '831', 'Guinea': '324', 'Guinea-Bissau': '624', 'Guyana': '328', 'Haiti': '332', 
    'Heard Island and McDonald Islands': '334', 'Holy See': '336', 'Honduras': '340', 'Hungary': '348', 
    'Iceland': '352', 'India': '356', 'Indonesia': '360', 'Iran (Islamic Republic of)': '364', 
    'Iraq': '368', 'Ireland': '372', 'Isle of Man': '833', 'Israel': '376', 'Italy': '380', 
    'Jamaica': '388', 'Japan': '392', 'Jersey': '832', 'Jordan': '400', 'Kazakhstan': '398', 
    'Kenya': '404', 'Kiribati': '296', "Democratic People's Republic of Korea": '408', 
    'Republic of Korea': '410', 'Kuwait': '414', 'Kyrgyzstan': '417', 
    "Lao People's Democratic Republic": '418', 'Latvia': '428', 'Lebanon': '422', 'Lesotho': '426', 
    'Liberia': '430', 'Libya': '434', 'Liechtenstein': '438', 'Lithuania': '440', 'Luxembourg': '442', 
    'North Macedonia': '807', 'Madagascar': '450', 'Malawi': '454', 'Malaysia': '458', 'Maldives': '462', 
    'Mali': '466', 'Malta': '470', 'Marshall Islands': '584', 'Martinique': '474', 'Mauritania': '478', 
    'Mauritius': '480', 'Mayotte': '175', 'Mexico': '484', 'Micronesia (Federated States of)': '583', 
    'Republic of Moldova': '498', 'Monaco': '492', 'Mongolia': '496', 'Montenegro': '499', 
    'Montserrat': '500', 'Morocco': '504', 'Mozambique': '508', 'Myanmar': '104', 'Namibia': '516', 
    'Nauru': '520', 'Nepal': '524', 'Netherlands (Kingdom of the)': '528', 'Netherlands Antilles  [former]': '530', 
    'New Caledonia': '540', 'New Zealand': '554', 'Nicaragua': '558', 'Niger': '562', 'Nigeria': '566', 
    'Niue': '570', 'Norfolk Island': '574', 'Northern Mariana Islands': '580', 'Norway': '578', 
    'Oman': '512', 'Pakistan': '586', 'Palau': '585', 'State of Palestine': '275', 'Panama': '591', 
    'Papua New Guinea': '598', 'Paraguay': '600', 'Peru': '604', 'Philippines': '608', 'Pitcairn': '612', 
    'Poland': '616', 'Portugal': '620', 'Puerto Rico': '630', 'Qatar': '634', 'Réunion': '638', 
    'Romania': '642', 'Russian Federation': '643', 'Rwanda': '646', 'Saint Helena': '654', 
    'Saint Kitts and Nevis': '659', 'Saint Lucia': '662', 'Saint Pierre and Miquelon': '666', 
    'Samoa': '882', 'San Marino': '674', 'Sao Tome and Principe': '678', 'Saudi Arabia': '682', 
    'Senegal': '686', 'Serbia': '688', 'Seychelles': '690', 'Sierra Leone': '694', 'Singapore': '702', 
    'Slovakia': '703', 'Slovenia': '705', 'Solomon Islands': '90', 'Somalia': '706', 'South Africa': '710', 
    'South Georgia and the South Sandwich Islands': '239', 'South Sudan': '728', 'Spain': '724', 
    'Sri Lanka': '144', 'Sudan': '729', 'Suriname': '740', 'Svalbard and Jan Mayen Islands': '744', 
    'Eswatini': '748', 'Sweden': '752', 'Switzerland': '756', 'Syrian Arab Republic': '760', 
    'Other non-specified areas in Eastern Asia': '158', 'Tajikistan': '762', 'United Republic of Tanzania': '834', 
    'Thailand': '764', 'Timor-Leste': '626', 'Togo': '768', 'Tokelau': '772', 'Tonga': '776', 
    'Trinidad and Tobago': '780', 'Tunisia': '788', 'Türkiye': '792', 'Turkmenistan': '795', 
    'Turks and Caicos Islands': '796', 'Tuvalu': '798', 'Uganda': '800', 'Ukraine': '804', 
    'United Arab Emirates': '784', 'United Kingdom of Great Britain and Northern Ireland': '826', 
    'United States of America': '840', 'United States Minor Outlying Islands': '581', 'Uruguay': '858', 
    'Uzbekistan': '860', 'Vanuatu': '548', 'Venezuela (Bolivarian Republic of)': '862', 'Viet Nam': '704', 
    'Wallis and Futuna Islands': '876', 'Western Sahara': '732', 'Yemen': '887', 'Zambia': '894', 
    'Zimbabwe': '716', 'Eastern Africa': '14', 'Middle Africa': '17', 'Southern Africa': '18', 
    'Western Africa': '11', 'Caribbean': '29', 'Central America': '13', 'South America': '5', 
    'Northern Africa': '15', 'Sub-Saharan Africa': '202', 'Latin America and the Caribbean': '419', 
    'Northern America': '21', 'Africa': '2', 'Americas': '19', 'World': '1', 'Central Asia': '143', 
    'Eastern Asia': '30', 'South-Eastern Asia': '35', 'Southern Asia': '34', 'Western Asia': '145', 
    'Eastern Europe': '151', 'Northern Europe': '154', 'Southern Europe': '39', 'Western Europe': '155', 
    'Australia and New Zealand': '53', 'Melanesia': '54', 'Micronesia': '57', 'Polynesia': '61', 
    'Europe': '150', 'Asia': '142', 'Oceania': '9', 'Channel Islands': '830', 
    'Bonaire, Sint Eustatius and Saba': '535', 'Curaçao': '531', 'Saint Barthélemy': '652', 
    'Saint Martin (French Part)': '663', 'Saint Vincent and the Grenadines': '670', 
    'Sint Maarten (Dutch part)': '534', 'United States Virgin Islands': '850', 'Sark': '680', 
    'Least Developed Countries (LDCs)': '199', 'Small island developing States (SIDS)': '722', 
    'Landlocked developing countries (LLDCs)': '432', 
    'Developed regions (Europe, Cyprus, Israel, Northern America, Japan, Australia & New Zealand)': '514', 
    'Developing regions': '515', 'Kosovo': '412', 'Central and Southern Asia': '62', 
    'Southern Asia (excluding India)': '127', 'Caucasus and Central Asia': '135', 
    'Organisation for Economic Co-operation and Development (OECD) Member States': '198', 
    'Eastern Asia (excluding Japan and China)': '223', 'Latin America': '420', 
    'Western Asia (exc. Armenia, Azerbaijan, Cyprus, Israel and Georgia)': '485', 
    'Europe and Northern America': '513', 'Eastern Asia (excluding Japan)': '518', 
    'Oceania (exc. Australia and New Zealand)': '543', 'Development Assistance Committee members (DAC)': '593', 
    'Sub-Saharan Africa (inc. Sudan)': '738', 'Northern Africa (exc. Sudan)': '746', 
    'Northern Africa and Western Asia': '747', 'Eastern and South-Eastern Asia': '753', 
    'World Trade Organization (WTO) Member States': '889', 'Serbia and Montenegro [former]': '891', 
    'Africa (ILO)': '901', 'Asia and the Pacific (ILO)': '902', 'Central and Eastern Europe (ILO)': '903', 
    'Middle East and North Africa (ILO)': '904', 'Middle East (ILO)': '905', 'North America (ILO)': '906', 
    'Other regions (ILO)': '907', 'Western Europe (ILO)': '908', 'High income economies (WB)': '910', 
    'Low income economies (WB)': '911', 'Lower middle economies (WB)': '912', 
    'Low and middle income economies (WB)': '913', 'Upper middle economies (WB)': '914', 
    'WTO Developing Member States': '915', 'WTO Developed Member States': '916', 
    'International Centers (FAO)': '917', 'Sudan [former]': '736', 'European Union (EU) Institutions': '918', 
    'European Union': '97', 'Regional Centres (FAO)': '919', 'Azores Islands': '920', 'ODA residual': '921', 
    'Custom groupings of data providers': '922', 'United Kingdom (England and Wales)': '827', 
    'United Kingdom (Northern Ireland)': '828', 'United Kingdom (Scotland)': '829', 'Iraq (Central Iraq)': '369', 
    'Iraq (Kurdistan Region)': '370', 'FAO Major Fishing Area: Pacific, Eastern Central': '99018', 
    'FAO Major Fishing Area: Pacific, Northeast': '99019', 'FAO Major Fishing Area: Pacific, Northwest': '99020', 
    'FAO Major Fishing Area: Pacific, Western Central': '99021', 'FAO Major Fishing Area: Pacific, Southwest': '99022', 
    'FAO Major Fishing Area: Atlantic, Northwest': '99023', 'FAO Major Fishing Area: Atlantic, Northeast': '99024', 
    'FAO Major Fishing Area: Indian Ocean, Eastern': '99025', 'FAO Major Fishing Area: Atlantic, Southeast': '99026', 
    'FAO Major Fishing Area: Indian Ocean, Western': '99027', 'FAO Major Fishing Area: Atlantic, Western Central': '99028', 
    'FAO Major Fishing Area: Atlantic, Eastern Central': '99029', 'FAO Major Fishing Area: Atlantic, Southwest': '99030', 
    'FAO Major Fishing Area: Pacific, Southeast': '99031', 'FAO Major Fishing Area: Mediterranean and Black Sea': '99032', 
    'Areas not elsewhere specified': '896', 'World Marine Bunkers': '99033', 'World Aviation Bunkers': '99034', 
    'Residual/unallocated ODA: Central Asia and Southern Asia': '99035', 
    'Residual/unallocated ODA: Eastern and South-eastern Asia': '99036', 
    'Residual/unallocated ODA: Latin America and the Caribbean': '99037', 
    'Residual/unallocated ODA: Oceania excl. Aus. and N. Zealand': '99038', 
    'Residual/unallocated ODA: Sub-Saharan Africa': '99039', 
    'Residual/unallocated ODA: Western Asia and Northern Africa': '99040', 
    'Africa not elsewhere specified': '577', 'Other non-OECD Americas': '636', 'Other non-OECD Oceania': '527', 
    'Other non-OECD Asia': '487', 'Belgium and Luxembourg': '99041', 'Yugoslavia [former]': '890', 
    'WHO Africa': '99042', 'WHO Americas': '99043', 'WHO South-East Asia': '99044', 'WHO Europe': '99045', 
    'WHO Eastern Mediterranean': '99046', 'WHO Western Pacific': '99047', 'WHO Global': '99048', 
    'United Republic of Tanzania (Mainland)': '835', 'United Republic of Tanzania (Zanzibar)': '836', 
    'Eastern Southern South-Eastern Asia and Oceania (MDG)': '909', 'LLDC Africa': '923', 'LLDC Americas': '924', 
    'LLDC Asia': '925', 'LLDC Europe': '926', 'LDC Africa': '927', 'LDC Americas': '928', 'LDC Asia': '929', 
    'LDC Oceania': '930', 'SIDS Africa': '931', 'SIDS Americas': '932', 'SIDS Asia': '933', 'SIDS Oceania': '934', 
    'World (total) by SDG regions': '935', 'World (total) by continental regions': '936', 
    'World (total) by MDG regions': '937', 'Other Africa (IEA)': '951', 'Member States': '938', 
    'Residual/unallocated ODA: Unspecified, developing countries': '99049', 
    'Residual/unallocated ODA: Northern America and Europe': '99050', 'Unallocated by country': '952', 
    'Large Marine Ecosystem: East Bering Sea': '99051', 'Large Marine Ecosystem: Gulf of Alaska': '99052', 
    'Large Marine Ecosystem: California Current': '99053', 'Large Marine Ecosystem: Gulf of California': '99054', 
    'Large Marine Ecosystem: Gulf of Mexico': '99055', 'Large Marine Ecosystem: Southeast U.S. Continental Shelf': '99056', 
    'Large Marine Ecosystem: Northeast U.S. Continental Shelf': '99057', 'Large Marine Ecosystem: Scotian Shelf': '99058', 
    'Large Marine Ecosystem: Labrador - Newfoundland': '99059', 'Large Marine Ecosystem: Insular Pacific-Hawaiian': '99060', 
    'Large Marine Ecosystem: Pacific Central-American Coastal': '99061', 'Large Marine Ecosystem: Caribbean Sea': '99062', 
    'Large Marine Ecosystem: Humboldt Current': '99063', 'Large Marine Ecosystem: Patagonian Shelf': '99064', 
    'Large Marine Ecosystem: South Brazil Shelf': '99065', 'Large Marine Ecosystem: East Brazil Shelf': '99066', 
    'Large Marine Ecosystem: North Brazil Shelf': '99067', 'Large Marine Ecosystem: Canadian Eastern Arctic - West Greenland': '99068', 
    'Large Marine Ecosystem: Greenland Sea': '99069', 'Large Marine Ecosystem: Barents Sea': '99070', 
    'Large Marine Ecosystem: Norwegian Sea': '99071', 'Large Marine Ecosystem: North Sea': '99072', 
    'Large Marine Ecosystem: Baltic Sea': '99073', 'Large Marine Ecosystem: Celtic-Biscay Shelf': '99074', 
    'Large Marine Ecosystem: Iberian Coastal': '99075', 'Large Marine Ecosystem: Mediterranean Sea': '99076', 
    'Large Marine Ecosystem: Canary Current': '99077', 'Large Marine Ecosystem: Guinea Current': '99078', 
    'Large Marine Ecosystem: Benguela Current': '99079', 'Large Marine Ecosystem: Agulhas Current': '99080', 
    'Large Marine Ecosystem: Somali Coastal Current': '99081', 'Large Marine Ecosystem: Arabian Sea': '99082', 
    'Large Marine Ecosystem: Red Sea': '99083', 'Large Marine Ecosystem: Bay of Bengal': '99084', 
    'Large Marine Ecosystem: Gulf of Thailand': '99085', 'Large Marine Ecosystem: South China Sea': '99086', 
    'Large Marine Ecosystem: Sulu-Celebes Sea': '99087', 'Large Marine Ecosystem: Indonesian Sea': '99088', 
    'Large Marine Ecosystem: North Australian Shelf': '99089', 'Large Marine Ecosystem: Northeast Australian Shelf': '99090', 
    'Large Marine Ecosystem: East Central Australian Shelf': '99091', 'Large Marine Ecosystem: Southeast Australian Shelf': '99092', 
    'Large Marine Ecosystem: South West Australian Shelf': '99093', 'Large Marine Ecosystem: West Central Australian Shelf': '99094', 
    'Large Marine Ecosystem: Northwest Australian Shelf': '99095', 'Large Marine Ecosystem: New Zealand Shelf': '99096', 
    'Large Marine Ecosystem: East China Sea': '99097', 'Large Marine Ecosystem: Yellow Sea': '99098', 
    'Large Marine Ecosystem: Kuroshio Current': '99099', 'Large Marine Ecosystem: Sea of Japan': '99100', 
    'Large Marine Ecosystem: Oyashio Current': '99101', 'Large Marine Ecosystem: Sea of Okhotsk': '99102', 
    'Large Marine Ecosystem: West Bering Sea': '99103', 'Large Marine Ecosystem: Northern Bering - Chukchi Seas': '99104', 
    'Large Marine Ecosystem: Beaufort Sea': '99105', 'Large Marine Ecosystem: East Siberian Sea': '99106', 
    'Large Marine Ecosystem: Laptev Sea': '99107', 'Large Marine Ecosystem: Kara Sea': '99108', 
    'Large Marine Ecosystem: Iceland Shelf and Sea': '99109', 'Large Marine Ecosystem: Faroe Plateau': '99110', 
    'Large Marine Ecosystem: Antarctica': '99111', 'Large Marine Ecosystem: Black Sea': '99112', 
    'Large Marine Ecosystem: Hudson Bay Complex': '99113', 'Large Marine Ecosystem: Central Arctic': '99114', 
    'Large Marine Ecosystem: Aleutian Islands': '99115', 'Large Marine Ecosystem: Canadian High Arctic - North Greenland': '99116', 
    'Ascension': '655'
}

LOCATION_CODES = {
    "id": "Location",
    "codes": [
        {
            "code": "ALLAREA",
            "description": "All areas",
            "sdmx": "_T"
        },
        {
            "code": "URBAN",
            "description": "Urban",
            "sdmx": "U"
        },
        {
            "code": "CITY",
            "description": "City",
            "sdmx": "CITY"
        },
        {
            "code": "TSUB",
            "description": "Town and semi-dense area",
            "sdmx": "TSUB"
        }
    ]
}

SDG11_TARGETS_INDICATORS = """
Goal 11: Make cities and human settlements inclusive, safe, resilient and sustainable

Target 11.1: By 2030, ensure access for all to adequate, safe and affordable housing and basic services and upgrade slums.
    - Indicator 11.1.1: Proportion of urban population living in slums, informal settlements or inadequate housing.

Target 11.2: By 2030, provide access to safe, affordable, accessible and sustainable transport systems for all, improving road safety, notably by expanding public transport, with special attention to the needs of those in vulnerable situations, women, children, persons with disabilities and older persons.
    - Indicator 11.2.1: Proportion of population that has convenient access to public transport, by sex, age and persons with disabilities.

Target 11.3: By 2030, enhance inclusive and sustainable urbanization and capacity for participatory, integrated and sustainable human settlement planning and management in all countries.
    - Indicator 11.3.1: Ratio of land consumption rate to population growth rate.
    - Indicator 11.3.2: Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically.

Target 11.4: Strengthen efforts to protect and safeguard the world's cultural and natural heritage.
    - Indicator 11.4.1: Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding, type of heritage and level of government.

Target 11.5: By 2030, significantly reduce the number of deaths and the number of people affected and substantially decrease the direct economic losses relative to global GDP caused by disasters, including water-related disasters, with a focus on protecting the poor and people in vulnerable situations.
    - Indicator 11.5.1: Number of deaths, missing persons and directly affected persons attributed to disasters per 100,000 population.
    - Indicator 11.5.2: Direct economic loss in relation to global GDP, damage to critical infrastructure and number of disruptions to basic services, attributed to disasters.

Target 11.6: By 2030, reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management.
    - Indicator 11.6.1: Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated, by cities.
    - Indicator 11.6.2: Annual mean levels of fine particulate matter (e.g., PM2.5 and PM10) in cities (population weighted).

Target 11.7: By 2030, provide universal access to safe, inclusive and accessible, green and public spaces, in particular for women and children, older persons and persons with disabilities.
    - Indicator 11.7.1: Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities.
    - Indicator 11.7.2: Proportion of persons victim of physical or sexual harassment, by sex, age, disability status and place of occurrence, in the previous 12 months.

Target 11.a: Support positive economic, social and environmental links between urban, peri-urban and rural areas by strengthening national and regional development planning.
    - Indicator 11.a.1: Number of countries that have national urban policies or regional development plans that respond to population dynamics, ensure balanced territorial development, and increase local fiscal space.

Target 11.b: By 2020, substantially increase the number of cities and human settlements adopting and implementing integrated policies and plans towards inclusion, resource efficiency, mitigation and adaptation to climate change, resilience to disasters, and develop and implement, in line with the Sendai Framework for Disaster Risk Reduction 2015–2030, holistic disaster risk management at all levels.
    - Indicator 11.b.1: Number of countries that adopt and implement national disaster risk reduction strategies in line with the Sendai Framework.
    - Indicator 11.b.2: Proportion of local governments that adopt and implement local disaster risk reduction strategies in line with national disaster risk reduction strategies.

Target 11.c: Support least developed countries, including through financial and technical assistance, in building sustainable and resilient buildings utilizing local materials.
    - Indicator 11.c.1: Proportion of financial support to the least developed countries that is allocated to the construction and retrofitting of sustainable, resilient and resource-efficient buildings utilizing local materials.
""" 