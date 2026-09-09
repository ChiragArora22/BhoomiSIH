/**
 * Comprehensive DILRMP National Administrative Hierarchy Dataset
 * Provides cascading State -> District -> Tehsil / Taluk -> Revenue Village metadata
 */

export interface AdministrativeDivision {
  name: string;
  vernacularName?: string;
}

export interface StateHierarchyData {
  name: string;
  vernacular: string;
  districts: Record<
    string,
    {
      vernacular: string;
      tehsils: Record<
        string,
        {
          vernacular: string;
          villages: string[];
        }
      >;
    }
  >;
}

export const ADMINISTRATIVE_HIERARCHY: Record<string, StateHierarchyData> = {
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    vernacular: 'उत्तर प्रदेश',
    districts: {
      'Lucknow': {
        vernacular: 'लखनऊ',
        tehsils: {
          'Mohanlalganj': {
            vernacular: 'मोहनलालगंज',
            villages: [
              'Bhaupur (भाऊपुर)',
              'Kalli Paschim (कल्ली पश्चिम)',
              'Jabreli (जबरेली)',
              'Nagram (नगराम)',
              'Gosainganj (गोसाईंगंज)',
              'Kankaha (कनकाहा)',
              'Khujoli (खुजोली)',
              'Sissendi (सिसेंडी)',
              'Khurdahi (खुरदही)',
              'Mohanlalganj Rural (मोहनलालगंज ग्रामीण)'
            ]
          },
          'Bakshi Ka Talab': {
            vernacular: 'बख्शी का तालाब',
            villages: [
              'Bhaisamau (भैसामऊ)',
              'Mundiyara (मुंडियारा)',
              'Asthi (अस्थि)',
              'Kathwara (कठवारा)',
              'Bargadi Magath (बरगदी मगठ)',
              'Bhopalpur (भोपालपुर)',
              'Itaunja (इटौंजा)'
            ]
          },
          'Sarojini Nagar': {
            vernacular: 'सरोजिनी नगर',
            villages: [
              'Amausi (अमौसी)',
              'Banthra (बंथरा)',
              'Harchandpur (हरचंदपुर)',
              'Chilawan (चिलावां)',
              'Natkur (नटकुर)',
              'Mati (माती)',
              'Gauri (गौरी)'
            ]
          },
          'Malihabad': {
            vernacular: 'मलिहाबाद',
            villages: [
              'Kasmandi Kalan (कसमंडी कलां)',
              'Bakhtiyarnagar (बख्तियारनगर)',
              'Rahimabad (रहीमाबाद)',
              'Saspan (ससपन)',
              'Gohramau (गोहरामऊ)',
              'Kakrahabad (ककराहाबाद)'
            ]
          },
          'Lucknow Sadar': {
            vernacular: 'लखनऊ सदर',
            villages: [
              'Chinhat (चिनहट)',
              'Kakori (काकोरी)',
              'Alambagh (आलमबाग)',
              'Gomti Nagar Vistar (गोमती नगर विस्तार)',
              'Hasanpur Khevali (हसनपुर खेवली)'
            ]
          }
        }
      },
      'Rampur': {
        vernacular: 'रामपुर',
        tehsils: {
          'Bilaspur': {
            vernacular: 'बिलासपुर',
            villages: [
              'Rampur Khas (रामपुर खास)',
              'Dhamora (धमोरा)',
              'Kaimri (केमरी)',
              'Rudra Bilas (रुद्र बिलासपुर)',
              'Dibdiba (दिबदिबा)',
              'Kalyanpur (कल्याणपुर)'
            ]
          },
          'Milak': {
            vernacular: 'मिलक',
            villages: [
              'Karamchari Nagar (कर्मचारी नगर)',
              'Loha (लोहा)',
              'Pranpur (प्रानपुर)',
              'Silai Bada (सिलाई बड़ा)',
              'Rathora (राठौरा)'
            ]
          },
          'Shahabad': {
            vernacular: 'शाहबाद',
            villages: [
              'Madkar (मदकार)',
              'Dhakiya (ढकिया)',
              'Saifni (सैफनी)',
              'Patwai (पटवाई)',
              'Mitrapur (मित्रपुर)'
            ]
          },
          'Swar': {
            vernacular: 'स्वार',
            villages: [
              'Tanda (टांडा)',
              'Maswasi (मसवासी)',
              'Dadiyal (दड़ियाल)',
              'Kazi Khera (काजी खेड़ा)'
            ]
          },
          'Rampur Sadar': {
            vernacular: 'रामपुर सदर',
            villages: [
              'Civil Lines (सिविल लाइन्स)',
              'Panwariya (पनवरिया)',
              'Bhot (भोट)',
              'Azimnagar (अजीमनगर)'
            ]
          }
        }
      },
      'Varanasi': {
        vernacular: 'वाराणसी',
        tehsils: {
          'Varanasi Sadar': {
            vernacular: 'वाराणसी सदर',
            villages: [
              'Shivpur (शिवपुर)',
              'Ramnagar (रामनगर)',
              'Lohta (लोहता)',
              'Sarnath (सारनाथ)',
              'Manduadih (मंडुआडीह)'
            ]
          },
          'Pindra': {
            vernacular: 'पिंडरा',
            villages: [
              'Phulpur (फूलपुर)',
              'Sindhora (सिंधोरा)',
              'Mangari (मंगारी)',
              'Basani (बसनी)',
              'Kharagpur (खरगपुर)'
            ]
          },
          'Raja Talab': {
            vernacular: 'राजा तालाब',
            villages: [
              'Kachhwa (कछवा)',
              'Mirzamurad (मिर्जामुराद)',
              'Rohaniya (रोहनिया)',
              'Mohan Serai (मोहन सराय)',
              'Jakhini (जखिनी)'
            ]
          }
        }
      },
      'Prayagraj': {
        vernacular: 'प्रयागराज',
        tehsils: {
          'Soraon': {
            vernacular: 'सोरांव',
            villages: [
              'Mauaima (मऊआइमा)',
              'Holagarh (होलागढ़)',
              'Dahiyawan (दहियावां)',
              'Faizabad Rural (फैजाबाद ग्रामीण)'
            ]
          },
          'Phulpur': {
            vernacular: 'फूलपुर',
            villages: [
              'Jhusi (झूसी)',
              'Bahria (बहरिया)',
              'Sarai Inayat (सराय इनायत)',
              'Andawa (अंदावा)'
            ]
          },
          'Karchhana': {
            vernacular: 'करछना',
            villages: [
              'Naini (नैनी)',
              'Kaudhiyara (कौंधियारा)',
              'Bheerpur (भीरपुर)',
              'Chaka (चाका)'
            ]
          }
        }
      },
      'Gorakhpur': {
        vernacular: 'गोरखपुर',
        tehsils: {
          'Sahjanwa': {
            vernacular: 'सहजनवा',
            villages: [
              'Ghaghsara (घघसरा)',
              'Bhangha (भांघा)',
              'Rithwa (रिठवा)',
              'GIDA Industrial (गीडा इंडस्ट्रियल)',
              'Piprauli (पिपराउली)'
            ]
          },
          'Gorakhpur Sadar': {
            vernacular: 'गोरखपुर सदर',
            villages: [
              'Chargawan (चरगांवा)',
              'Pipraich (पिपराइच)',
              'Arogya Mandir (आरोग्य मंदिर)',
              'Mohaddipur (मोहद्दीपुर)'
            ]
          },
          'Chauri Chaura': {
            vernacular: 'चौरी चौरा',
            villages: [
              'Brahmpur (ब्रह्मपुर)',
              'Mundera Bazar (मुंडेरा बाजार)',
              'Sardarnagar (सरदारनगर)',
              'Bhopa (भोपा)'
            ]
          }
        }
      }
    }
  },

  'Maharashtra': {
    name: 'Maharashtra',
    vernacular: 'महाराष्ट्र',
    districts: {
      'Pune': {
        vernacular: 'पुणे',
        tehsils: {
          'Mulshi': {
            vernacular: 'मुळशी - पौड',
            villages: [
              'Paud (पौड)',
              'Pirangut (पिरंगुट)',
              'Lavasa (लवासा)',
              'Male (माले)',
              'Khadakwasla (खडकवासला)',
              'Bhugaon (भुगाव)',
              'Kharde (खर्डे)',
              'Rihe (रिहे)',
              'Kasar Amboli (कासार आंबोली)'
            ]
          },
          'Haveli': {
            vernacular: 'हवेली',
            villages: [
              'Wagholi (वाघोली)',
              'Hadapsar (हडपसर)',
              'Uruli Kanchan (उरुळी कांचन)',
              'Manjari (मांजरी)',
              'Loni Kalbhor (लोणी काळभोर)',
              'Keshavnagar (केशवनगर)'
            ]
          },
          'Maval': {
            vernacular: 'मावळ - वडगाव',
            villages: [
              'Lonavala (लोणावळा)',
              'Talegaon Dabhade (तळेगाव दाभाडे)',
              'Kamshet (कामशेत)',
              'Vadgaon (वडगाव)',
              'Dehu (देहू)',
              'Somatane (सोमटने)'
            ]
          },
          'Baramati': {
            vernacular: 'बारामती',
            villages: [
              'Malegaon (माळेगाव)',
              'Supa (सुपा)',
              'Morgaon (मोरगाव)',
              'Someshwar (सोमेश्वर)',
              'Khandala (खंडाळा)'
            ]
          },
          'Khed': {
            vernacular: 'खेड - राजगुरुनगर',
            villages: [
              'Chakan (चाकण)',
              'Alandi (आळंदी)',
              'Rajgurunagar (राजगुरुनगर)',
              'Kadus (कडूस)',
              'Kuruli (कुरुळी)'
            ]
          }
        }
      },
      'Mumbai Suburban': {
        vernacular: 'मुंबई उपनगर',
        tehsils: {
          'Andheri': {
            vernacular: 'अंधेरी',
            villages: [
              'Versova (वर्सोवा)',
              'Marol (मरोल)',
              'Vile Parle (विलेपार्ले)',
              'Oshiwara (ओशिवरा)',
              'Kondivita (कोंदिविटा)'
            ]
          },
          'Borivali': {
            vernacular: 'बोरीवली',
            villages: [
              'Dahisar (दहिसर)',
              'Kandivali (कांदिवली)',
              'Gorai (गोराई)',
              'Magathane (मागाठाणे)',
              'Malad (मालाड)'
            ]
          },
          'Kurla': {
            vernacular: 'कुर्ला',
            villages: [
              'Chembur (चेंबर)',
              'Ghatkopar (घाटकोपर)',
              'Bhandup (भांडुप)',
              'Trombay (तुर्भे)',
              'Kanjurmarg (कांजूरमार्ग)'
            ]
          }
        }
      },
      'Nagpur': {
        vernacular: 'नागपूर',
        tehsils: {
          'Hingna': {
            vernacular: 'हिंगणा',
            villages: [
              'Wadi (वाडी)',
              'Kanhan (कन्हान)',
              'Takalghat (टाकळघाट)',
              'Gumgaon (गुमगाव)',
              'Isasani (ईसासाणी)'
            ]
          },
          'Nagpur Urban': {
            vernacular: 'नागपूर शहर',
            villages: [
              'Sitabuldi (सीताबर्डी)',
              'Dharampeth (धरमपेठ)',
              'Sonegaon (सोनेगाव)',
              'Mankapur (मानकापूर)'
            ]
          },
          'Kamthi': {
            vernacular: 'कामठी',
            villages: [
              'Kamthi Rural (कामठी ग्रामीण)',
              'Gondegaon (गोंडेगाव)',
              'Ajani (अजनी)',
              'Waregaon (वारेगाव)'
            ]
          }
        }
      },
      'Nashik': {
        vernacular: 'नाशिक',
        tehsils: {
          'Niphad': {
            vernacular: 'निफाड',
            villages: [
              'Pimpalgaon Baswant (पिंपळगाव बसवंत)',
              'Lasalgaon (लासलगाव)',
              'Saykheda (सायखेडा)',
              'Ozar (ओझर)',
              'Khedgaon (खेडगाव)'
            ]
          },
          'Nashik': {
            vernacular: 'नाशिक',
            villages: [
              'Satpur (सातपूर)',
              'Ambad (आंबड)',
              'Deolali (देवळाली)',
              'Makhmalabad (मखमलाबाद)'
            ]
          },
          'Igatpuri': {
            vernacular: 'इगतपुरी',
            villages: [
              'Ghoti (घोती)',
              'Bhavali (भावली)',
              'Vaitarna (वैतरणा)',
              'Tringalwadi (त्रिंगलवाडी)'
            ]
          }
        }
      },
      'Chhatrapati Sambhajinagar': {
        vernacular: 'छत्रपती संभाजीनगर (औरंगाबाद)',
        tehsils: {
          'Paithan': {
            vernacular: 'पैठण',
            villages: [
              'Bhadli (भाडली)',
              'Pachod (पाचोड)',
              'Bidkin (बिडकीन)',
              'Navgaon (नवगाव)',
              'Isarwadi (ईसरवाडी)'
            ]
          },
          'Aurangabad': {
            vernacular: 'औरंगाबाद',
            villages: [
              'Chikalthana (चिकलठाणा)',
              'Waluj (वाळूज)',
              'Shendra (शेंद्रा)',
              'Harsul (हर्सूल)'
            ]
          }
        }
      }
    }
  },

  'Tamil Nadu': {
    name: 'Tamil Nadu',
    vernacular: 'தமிழ்நாடு',
    districts: {
      'Chengalpattu': {
        vernacular: 'செங்கல்பட்டு',
        tehsils: {
          'Thiruporur': {
            vernacular: 'திருப்போரூர்',
            villages: [
              'Nemmeli (நெம்மேலி)',
              'Thaiyur (தையூர்)',
              'Kelambakkam (கேளம்பாக்கம்)',
              'Illalur (இல்லலூர்)',
              'Kalavakkam (களவாக்கம்)',
              'Alathur (ஆலத்தூர்)',
              'Siruseri (சிறுசேரி)',
              'Pudupakkam (புதுப்பாக்கம்)'
            ]
          },
          'Chengalpattu': {
            vernacular: 'செங்கல்பட்டு',
            villages: [
              'Melrosapuram (மேல்ரோசாபுரம்)',
              'Singaperumal Koil (சிங்கபெருமாள் கோவில்)',
              'Paranur (பரனூர்)',
              'Guduvanchery (கூடுவாஞ்சேரி)',
              'Maramalai Nagar (மறைமலை நகர்)'
            ]
          },
          'Tambaram': {
            vernacular: 'தாம்பரம்',
            villages: [
              'Selaiyur (சேலையூர்)',
              'Chitlapakkam (சிட்லபாக்கம்)',
              'Mudichur (முடிச்சூர்)',
              'Peerkankaranai (பீர்க்கன்கரணை)',
              'Madambakkam (மாடம்பாக்கம்)'
            ]
          },
          'Vandalur': {
            vernacular: 'வண்டலூர்',
            villages: [
              'Otteri (ஒட்டேரி)',
              'Kolapakkam (கொளப்பாக்கம்)',
              'Nedungundram (நெடுங்குன்றம்)',
              'Unamancheri (ஊனமாஞ்சேரி)'
            ]
          },
          'Maduranthakam': {
            vernacular: 'மதுராந்தகம்',
            villages: [
              'Acharapakkam (அச்சரப்பாக்கம்)',
              'Vedanthangal (வேடந்தாங்கல்)',
              'Kunnathur (குன்னத்தூர்)',
              'Chithamur (சித்தாமூர்)'
            ]
          }
        }
      },
      'Coimbatore': {
        vernacular: 'கோயம்புத்தூர்',
        tehsils: {
          'Sulur': {
            vernacular: 'சூலூர்',
            villages: [
              'Kalangal (கலங்கல்)',
              'Arasur (அரசூர்)',
              'Kaniyur (கணியூர்)',
              'Irugur (இருசூர்)',
              'Kannampalayam (கண்ணம்பாளையம்)'
            ]
          },
          'Pollachi': {
            vernacular: 'பொள்ளாச்சி',
            villages: [
              'Anaimalai (ஆனைமலை)',
              'Kinathukadavu (கிணத்துக்கடவு)',
              'Zamin Uthukuli (ஜமீன் உத்துக்குளி)',
              'Samathur (சமத்தூர்)'
            ]
          },
          'Coimbatore North': {
            vernacular: 'கோயம்புத்தூர் வடக்கு',
            villages: [
              'Thudiyalur (துடியலூர்)',
              'Saravanampatti (சரவணம்பட்டி)',
              'Periyanaickenpalayam (பெரியநாயக்கன்பாளையம்)',
              'Kovilpalayam (கோவில்பாளையம்)'
            ]
          }
        }
      },
      'Kanchipuram': {
        vernacular: 'காஞ்சிபுரம்',
        tehsils: {
          'Sriperumbudur': {
            vernacular: 'ஸ்ரீபெரும்புதூர்',
            villages: [
              'Irungattukottai (இருங்காட்டுக்கோட்டை)',
              'Sunguvarchatram (சுங்குவார்சத்திரம்)',
              'Vallam (வல்லம்)',
              'Mambakkam (மாம்பாக்கம்)',
              'Pillaiperumalnallur (பிள்ளைபெருமாள்நல்லூர்)'
            ]
          },
          'Kanchipuram': {
            vernacular: 'காஞ்சிபுரம்',
            villages: [
              'Walajabad (வாலாஜாபாத்)',
              'Uthiramerur (உத்திரமேரூர்)',
              'Orikkai (ஓரிக்காய்)',
              'Thenambakkam (தேனம்பாக்கம்)'
            ]
          }
        }
      },
      'Madurai': {
        vernacular: 'மதுரை',
        tehsils: {
          'Melur': {
            vernacular: 'மேலூர்',
            villages: [
              'Kottampatti (கொட்டாம்பட்டி)',
              'Keelavalavu (கீழவளவு)',
              'Attapatti (அட்டபட்டி)',
              'Vellalur (வெள்ளலூர்)'
            ]
          },
          'Madurai North': {
            vernacular: 'மதுரை வடக்கு',
            villages: [
              'Othakadai (ஒத்தக்கடை)',
              'Alanganallur (அலங்காநல்லூர்)',
              'Palamedu (பாலமேடு)',
              'Sikandar Chavadi (சிக்கந்தர் சாவடி)'
            ]
          }
        }
      }
    }
  },

  'Telangana': {
    name: 'Telangana',
    vernacular: 'తెలంగాణ',
    districts: {
      'Ranga Reddy': {
        vernacular: 'రంగారెడ్డి',
        tehsils: {
          'Shamshabad': {
            vernacular: 'శంషాబాద్',
            villages: [
              'Mamidipally (మామిడిపల్లి)',
              'Kavaguda (కావగూడ)',
              'Gollapally (గొల్లపల్లి)',
              'Gaganpahad (గగన్‌పహాడ్)',
              'Ootapally (ఊటపల్లి)',
              'Kotwalguda (కొత్వాల్‌గూడ)',
              'Madanpally (మదన్‌పల్లి)',
              'Pedda Golconda (పెద్ద గోల్కొండ)'
            ]
          },
          'Rajendranagar': {
            vernacular: 'రాజేంద్రనగర్',
            villages: [
              'Attapur (అత్తాపూర్)',
              'Budvel (బుద్వేల్)',
              'Himayatsagar (హిమాయత్‌సాగర్)',
              'Bandlaguda (బండ్లగూడ)',
              'Mailardevpally (మైలార్‌దేవ్‌పల్లి)'
            ]
          },
          'Maheshwaram': {
            vernacular: 'మహేశ్వరం',
            villages: [
              'Mankhal (మంఖాల్)',
              'Tukkuguda (తుక్కుగూడ)',
              'Kandukur (కందుకూరు)',
              'Mansanpally (మన్సన్‌పల్లి)',
              'Nagaram (నగరం)'
            ]
          },
          'Ibrahimpatnam': {
            vernacular: 'ఇబ్రహీంపట్నం',
            villages: [
              'Adibatla (ఆదిభట్ల)',
              'Mangalpally (మంగళపల్లి)',
              'Bongloor (బొంగులూరు)',
              'Eliminedu (ఎలిమినేడు)',
              'Khanapur (ఖానాపూర్)'
            ]
          },
          'Chevella': {
            vernacular: 'చేవెళ్ల',
            villages: [
              'Moinabad (మొయినాబాద్)',
              'Shankarpally (శంకర్‌పల్లి)',
              'Aloor (ఆలూరు)',
              'Kandawada (కందవాడ)'
            ]
          }
        }
      },
      'Medchal-Malkajgiri': {
        vernacular: 'మేడ్చల్-మల్కాజిగిరి',
        tehsils: {
          'Medchal': {
            vernacular: 'మేడ్చల్',
            villages: [
              'Kistapur (కిష్టాపూర్)',
              'Gundlapochampally (గుండ్లపోచంపల్లి)',
              'Kandlakoya (కండ్లకోయ)',
              'Pudur (పుదూరు)',
              'Raviryal (రావిర్యాల)'
            ]
          },
          'Ghatkesar': {
            vernacular: 'ఘట్‌కేసర్',
            villages: [
              'Pocharam (పోచారం)',
              'Korremula (కొర్రెముల)',
              'Yamnampet (యామ్నంపేట్)',
              'Annojiguda (అన్నోజిగూడ)',
              'Kachivani Singaram (కాచివాని సింగారం)'
            ]
          },
          'Kukatpally': {
            vernacular: 'కూకట్‌పల్లి',
            villages: [
              'Hydernagar (హైదర్‌నగర్)',
              'Allapur (అల్లాపూర్)',
              'Fateh Nagar (ఫతేనగర్)',
              'Moosapet (మూసాపేట్)'
            ]
          }
        }
      },
      'Warangal': {
        vernacular: 'వరంగల్',
        tehsils: {
          'Warangal': {
            vernacular: 'వరంగల్',
            villages: [
              'Fort Warangal (ఓరుగల్లు కోట)',
              'Mamnoor (మామ్నూర్)',
              'Bollikunta (బొల్లికుంట)',
              'Ursu (ఉర్సు)'
            ]
          },
          'Hanamkonda': {
            vernacular: 'హన్మకొండ',
            villages: [
              'Kazipet (కాజీపేట)',
              'Madikonda (మడికొండ)',
              'Hasanparthy (హసన్‌పర్తి)',
              'Bheemaram (భీమారం)'
            ]
          },
          'Narsampet': {
            vernacular: 'నర్సంపేట',
            villages: [
              'Chennaraopet (చెన్నారావుపేట)',
              'Duggondi (దుగ్గొండి)',
              'Khanapur (ఖానాపూర్)',
              'Pakhal (పాఖాల్)'
            ]
          }
        }
      }
    }
  },

  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    vernacular: 'मध्य प्रदेश',
    districts: {
      'Indore': {
        vernacular: 'इंदौर',
        tehsils: {
          'Sanwer': {
            vernacular: 'सांवेर',
            villages: [
              'Kshipra (क्षिप्रा)',
              'Dharampuri (धरमपुरी)',
              'Chandrawatiganj (चंद्रावतीगंज)',
              'Ajnod (अजनोद)',
              'Palasya (पलासिया ग्रामीण)'
            ]
          },
          'Mhow': {
            vernacular: 'महू / डॉ. आंबेडकर नगर',
            villages: [
              'Kodariya (कोदरिया)',
              'Patalpani (पातालपानी)',
              'Harsola (हरसोला)',
              'Badgonda (बड़गोंदा)',
              'Manpur (मानपुर)'
            ]
          },
          'Indore': {
            vernacular: 'इंदौर',
            villages: [
              'Bicholi Mardana (बिचोली मर्दाना)',
              'Kanadia (कनाड़िया)',
              'Lasudia (लसूडिया)',
              'Rau (राऊ)'
            ]
          }
        }
      },
      'Bhopal': {
        vernacular: 'भोपाल',
        tehsils: {
          'Huzur': {
            vernacular: 'हुजूर',
            villages: [
              'Bhauri (भौरी)',
              'Ratibad (रातीबड़)',
              'Misrod (मिसरोद)',
              'Khajuri Sadak (खजूरी सड़क)',
              'Bagli (बागली)'
            ]
          },
          'Berasia': {
            vernacular: 'बैरसिया',
            villages: [
              'Lalariya (ललारिया)',
              'Gunga (गूंगा)',
              'Nazirabad (नजीराबाद)',
              'Runaha (रुनाहा)'
            ]
          }
        }
      }
    }
  },

  'Gujarat': {
    name: 'Gujarat',
    vernacular: 'ગુજરાત',
    districts: {
      'Ahmedabad': {
        vernacular: 'અમદાવાદ',
        tehsils: {
          'Sanand': {
            vernacular: 'સાણંદ',
            villages: [
              'Changodar (ચાંગોદર)',
              'Moraiya (મોરૈયા)',
              'Nidhrad (નિધરાડ)',
              'Shela (શેલા)',
              'Telav (તેલાવ)'
            ]
          },
          'Daskroi': {
            vernacular: 'દસ્ક્રોઈ',
            villages: [
              'Bhadaj (ભાદજ)',
              'Ognaj (ઓગણજ)',
              'Kathwada (કઠવાડા)',
              'Kuha (કુહા)',
              'Lambha (લાંભા)'
            ]
          },
          'Dholka': {
            vernacular: 'ધોળકા',
            villages: [
              'Koth (કોઠ)',
              'Rupgadh (રૂપગઢ)',
              'Bhat (ભાટ)',
              'Saragwala (સારંગવાળા)'
            ]
          }
        }
      },
      'Surat': {
        vernacular: 'સુરત',
        tehsils: {
          'Olpad': {
            vernacular: 'ઓલપાડ',
            villages: [
              'Sayan (સાયણ)',
              'Karanj (કરંજ)',
              'Saras (સરસ)',
              'Kim (કીમ)',
              'Kudsad (કુદસદ)'
            ]
          },
          'Chorasi': {
            vernacular: 'ચોર્યાસી',
            villages: [
              'Dumas (ડુમસ)',
              'Bhimrad (ભીમરાડ)',
              'Gaviyar (ગવિયાર)',
              'Magdalla (મગદલ્લા)'
            ]
          }
        }
      }
    }
  },

  'Karnataka': {
    name: 'Karnataka',
    vernacular: 'ಕರ್ನಾಟಕ',
    districts: {
      'Bengaluru Urban': {
        vernacular: 'ಬೆಂಗಳೂರು ನಗರ',
        tehsils: {
          'Anekal': {
            vernacular: 'ಆನೇಕಲ್',
            villages: [
              'Sarjapura (ಸರ್ಜಾಪುರ)',
              'Attibele (ಅತ್ತಿಬೆಲೆ)',
              'Chandapura (ಚಂದಾಪುರ)',
              'Jigani (ಜಿಗಣಿ)',
              'Hebbagodi (ಹೆಬ್ಬಗೋಡಿ)'
            ]
          },
          'Bengaluru East': {
            vernacular: 'ಬೆಂಗಳೂರು ಪೂರ್ವ',
            villages: [
              'Varthur (ವರ್ತೂರು)',
              'Bidarahalli (ಬಿದರಹಳ್ಳಿ)',
              'Whitefield (ವೈಟ್‌ಫೀಲ್ಡ್)',
              'Kadugodi (ಕಾಡುಗೋಡಿ)',
              'Avalahalli (ಅವಲಹಳ್ಳಿ)'
            ]
          }
        }
      }
    }
  },

  'Punjab': {
    name: 'Punjab',
    vernacular: 'ਪੰਜਾਬ',
    districts: {
      'Ludhiana': {
        vernacular: 'ਲੁਧਿਆਣਾ',
        tehsils: {
          'Jagraon': {
            vernacular: 'ਜਗਰਾਓਂ',
            villages: [
              'Sidhwan Bet (ਸਿੱਧਵਾਂ ਬੇਟ)',
              'Dakha (ਦਾਖਾ)',
              'Mullanpur (ਮੁੱਲਾਂਪੁਰ)',
              'Swaddi Kalan (ਸਵੱਦੀ ਕਲਾਂ)',
              'Chowkiman (ਚੌਕੀਮਾਨ)'
            ]
          },
          'Ludhiana East': {
            vernacular: 'ਲੁਧਿਆਣਾ ਪੂਰਬੀ',
            villages: [
              'Sahnewal (ਸਾਹਨੇਵਾਲ)',
              'Kohara (ਕੋਹਾੜਾ)',
              'Koom Kalan (ਕੂਮ ਕਲਾਂ)',
              'Katani Kalan (ਕਟਾਣੀ ਕਲਾਂ)'
            ]
          }
        }
      }
    }
  }
};

/**
 * Normalizes state name string for robust lookup
 */
export function normalizeStateName(stateStr: string): string {
  if (!stateStr) return 'Uttar Pradesh';
  const clean = stateStr.toLowerCase();
  for (const stateKey of Object.keys(ADMINISTRATIVE_HIERARCHY)) {
    if (clean.includes(stateKey.toLowerCase()) || stateKey.toLowerCase().includes(clean)) {
      return stateKey;
    }
  }
  return 'Uttar Pradesh';
}

/**
 * Normalizes district name string for robust lookup
 */
export function normalizeDistrictName(stateName: string, districtStr: string): string {
  const normState = normalizeStateName(stateName);
  const stateData = ADMINISTRATIVE_HIERARCHY[normState];
  if (!stateData || !districtStr) return Object.keys(stateData?.districts || {})[0] || 'Lucknow';

  const clean = districtStr.toLowerCase();
  for (const distKey of Object.keys(stateData.districts)) {
    if (clean.includes(distKey.toLowerCase()) || distKey.toLowerCase().includes(clean)) {
      return distKey;
    }
  }
  return Object.keys(stateData.districts)[0] || districtStr;
}

/**
 * Normalizes tehsil name string for robust lookup
 */
export function normalizeTehsilName(stateName: string, districtName: string, tehsilStr: string): string {
  const normState = normalizeStateName(stateName);
  const normDist = normalizeDistrictName(normState, districtName);
  const distData = ADMINISTRATIVE_HIERARCHY[normState]?.districts[normDist];
  if (!distData || !tehsilStr) return Object.keys(distData?.tehsils || {})[0] || 'Mohanlalganj';

  const clean = tehsilStr.toLowerCase();
  for (const tehsilKey of Object.keys(distData.tehsils)) {
    if (clean.includes(tehsilKey.toLowerCase()) || tehsilKey.toLowerCase().includes(clean)) {
      return tehsilKey;
    }
  }
  return Object.keys(distData.tehsils)[0] || tehsilStr;
}

/**
 * Get list of available states
 */
export function getAvailableStates(): Array<{ key: string; label: string }> {
  return Object.keys(ADMINISTRATIVE_HIERARCHY).map(key => ({
    key,
    label: `${key} (${ADMINISTRATIVE_HIERARCHY[key].vernacular})`
  }));
}

/**
 * Get list of districts for a given state
 */
export function getDistrictsForState(stateName: string): Array<{ key: string; label: string }> {
  const normState = normalizeStateName(stateName);
  const stateData = ADMINISTRATIVE_HIERARCHY[normState];
  if (!stateData) return [];

  return Object.keys(stateData.districts).map(key => ({
    key,
    label: `${key} (${stateData.districts[key].vernacular})`
  }));
}

/**
 * Get list of tehsils for a given district
 */
export function getTehsilsForDistrict(stateName: string, districtName: string): Array<{ key: string; label: string }> {
  const normState = normalizeStateName(stateName);
  const normDist = normalizeDistrictName(normState, districtName);
  const distData = ADMINISTRATIVE_HIERARCHY[normState]?.districts[normDist];
  if (!distData) return [];

  return Object.keys(distData.tehsils).map(key => ({
    key,
    label: `${key} (${distData.tehsils[key].vernacular})`
  }));
}

/**
 * Get list of revenue villages for a given tehsil
 */
export function getVillagesForTehsil(stateName: string, districtName: string, tehsilName: string): string[] {
  const normState = normalizeStateName(stateName);
  const normDist = normalizeDistrictName(normState, districtName);
  const normTeh = normalizeTehsilName(normState, normDist, tehsilName);
  const tehsilData = ADMINISTRATIVE_HIERARCHY[normState]?.districts[normDist]?.tehsils[normTeh];
  if (!tehsilData) return [];

  return tehsilData.villages;
}
