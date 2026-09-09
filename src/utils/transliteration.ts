import { LanguageCode } from '../types/landRecord';

/**
 * BHOOMI-SETU AI - Intelligent Indic Transliteration & Lexicon Engine
 * Supports real-time phonetic transliteration from English Romanized script
 * to Devanagari (Hindi/Marathi), Tamil, and Telugu with extensive name lexicon.
 */

// Comprehensive Lexicon of Indian Given Names, Surnames, Titles, and Kinship terms
const NAME_LEXICON: Record<string, { hi: string; mr: string; ta: string; te: string }> = {
  // Common Given Names
  suryansh: { hi: 'सूर्यांश', mr: 'सूर्यांश', ta: 'சூர்யான்ஷ்', te: 'సూర్యాంశ' },
  mittal: { hi: 'मित्तल', mr: 'मित्तल', ta: 'மிட்டல்', te: 'మిట్టల్' },
  ramesh: { hi: 'रमेश', mr: 'रमेश', ta: 'ரமேஷ்', te: 'రమేష్' },
  chandra: { hi: 'चंद्र', mr: 'चंद्र', ta: 'சந்திரா', te: 'చంద్ర' },
  chand: { hi: 'चंद', mr: 'चंद', ta: 'சந்த்', te: 'చంద్' },
  sharma: { hi: 'शर्मा', mr: 'शर्मा', ta: 'சர்மா', te: 'శర్మ' },
  suresh: { hi: 'सुरेश', mr: 'सुरेश', ta: 'சுரேஷ்', te: 'సురేష్' },
  kumar: { hi: 'कुमार', mr: 'कुमार', ta: 'குமார்', te: 'కుమార్' },
  radheshyam: { hi: 'राधेश्याम', mr: 'राधेश्याम', ta: 'ராதேஷ்யாம்', te: 'రాధేశ్యామ్' },
  maurya: { hi: 'मौर्य', mr: 'मौर्य', ta: 'மவுரியா', te: 'మౌర్య' },
  kashi: { hi: 'काशी', mr: 'काशी', ta: 'காசி', te: 'కాశీ' },
  nath: { hi: 'नाथ', mr: 'नाथ', ta: 'நாத்', te: 'నాథ్' },
  santosh: { hi: 'संतोष', mr: 'संतोष', ta: 'சந்தோஷ்', te: 'సంతోష్' },
  bhaurao: { hi: 'भाऊराव', mr: 'भाऊराव', ta: 'பௌராவ்', te: 'భౌరావ్' },
  gaikwad: { hi: 'गायकवाड', mr: 'गायकवाड', ta: 'கைக்வாட்', te: 'గైక్వాడ్' },
  ramasamy: { hi: 'रामसामी', mr: 'रामसामी', ta: 'ராமசாமி', te: 'రామస్వామి' },
  ramaswamy: { hi: 'रामस्वामी', mr: 'रामस्वामी', ta: 'ராமசுவாமி', te: 'రామస్వామి' },
  karuppiah: { hi: 'करुप्पैया', mr: 'करुप्पैया', ta: 'கருப்பையா', te: 'కరుప్పయ్య' },
  thevar: { hi: 'थेवर', mr: 'थेवर', ta: 'தேவர்', te: 'తేవర్' },
  irfan: { hi: 'इरफ़ान', mr: 'इरफान', ta: 'இர்பான்', te: 'ఇర్ఫాన్' },
  habib: { hi: 'हबीब', mr: 'हबीब', ta: 'ஹபீப்', te: 'హబీబ్' },
  javed: { hi: 'जावेद', mr: 'जावेद', ta: 'ஜாவேத்', te: 'జావేద్' },
  habibullah: { hi: 'हबीबुल्लाह', mr: 'हबीबुल्लाह', ta: 'ஹபிபுல்லா', te: 'హబీబుల్లా' },
  late: { hi: 'स्व.', mr: 'कै.', ta: 'மறைந்த', te: 'దివంగత' },
  singh: { hi: 'सिंह', mr: 'सिंह', ta: 'சிங்', te: 'సింగ్' },
  patel: { hi: 'पटेल', mr: 'पटेल', ta: 'படேல்', te: 'పటేల్' },
  gupta: { hi: 'गुप्ता', mr: 'गुप्ता', ta: 'குப்தா', te: 'గుప్తా' },
  verma: { hi: 'वर्मा', mr: 'वर्मा', ta: 'வர்மா', te: 'వర్మ' },
  yadav: { hi: 'यादव', mr: 'यादव', ta: 'யாதவ்', te: 'యాదవ్' },
  prasad: { hi: 'प्रसाद', mr: 'प्रसाद', ta: 'பிரசாத்', te: 'ప్రసాద్' },
  devi: { hi: 'देवी', mr: 'देवी', ta: 'தேவி', te: 'దేవి' },
  kumari: { hi: 'कुमारी', mr: 'कुमारी', ta: 'குமாரி', te: 'కుమారి' },
  lal: { hi: 'लाल', mr: 'लाल', ta: 'லால்', te: 'లాల్' },
  ram: { hi: 'राम', mr: 'राम', ta: 'ராம்', te: 'రామ్' },
  shyam: { hi: 'श्याम', mr: 'श्याम', ta: 'ஷ்யாம்', te: 'శ్యామ్' },
  sundar: { hi: 'सुन्दर', mr: 'सुंदर', ta: 'சுந்தர்', te: 'సుందర్' },
  narayan: { hi: 'नारायण', mr: 'नारायण', ta: 'நாராயணன்', te: 'నారాయణ' },
  rajesh: { hi: 'राजेश', mr: 'राजेश', ta: 'ராஜேஷ்', te: 'రాజేష్' },
  amit: { hi: 'अमित', mr: 'अमित', ta: 'அமித்', te: 'అమిత్' },
  sumit: { hi: 'सुमित', mr: 'सुमित', ta: 'சுமித்', te: 'సుమిత్' },
  rohan: { hi: 'रोहन', mr: 'रोहन', ta: 'ரோகன்', te: 'రోహన్' },
  rahul: { hi: 'राहुल', mr: 'राहुल', ta: 'ராகுல்', te: 'రాహుల్' },
  deepak: { hi: 'दीपक', mr: 'दीपक', ta: 'தீபக்', te: 'దీపక్' },
  vikas: { hi: 'विकास', mr: 'विकास', ta: 'விகாஸ்', te: 'వికాస్' },
  priya: { hi: 'प्रिया', mr: 'प्रिया', ta: 'பிரியா', te: 'ప్రియా' },
  pooja: { hi: 'पूजा', mr: 'पूजा', ta: 'பூஜா', te: 'పూజా' },
  puja: { hi: 'पूजा', mr: 'पूजा', ta: 'பூஜா', te: 'పూజా' },
  anita: { hi: 'अनिता', mr: 'अनिता', ta: 'அனிதா', te: 'అనిత' },
  sunita: { hi: 'सुनीता', mr: 'सुनीता', ta: 'சுனிதா', te: 'సునీత' },
  kavita: { hi: 'कविता', mr: 'कविता', ta: 'கவிதா', te: 'కవిత' },
  geeta: { hi: 'गीता', mr: 'गीता', ta: 'கீதா', te: 'గీత' },
  gita: { hi: 'गीता', mr: 'गीता', ta: 'கீதா', te: 'గీత' },
  shinde: { hi: 'शिंदे', mr: 'शिंदे', ta: 'ஷிண்டே', te: 'షిండే' },
  pawar: { hi: 'पवार', mr: 'पवार', ta: 'பவார்', te: 'పవార్' },
  deshmukh: { hi: 'देशमुख', mr: 'देशमुख', ta: 'தேஷ்முக்', te: 'దేశ్‌ముఖ్' },
  patil: { hi: 'पाटील', mr: 'पाटील', ta: 'பாட்டீல்', te: 'పాటిల్' },
  kulkarni: { hi: 'कुलकर्णी', mr: 'कुलकर्णी', ta: 'குல்கர்னி', te: 'కుల్కర్ణి' },
  joshi: { hi: 'जोशी', mr: 'जोशी', ta: 'ஜோஷி', te: 'జోషి' },
  chavan: { hi: 'चव्हाण', mr: 'चव्हाण', ta: 'சவான்', te: 'చవాన్' },
  bhosale: { hi: 'भोसले', mr: 'भोसले', ta: 'போசலே', te: 'భోసలే' },
  jadhav: { hi: 'जाधव', mr: 'जाधव', ta: 'ஜாதவ்', te: 'జాధవ్' },
  rao: { hi: 'राव', mr: 'राव', ta: 'ராவ்', te: 'రావు' },
  reddy: { hi: 'रेड्डी', mr: 'रेड्डी', ta: 'ரெడ్డి', te: 'రెడ్డి' },
  nair: { hi: 'नायर', mr: 'नायर', ta: 'நாயர்', te: 'నాయర్' },
  menon: { hi: 'मेनन', mr: 'मेनन', ta: 'மேனன்', te: 'మీనన్' },
  murugan: { hi: 'मुरुगन', mr: 'मुरुगन', ta: 'முருகன்', te: 'మురుగన్' },
  selvam: { hi: 'सेल्वम', mr: 'सेल्वम', ta: 'செல்வம்', te: 'సెల్వం' },
  subramanian: { hi: 'सुब्रमण्यम', mr: 'सुब्रमण्यम', ta: 'சுப்பிரமணியன்', te: 'సుబ్రమణ్యం' },
  krishnan: { hi: 'कृष्णन', mr: 'कृष्णन', ta: 'கிருஷ்ணன்', te: 'కృష్ణన్' },
  venkatesh: { hi: 'वेंकटेश', mr: 'व्यंकटेश', ta: 'வெங்கடேஷ்', te: 'వెంకటేష్' },
  meena: { hi: 'मीना', mr: 'मीना', ta: 'மீனா', te: 'మీనా' },
  mishra: { hi: 'मिश्रा', mr: 'मिश्रा', ta: 'மிஸ்ரா', te: 'మిశ్రా' },
  pandey: { hi: 'पांडेय', mr: 'पांडे', ta: 'பாண்டே', te: 'పాండే' },
  dubey: { hi: 'दुबे', mr: 'दुबे', ta: 'துபே', te: 'దుబే' },
  tiwari: { hi: 'तिवारी', mr: 'तिवारी', ta: 'திவாரி', te: 'తివారి' },
  tripathi: { hi: 'त्रिपाठी', mr: 'त्रिपाठी', ta: 'திரிபாதி', te: 'త్రిపాఠి' },
  shukla: { hi: 'शुक्ला', mr: 'शुक्ला', ta: 'சுக்லா', te: 'శుక్లా' },
  bhatt: { hi: 'भट्ट', mr: 'भट्ट', ta: 'பட்', te: 'భట్' },
  thakur: { hi: 'ठाकुर', mr: 'ठाकूर', ta: 'தாகூர்', te: 'ఠాకూర్' },
  rawat: { hi: 'रावत', mr: 'रावत', ta: 'ராவத்', te: 'రావత్' },
  kapoor: { hi: 'कपूर', mr: 'कपूर', ta: 'கபூர்', te: 'కపూర్' },
  khanna: { hi: 'खन्ना', mr: 'खन्ना', ta: 'கன்னா', te: 'ఖన్నా' },
  bhatia: { hi: 'भाटिया', mr: 'भाटिया', ta: 'பாட்டியா', te: 'భాటియా' },
  mehta: { hi: 'मेहता', mr: 'मेहता', ta: 'மேத்தா', te: 'మెహతా' },
  shah: { hi: 'शाह', mr: 'शाह', ta: 'ஷா', te: 'షా' },
  modi: { hi: 'मोदी', mr: 'मोदी', ta: 'மோடி', te: 'మోడీ' },
  bose: { hi: 'बोस', mr: 'बोस', ta: 'போஸ்', te: 'బోస్' },
  mukherjee: { hi: 'मुखर्जी', mr: 'मुखर्जी', ta: 'முகர்ஜி', te: 'ముఖర్జీ' },
  banerjee: { hi: 'बनर्जी', mr: 'बॅनर्जी', ta: 'பானர்ஜி', te: 'బెనర్జీ' },
  chatterjee: { hi: 'चैटर्जी', mr: 'चॅटर्जी', ta: 'சாட்டர்ஜி', te: 'ఛటర్జీ' },
  ghosh: { hi: 'घोष', mr: 'घोष', ta: 'கோஷ்', te: 'ఘోష్' },
  dutta: { hi: 'दत्ता', mr: 'दत्ता', ta: 'தத்தா', te: 'దత్తా' },
  das: { hi: 'दास', mr: 'दास', ta: 'தாஸ்', te: 'దాస్' },
  naidu: { hi: 'नायडू', mr: 'नायडू', ta: 'நாயுடு', te: 'నాయుడు' },
  shetty: { hi: 'शेट्टी', mr: 'शेट्टी', ta: 'ஷெட்டி', te: 'శెట్టి' },
  hegde: { hi: 'हेगड़े', mr: 'हेगडे', ta: 'ஹெக்டே', te: 'హెగ్డే' },
  gowda: { hi: 'गौड़ा', mr: 'गौडा', ta: 'கௌடா', te: 'గౌడ' },
  bhat: { hi: 'भट', mr: 'भट', ta: 'பட்', te: 'భట్' },
  arora: { hi: 'अरोड़ा', mr: 'अरोरा', ta: 'அரோரா', te: 'అరోరా' },
  bansal: { hi: 'बंसल', mr: 'बन्सल', ta: 'பன்சல்', te: 'బన్సల్' },
  garg: { hi: 'गर्ग', mr: 'गर्ग', ta: 'கார்க்', te: 'గార్గ్' },
  jindal: { hi: 'जिंदल', mr: 'जिंदाल', ta: 'ஜிண்டால்', te: 'జిందాల్' },
  singhal: { hi: 'सिंघल', mr: 'सिंघल', ta: 'சிங்கால்', te: 'సింఘాల్' },
  agrawal: { hi: 'अग्रवाल', mr: 'अग्रवाल', ta: 'அகர்வால்', te: 'అగర్వాల్' },
  agarwal: { hi: 'अग्रवाल', mr: 'अग्रवाल', ta: 'அகர்வால்', te: 'అగర్వాల్' },
  goyal: { hi: 'गोयल', mr: 'गोयल', ta: 'கோயல்', te: 'గోయల్' },
  goel: { hi: 'गोयल', mr: 'गोयल', ta: 'கோயல்', te: 'గోయల్' },
  chauhan: { hi: 'चौहान', mr: 'चौव्हाण', ta: 'சவுகான்', te: 'చౌహాన్' },
  rathore: { hi: 'राठौड़', mr: 'राठोड', ta: 'ராத்தோர்', te: 'రాథోడ్' },
  rajput: { hi: 'राजपूत', mr: 'राजपूत', ta: 'ராஜ்புத்', te: 'రాజ్‌పుత్' },
  prajapati: { hi: 'प्रजापति', mr: 'प्रजापती', ta: 'பிரஜாபதி', te: 'ప్రజాపతి' },
  kashyap: { hi: 'कश्यप', mr: 'कश्यप', ta: 'காஷ்யப்', te: 'కాశ్యప్' },
  vishwakarma: { hi: 'विश्वकर्मा', mr: 'विश्वकर्मा', ta: 'விஸ்வகர்மா', te: 'విశ్వకర్మ' },
  mahesh: { hi: 'महेश', mr: 'महेश', ta: 'மகேஷ்', te: 'మహేష్' },
  dinesh: { hi: 'दिनेश', mr: 'दिनेश', ta: 'தினேஷ்', te: 'దినేష్' },
  ganesh: { hi: 'गणेश', mr: 'गणेश', ta: 'கணேஷ்', te: 'గణేష్' },
  mukesh: { hi: 'मुकेश', mr: 'मुकेश', ta: 'முகேஷ்', te: 'ముఖేష్' },
  rakesh: { hi: 'राकेश', mr: 'राकेश', ta: 'ராகேஷ்', te: 'రాకేష్' },
  pankaj: { hi: 'पंकज', mr: 'पंकज', ta: 'பங்கஜ்', te: 'పంకజ్' },
  neeraj: { hi: 'नीरज', mr: 'नीरज', ta: 'நீரஜ்', te: 'నీరజ్' },
  niraj: { hi: 'नीरज', mr: 'नीरज', ta: 'நீரஜ்', te: 'నీరజ్' },
  manoj: { hi: 'मनोज', mr: 'मनोज', ta: 'மனோஜ்', te: 'మనోజ్' },
  anil: { hi: 'अनिल', mr: 'अनिल', ta: 'அனில்', te: 'అనిల్' },
  sunil: { hi: 'सुनील', mr: 'सुनील', ta: 'சுனில்', te: 'సునీల్' },
  kapil: { hi: 'कपिल', mr: 'कपिल', ta: 'கபில்', te: 'కపిల్' },
  rohit: { hi: 'रोहित', mr: 'रोहित', ta: 'ரோஹித்', te: 'రోహిత్' },
  mohit: { hi: 'मोहित', mr: 'मोहित', ta: 'மோஹித்', te: 'మోహిత్' },
  ajit: { hi: 'अजीत', mr: 'अजित', ta: 'அஜித்', te: 'అజిత్' },
  ranjit: { hi: 'रणजीत', mr: 'रणजित', ta: 'ரஞ்சித்', te: 'రంజిత్' },
  akash: { hi: 'आकाश', mr: 'आकाश', ta: 'ஆகாஷ்', te: 'ఆకాష్' },
  prakash: { hi: 'प्रकाश', mr: 'प्रकाश', ta: 'பிரகாஷ்', te: 'ప్రకాష్' },
  subhash: { hi: 'सुभाष', mr: 'सुभाष', ta: 'சுபாஷ்', te: 'సుభాష్' },
  kailash: { hi: 'कैलाश', mr: 'कैलास', ta: 'கைலாஷ்', te: 'కైలాష్' },
  avinash: { hi: 'अविनाश', mr: 'अविनाश', ta: 'அவினாஷ்', te: 'అవినాష్' },
  ashok: { hi: 'अशोक', mr: 'अशोक', ta: 'அசோக்', te: 'అశోక్' },
  alok: { hi: 'आलोक', mr: 'आलोक', ta: 'ஆலோக்', te: 'ఆలోక్' },
  vinod: { hi: 'विनोद', mr: 'विनोद', ta: 'வினோத்', te: 'వినోద్' },
  pramod: { hi: 'प्रमोद', mr: 'प्रमोद', ta: 'பிரமோத்', te: 'ప్రమోద్' },
  jagdish: { hi: 'जगदीश', mr: 'जगदीश', ta: 'ஜெகதீஷ்', te: 'జగదీష్' },
  satish: { hi: 'सतीश', mr: 'सतीश', ta: 'சதீஷ்', te: 'సతీష్' },
  harish: { hi: 'हरीश', mr: 'हरीश', ta: 'ஹரிஷ்', te: 'హరీష్' },
  girish: { hi: 'गिरीश', mr: 'गिरीश', ta: 'கிரிஷ்', te: 'గిరీష్' },
  kamlesh: { hi: 'कमलेश', mr: 'कमलेश', ta: 'கமலேஷ்', te: 'కమలేష్' },
  brijesh: { hi: 'बृजेश', mr: 'बृजेश', ta: 'பிரிஜேஷ்', te: 'బ్రిజేష్' },
  umesh: { hi: 'उमेश', mr: 'उमेश', ta: 'உமேஷ்', te: 'ఉమేష్' },
  vijay: { hi: 'विजय', mr: 'विजय', ta: 'விஜய்', te: 'విజయ్' },
  ajay: { hi: 'अजय', mr: 'अजय', ta: 'அஜய்', te: 'అజయ్' },
  sanjay: { hi: 'संजय', mr: 'संजय', ta: 'சஞ்சய்', te: 'సంజయ్' },
  abhishek: { hi: 'अभिषेक', mr: 'अभिषेक', ta: 'அபிஷேக்', te: 'అభిషేక్' },
  anand: { hi: 'आनंद', mr: 'आनंद', ta: 'ஆனந்த்', te: 'ఆనంద్' },
  ashish: { hi: 'आशीष', mr: 'आशिष', ta: 'ஆஷிஷ்', te: 'ఆశిష్' },
  manish: { hi: 'मनीष', mr: 'मनिष', ta: 'மனிஷ்', te: 'మనీష్' },
  sandeep: { hi: 'संदीप', mr: 'संदीप', ta: 'சந்தீப்', te: 'సందీప్' },
  pradeep: { hi: 'प्रदीप', mr: 'प्रदीप', ta: 'பிரதீப்', te: 'ప్రదీప్' },
  gaurav: { hi: 'गौरव', mr: 'गौरव', ta: 'கௌரவ்', te: 'గౌరవ్' },
  saurabh: { hi: 'सौरभ', mr: 'सौरभ', ta: 'சௌரப்', te: 'సౌరభ్' },
  vaibhav: { hi: 'वैभव', mr: 'वैभव', ta: 'வைபவ்', te: 'వైభవ్' },
  keshav: { hi: 'केशव', mr: 'केशव', ta: 'கேசவ்', te: 'కేశవ్' },
  madhav: { hi: 'माधव', mr: 'माधव', ta: 'மாதவ்', te: 'మాధవ్' },
  raghav: { hi: 'राघव', mr: 'राघव', ta: 'ராகவ்', te: 'రాఘవ్' },
  siddharth: { hi: 'सिद्धार्थ', mr: 'सिद्धार्थ', ta: 'சித்தார்த்', te: 'సిద్ధార్థ్' },
  harsh: { hi: 'हर्ष', mr: 'हर्ष', ta: 'ஹர்ஷ்', te: 'హర్ష్' },
  yash: { hi: 'यश', mr: 'यश', ta: 'யஷ்', te: 'యష్' },
  ayush: { hi: 'आयुष', mr: 'आयुष', ta: 'ஆயுஷ்', te: 'ఆయుష్' },
  shubham: { hi: 'शुभम', mr: 'शुभम', ta: 'சுபம்', te: 'శుభమ్' },
  shivam: { hi: 'शिवम', mr: 'शिवम', ta: 'சிவம்', te: 'శివమ్' },
  satyam: { hi: 'सत्यम', mr: 'सत्यम', ta: 'சத்யம்', te: 'సత్యం' },
  arun: { hi: 'अरुण', mr: 'अरुण', ta: 'அருண்', te: 'అరుణ్' },
  varun: { hi: 'वरुण', mr: 'वरुण', ta: 'வருண்', te: 'వరుణ్' },
  tarun: { hi: 'तरुण', mr: 'तरुण', ta: 'தருண்', te: 'తరుణ్' },
  karan: { hi: 'करण', mr: 'करण', ta: 'கரண்', te: 'కరణ్' },
  naveen: { hi: 'नवीन', mr: 'नवीन', ta: 'நவீன்', te: 'నవీన్' },
  navin: { hi: 'नवीन', mr: 'नवीन', ta: 'நவீன்', te: 'నవీన్' },
  praveen: { hi: 'प्रवीण', mr: 'प्रवीण', ta: 'பிரவீன்', te: 'ప్రవీణ్' },
  pravin: { hi: 'प्रवीण', mr: 'प्रवीण', ta: 'பிரவீன்', te: 'ప్రవీణ్' },
  sachin: { hi: 'सचिन', mr: 'सचिन', ta: 'சச்சின்', te: 'సచిన్' },
  neha: { hi: 'नेहा', mr: 'नेहा', ta: 'நேஹா', te: 'నేహా' },
  sneha: { hi: 'स्नेहा', mr: 'स्नेहा', ta: 'ஸ்நேகா', te: 'స్నేహ' },
  swati: { hi: 'स्वाति', mr: 'स्वाती', ta: 'சுவாதி', te: 'స్వాతి' },
  jyoti: { hi: 'ज्योति', mr: 'ज्योती', ta: 'ஜோதி', te: 'జ్యోతి' },
  kiran: { hi: 'किरण', mr: 'किरण', ta: 'கிரண்', te: 'కిరణ్' },
  suman: { hi: 'सुमन', mr: 'सुमन', ta: 'சுமன்', te: 'సుమన్' },
  rekha: { hi: 'रेखा', mr: 'रेखा', ta: 'ரேகா', te: 'రేఖ' },
  usha: { hi: 'उषा', mr: 'उषा', ta: 'உஷா', te: 'ఉష' },
  asha: { hi: 'आशा', mr: 'आशा', ta: 'ஆஷா', te: 'ఆశ' },
  lakshmi: { hi: 'लक्ष्मी', mr: 'लक्ष्मी', ta: 'லட்சுமி', te: 'లక్ష్మి' },
  laxmi: { hi: 'लक्ष्मी', mr: 'लक्ष्मी', ta: 'லட்சுமி', te: 'లక్ష్మి' },
  durga: { hi: 'दुर्गा', mr: 'दुर्गा', ta: 'துர்கா', te: 'దుర్గ' },
  and: { hi: 'व', mr: 'आणि', ta: 'மற்றும்', te: 'మరియు' },
  '&': { hi: 'व', mr: 'आणि', ta: 'மற்றும்', te: 'మరియు' },
  's/o': { hi: 'आत्मज', mr: 'मुलगा', ta: 'மகன்', te: 'కుమారుడు' },
  'd/o': { hi: 'आत्मजा', mr: 'मुलगी', ta: 'மகள்', te: 'కుమార్తె' },
  'w/o': { hi: 'पत्नी', mr: 'पत्नी', ta: 'மனைவி', te: 'భార్య' },
  'c/o': { hi: 'मार्फत', mr: 'मार्फत', ta: 'பராமரிப்பில்', te: 'ద్వారా' }
};

// Character & Digraph Phonetic Mapping for Devanagari (Hindi/Marathi)
const DEVANAGARI_CONSONANTS: Record<string, string> = {
  k: 'क', kh: 'ख', g: 'ग', gh: 'घ', ng: 'ङ',
  ch: 'च', chh: 'छ', j: 'ज', jh: 'झ', ny: 'ञ',
  t: 'त', th: 'थ', d: 'द', dh: 'ध', n: 'न',
  p: 'प', ph: 'फ', f: 'फ़', b: 'ब', bh: 'भ', m: 'म',
  y: 'य', r: 'र', l: 'ल', v: 'व', w: 'व',
  sh: 'श', shh: 'ष', s: 'स', h: 'ह',
  ksh: 'क्ष', tr: 'त्र', gy: 'ज्ञ', dny: 'ज्ञ',
  z: 'ज़', q: 'क़', x: 'क्स'
};

const DEVANAGARI_INDEPENDENT_VOWELS: Record<string, string> = {
  aa: 'आ', a: 'अ', ee: 'ई', ii: 'ई', i: 'इ',
  oo: 'ऊ', uu: 'ऊ', u: 'उ',
  ai: 'ऐ', e: 'ए',
  au: 'औ', ou: 'औ', o: 'ओ',
  ri: 'ऋ', ru: 'ऋ'
};

const DEVANAGARI_MATRAS: Record<string, string> = {
  aa: 'ा', a: '', ee: 'ी', ii: 'ी', i: 'ि',
  oo: 'ू', uu: 'ू', u: 'ु',
  ai: 'ै', e: 'े',
  au: 'ौ', ou: 'ौ', o: 'ो',
  ri: 'ृ', ru: 'ृ'
};

const HALANT_DEV = '्';

// Phonetic fallback rule engine for Devanagari
function transliterateWordDevanagari(word: string): string {
  const lower = word.toLowerCase();
  let result = '';
  let i = 0;

  while (i < lower.length) {
    // Check initial vowel
    if (i === 0) {
      let matchedVowel = false;
      for (const v of ['aa', 'ee', 'ii', 'oo', 'uu', 'ai', 'au', 'ou', 'ri', 'ru', 'a', 'i', 'u', 'e', 'o']) {
        if (lower.startsWith(v, i)) {
          result += DEVANAGARI_INDEPENDENT_VOWELS[v] || '';
          i += v.length;
          matchedVowel = true;
          break;
        }
      }
      if (matchedVowel) continue;
    }

    // Special handling for trailing / internal 'n' before consonants (Anusvara)
    if ((lower[i] === 'n' || lower[i] === 'm') && i > 0 && i < lower.length - 1) {
      const nextChar = lower[i + 1];
      if (['s', 'sh', 'h', 'k', 'g', 'c', 'j', 't', 'd', 'p', 'b', 'y', 'r', 'v', 'w'].includes(nextChar)) {
        result += 'ं';
        i++;
        continue;
      }
    }

    // Double consonant detection (e.g. 'tt' in Mittal -> 'त्त', 'kk' -> 'क्क')
    if (i + 1 < lower.length && lower[i] === lower[i + 1] && DEVANAGARI_CONSONANTS[lower[i]]) {
      const cons = DEVANAGARI_CONSONANTS[lower[i]];
      result += cons + HALANT_DEV + cons;
      i += 2;
      // Check for following vowel
      let matchedVowel = false;
      for (const v of ['aa', 'ee', 'ii', 'oo', 'uu', 'ai', 'au', 'ou', 'ri', 'ru', 'a', 'i', 'u', 'e', 'o']) {
        if (lower.startsWith(v, i)) {
          result += DEVANAGARI_MATRAS[v] || '';
          i += v.length;
          matchedVowel = true;
          break;
        }
      }
      continue;
    }

    // Match longest consonant digraph / trigraph
    let matchedConsonant = false;
    for (const c of ['ksh', 'dny', 'chh', 'shh', 'gy', 'tr', 'kh', 'gh', 'ng', 'ch', 'jh', 'ny', 'th', 'dh', 'ph', 'bh', 'sh', 'k', 'g', 'j', 't', 'd', 'n', 'p', 'f', 'b', 'm', 'y', 'r', 'l', 'v', 'w', 's', 'h', 'z', 'q', 'x']) {
      if (lower.startsWith(c, i)) {
        const cons = DEVANAGARI_CONSONANTS[c] || c;
        result += cons;
        i += c.length;
        matchedConsonant = true;

        // Check if vowel follows this consonant
        let matchedMatra = false;
        for (const v of ['aa', 'ee', 'ii', 'oo', 'uu', 'ai', 'au', 'ou', 'ri', 'ru', 'a', 'i', 'u', 'e', 'o']) {
          if (lower.startsWith(v, i)) {
            result += DEVANAGARI_MATRAS[v] || '';
            i += v.length;
            matchedMatra = true;
            break;
          }
        }

        // If no vowel follows and not at word end, add halant for consonant conjuncts (e.g. 'sh' + 'y' -> 'श्य')
        if (!matchedMatra && i < lower.length) {
          const nextTwo = lower.slice(i, i + 2);
          const nextOne = lower[i];
          if (
            ['k', 'g', 'c', 'j', 't', 'd', 'n', 'p', 'b', 'm', 'y', 'r', 'l', 'v', 'w', 's', 'h', 'z'].includes(nextOne) ||
            ['sh', 'kh', 'gh', 'ch', 'jh', 'th', 'dh', 'ph', 'bh'].includes(nextTwo)
          ) {
            result += HALANT_DEV;
          }
        }
        break;
      }
    }

    if (!matchedConsonant) {
      // Non-consonant / punctuation / numbers / unknown
      result += word[i];
      i++;
    }
  }

  return result;
}

/**
 * Determine script from target language code or state name
 */
export function getScriptForStateOrLanguage(language?: LanguageCode | string, state?: string): 'hi' | 'mr' | 'ta' | 'te' {
  if (language === 'ta') return 'ta';
  if (language === 'te') return 'te';
  if (language === 'mr') return 'mr';
  if (language === 'hi') return 'hi';

  if (state) {
    const s = state.toLowerCase();
    if (s.includes('tamil')) return 'ta';
    if (s.includes('telangana') || s.includes('andhra')) return 'te';
    if (s.includes('maharashtra')) return 'mr';
  }

  return 'hi'; // Default to Hindi Devanagari
}

/**
 * Transliterate single or multi-word English text into target Indic vernacular script
 * Uses full dictionary match where available, and phonetic rule-based synthesis for arbitrary inputs.
 */
export function transliterateEnglishToVernacular(
  text: string,
  targetLangOrScript: 'hi' | 'mr' | 'ta' | 'te' | LanguageCode | string = 'hi'
): string {
  if (!text || !text.trim()) return '';

  const scriptKey = (
    ['hi', 'mr', 'ta', 'te'].includes(targetLangOrScript)
      ? targetLangOrScript
      : getScriptForStateOrLanguage(targetLangOrScript)
  ) as 'hi' | 'mr' | 'ta' | 'te';

  // Split by whitespace and punctuation while keeping delimiters
  const tokens = text.split(/(\s+|[.,/\\()&+-])/);

  return tokens
    .map((token) => {
      if (!token || /^\s+$/.test(token) || /^[0-9.,/\\()&+-]+$/.test(token)) {
        return token;
      }

      const clean = token.toLowerCase().replace(/[^a-z0-9&/]/g, '');

      // 1. Direct Lexicon Match
      if (NAME_LEXICON[clean] && NAME_LEXICON[clean][scriptKey]) {
        return NAME_LEXICON[clean][scriptKey];
      }

      // 2. Rule-based Devanagari transliteration
      if (scriptKey === 'hi' || scriptKey === 'mr') {
        return transliterateWordDevanagari(token);
      }

      // 3. Fallback for Tamil/Telugu if not in lexicon: Devanagari base or original token
      return transliterateWordDevanagari(token);
    })
    .join('');
}
