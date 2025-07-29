import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const medicaments = [
  { id: '1', nom: 'Paracétamol 500mg', prix: '300', image: 'https://www.pharma-gdd.com/media/cache/resolve/product_show/766961747269732d70617261636574616d6f6c2d312d382d636f6d7072696d65732d6661636514a75b9f.jpg', description: 'Antalgique, antipyrétique.' },
  { id: '2', nom: 'Doliprane 1000mg', prix: '700', image: 'https://www.mon-pharmacien-conseil.com/10838-large_default/doliprane-1000mg-adulte-boite-de-8cps.jpg', description :'Antalgique , antipyretique.' },
  { id: '3', nom: 'Ibuprofène 400mg', prix: '500', image: 'https://www.pharma-gdd.com/media/cache/resolve/product_thumbnail/766961747275732d69627570726f66656e652d3430306d672d31322d636f6d7072696d65732d6661636568a21cc8.jpg', description: 'Anti-inflammatoire.' },
  { id: '4', nom: 'Amoxicilline 500mg', prix: '1200', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTusF3zJsGIPVBGnFXI04iJqFRn2ShrxtwhFQ&s', description: 'Antibiotique.' },
  { id: '5', nom: 'Augmentin', prix: '1500', image: 'https://www.informationhospitaliere.com/wp-content/uploads/2022/01/Augmentin_1_g_tbl-scaled-e1641686675930.jpg', description: 'Antibiotique large spectre.' },
  { id: '6', nom: 'Smecta', prix: '800 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk3uHZQZar0Luk7IEBGHtK8gp3jgYf9BpvYw&s', description: 'Diarrhée.' },
  { id: '7', nom: 'Gaviscon', prix: '900 ', image: 'https://www.ubuy.ci/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvNDF0T3U2VHcyYkwuX1NTNDAwXy5qcGc.jpg', description: 'Brûlures d’estomac.' },
  { id: '8', nom: 'Spasfon', prix: '700 ', image: 'https://www.pharmanity.com/assets/img/parapharmacie/spasfon-30-comprimes-enrobes-i15.jpg', description: 'Antispasmodique.' },
  { id: '9', nom: 'Ventoline inhalateur', prix: '2500 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTypAXpraGGSKCFgk9llXmMYWWBbMOkizdJrQ&s', description: 'Asthme.' },
  { id: '10', nom: 'Prednisone', prix: '1000 ', image: 'https://cdn.pim.mesoigner.fr/mesoigner/f54dab850a3067d50feb3e63649bc22c/mesoigner-thumbnail-1000-1000-inset/645/363/prednisolone-eg-20-mg-comprime-orodispersible.webp', description: 'Corticoïde.' },
  { id: '11', nom: 'Metformine', prix: '800 ', image: 'https://cdn.pim.mesoigner.fr/mesoigner/0b3a01a2d8c6c1c12b5c95d39a6d8baf/mesoigner-thumbnail-300-300-inset/341/627/metformine-eg-1000-mg-comprime-pellicule-secable.webp', description: 'Diabète type?II.' },
  { id: '12', nom: 'Simvastatine', prix: '1200 ', image: 'https://cdn.pim.mesoigner.fr/mesoigner/84d2e96aa066286e18ebbccca4bfbabc/mesoigner-thumbnail-1000-1000-inset/142/363/simvastatine-eg-10-mg-comprime-pellicule-secable.webp', description: 'Cholestérol.' },
  { id: '13', nom: 'Oméprazole', prix: '600 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAwHwm5oueMJAyvYrkxBbsaMLhvuRwppFPMg&s', description: 'Ul-cères, reflux.' },
  { id: '14', nom: 'Aspirine 100mg', prix: '400 ', image: 'https://www.pharmanity.com/assets/img/parapharmacie/aspirine-upsa-500-mg-20-comprimes-effervescents-i518.jpg', description: 'Anti-agrégant.' },
  { id: '15', nom: 'Ciprofloxacine', prix: '1100 ', image: 'https://new.dafrapharma.com/wp-content/uploads/2021/08/3CIP5AFRLR.jpg', description: 'Antibiotique.' },
  { id: '16', nom: 'Clarithromycine', prix: '1300 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZJfLS4gnPyac6Mnf8Zoq-bPPghrolhakdZg&s', description: 'Antibiotique.' },
  { id: '17', nom: 'Azithromycine', prix: '1400 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy4PPDSItm5ZbbIpwsEePgIzbmQ5WSrgmffw&s', description: 'Antibiotique.' },
  { id: '18', nom: 'Lorazépam', prix: '900 ', image: 'https://cdn.pim.mesoigner.fr/mesoigner/4c9e0f03b78cd6fdea9255d34ca00a4b/mesoigner-thumbnail-300-300-inset/648/954/lorazepam-mylan-1-mg-comprime-pellicule-secable.webp', description: 'Anxiolytique.' },
  { id: '19', nom: 'Diazépam', prix: '800 ', image: 'https://benu.be/cdn/shop/files/aee79b57d427958f0df35bc101ba178a.jpg?v=1726115885', description: 'Anxiolytique.' },
  { id: '20', nom: 'Metoprolol', prix: '1000 ', image: 'https://img500.exportersindia.com/product_images/bc-500/2022/9/2351162/metoprolol-er-50-mg-tablet-1663313616-6542039.jpeg', description: 'Hypertension.' },
  { id: '21', nom: 'Lisinopril', prix: '900 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw4f_HdtFCUKx6HB-inN7zN3PLyOTBHzLh4w&s', description: 'Hypertension.' },
  { id: '22', nom: 'Amlodipine', prix: '950 ', image: 'https://famedixpharmacy.com/cdn/shop/files/images-_20.jpg?v=1725611785', description: 'Hypertension.' },
  { id: '23', nom: 'Furosemide', prix: '850 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4CwLcrN3LaORqI9WcRYWFvEUJIPVbgjIg2g&s', description: 'Diurétique.' },
  { id: '24', nom: 'Levothyrox', prix: '1000 ', image: 'https://images.lasante.net/26852-109075-thickbox.webp', description: 'Hypothyroïdie.' },
  { id: '25', nom: 'Doliprane sirop', prix: '500 ', image: 'https://www.pharmaguinee.com/265-large_default/doliprane-24-ss-fl-100ml-sirop.jpg', description: 'Douleurs enfants.' },
  { id: '26', nom: 'Nurofen', prix: '600 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr9I5Q6rp6tAtpFfCYoAKb6B99ATJ7ZzLsJg&s', description: 'Douleurs, fièvre.' },
  { id: '27', nom: 'Fenistil', prix: '700 ', image: 'https://m.media-amazon.com/images/I/61f947Jwo0L._AC_SL1000_.jpg', description: 'Allergie cutanée.' },
  { id: '28', nom: 'Ventolin poudre', prix: '2300 ', image: 'https://res.cloudinary.com/zava-www-uk/image/upload/a_exif,f_auto,e_sharpen:100,c_fit,w_800,h_600,fl_lossy/v1669997033/fr/services-setup/asthme/ventilastin/wqvswo38n2lskifnkk5k.png', description: 'Asthme.' },
  { id: '29', nom: 'Allopurinol', prix: '1100 ', image: 'https://cdn.pim.mesoigner.fr/mesoigner/e1ac5cb87f0a61bf5a0511a2fd5a6b2c/mesoigner-thumbnail-1000-1000-inset/906/684/allopurinol-biogaran-100-mg-comprime.webp', description: 'Goutte.' },
  { id: '30', nom: 'Diclofénac', prix: '800 ', image: 'https://m.media-amazon.com/images/I/71GJFGgaMzL._AC_SL1500_.jpg', description: 'Anti-inflammatoire.' },
  { id: '31', nom: 'Loratadine', prix: '700 ',image: 'https://www.pharma-gdd.com/media/cache/resolve/product_show/766961747269732d6c6f7261746164696e652d616c6c6572676965732d31306d672d372d636f6d7072696d65732d66616365cdbb72e9.jpg', description: 'Allergie.' },
  { id: '32', nom: 'Cetirizine', prix: '650 ', image: 'https://www.pharmaciedesteinfort.com/media/catalog/product/cache/e34e4c303aca0a6b6a6aff8f2907f7d5/c/e/cetirizine-eg-10mg-20cpr-0000.jpg', description: 'Allergie.' },
  { id: '33', nom: 'Nystatine', prix: '500 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL23zWbPgk2X7nBqtDYSF08HCzJfGFYEGAJw&s', description: 'Candidose.' },
  { id: '34', nom: 'Métronidazole', prix: '700 ', image: 'https://exphar.com/wp-content/uploads/2021/02/Metronidazole_Suspension_boite-left-website.jpg', description: 'Antibiotique gastro.' },
  { id: '35', nom: 'Salbutamol sirop', prix: '900 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkXKXzpn99JJBwukjgI6MAS4Kc9tYHvdsl-w&s', description: 'Toux asthme.' },
  { id: '36', nom: 'Toplexil', prix: '750 ', image: 'https://www.pharmaguinee.com/189-home_default/toplexil-sirop.jpg', description: 'Toux.' },
  { id: '37', nom: 'Upsa Toplexil', prix: '750 ', image: 'https://www.pharma-gdd.com/media/cache/resolve/product_thumbnail/33642d636172626f2d666c61636f6e2d3230302d6d6cf51cd7d6.jpg', description: 'Toux.' },
  { id: '38', nom: 'Corgard', prix: '1000 ', image: 'https://cdn.pim.mesoigner.fr/mesoigner/43ecff5a7b76a68b3272447b72473a2c/mesoigner-thumbnail-1000-1000-inset/210/233/corgard-80-mg-comprime-secable.webp', description: 'Hypertension.' },
  { id: '39', nom: 'Jadelle (implants)', prix: '25000', image: 'https://dkt-rdc.org/wp-content/uploads/2021/06/jadelle.png', description: 'Contraception.' },
  { id: '40', nom: 'Microlut', prix: '1200', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFHiEwTb4OeprzQp3wqkQUO6YQk8mkrDBDvA&s', description: 'Contraception.' },
  { id: '41', nom: 'Pilule du lendemain', prix: '1500', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkC1zBcAuKFid98-sZHJWwYwmrfs-NUX-GSg&s', description: 'Urgence contraception.' },
  { id: '42', nom: 'Diazepam suppositoires', prix: '900', image: 'https://cdn.pim.mesoigner.fr/mesoigner/4223045275a7b8e27d65dbe364a7ca53/mesoigner-thumbnail-1000-1000-inset/843/023/diazepam-teva-5-mg-comprime.webp', description: 'Crises, anxiété.' },
  { id: '43', nom: 'Insuline', prix: '5000', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKmlqmKd15VnrXM3tfMdI948iTQ7ZA7Z6SOQ&s', description: 'Diabète type?I.' },
  { id: '44', nom: 'Ventoline sirop', prix: '2000 ', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ4Lqci8qNDshRLR8o-mZDjrxB5t3AJvweoQ&s', description: 'Toux asthme.' },
  { id: '45', nom: 'Erythromycine', prix: '1200', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtVldRcVE94CypdLrWAGYGrK3O0uruaduinA&s', description: 'Antibiotique.' },
  { id: '46', nom: 'Ceftriaxone', prix: '2000', image: 'https://cdn.pim.mesoigner.fr/mesoigner/fec44084c73eaa1110e9701b18ba4fcc/mesoigner-thumbnail-1000-1000-inset/330/435/ceftriaxone-eg-1-g-3-5-ml-poudre-et-solvant-pour-solution-injectable-im.webp', description: 'Antibiotique injectable.' },
  { id: '47', nom: 'Diclofenac gel', prix: '700', image: 'https://cdn.pim.mesoigner.fr/mesoigner/6673380c57ade5bd913617f0f1208da2/mesoigner-thumbnail-1000-1000-inset/421/485/100/diclofenac-eg-50-mg-comprime-gastro-resistant.webp', description: 'Douleurs articulaires.' },
  { id: '48', nom: 'Voltaren gel', prix: '900', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Ju_478I4-tDbc1Yo3GnOqV7XxG0wWunhOQ&s', description: 'Douleurs articulaires.' },
  { id: '49', nom: 'Calcium + Vitamine D', prix: '1100', image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cen/cen27523/y/32.jpg', description: 'Ostéoporose.' },
  { id: '50', nom: 'Vitamine C 1000mg', prix: '600', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpbsCkml2CABkPiA65tKIwyBWghaP20EsMcw&s', description: 'Immunité.' },
  { id: '51', nom: 'Zinc', prix: '600', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi6TxCFK8LnsTWrTz2RaUNFyFryT-rkbhYZA&s', description: 'Carence en zinc.' },
  { id: '52', nom: 'Paracétamol sirop bébé', prix: '400', image: 'https://openmoise.ci/web/image/product.template/80973/image_1024?unique=834c2aa', description: 'Douleurs enfants.' },
  { id: '53', nom: 'Tetracycline', prix: '1300', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHU-w7ncXKA2wTkJufanTVt4ap7A4F_cQjdg&s', description: 'Antibiotique.' },
  { id: '54', nom: 'Chloramphénicol', prix: '1100', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfmFf4tYlZVtTeBx-xSUfa-6zc6lEHsF5O9Q&s', description: 'Antibiotique.' },
  { id: '55', nom: 'Hydrocortisone crème', prix: '900', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbV8hwo_OE6sZ1OIZytyXUtPO8WP0PQZjT5A&s', description: 'Inflammation cutanée.' },
  { id: '56', nom: 'Salbutamol comprimés', prix: '900', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9RtUngqbd05TacwZblE00RUUXb3a6KFX0Mg&s', description: 'Asthme.' },
  { id: '57', nom: 'Aspirine adulte', prix: '400', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8imXJ_aRIBfC0_SlYwsMLB1GBXm8rSey2-A&s', description: 'Douleurs, anticoagulant.' },
  { id: '58', nom: 'Fexofenadine', prix: '700', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhuGVHkW0AxOVXVvHQuFYEFf3WnLnOMvsaHg&s', description: 'Allergies.' },
  { id: '59', nom: 'Naproxène', prix: '800', image: 'https://images.openfoodfacts.org/images/products/340/094/997/4153/front_fr.3.full.jpg', description: 'Anti-inflammatoire.' },
  { id: '60', nom: 'Bétaméthasone', prix: '1000', image: 'https://thecarepharmacy.com/wp-content/uploads/2023/08/4-scaled.webp', description: 'Corticoïde.' },
  { id: '61', nom: 'Metoclopramide', prix: '750', image: 'https://thecarepharmacy.com/wp-content/uploads/2023/08/60.webp', description: 'Nausées, vomissements.' },
  { id: '62', nom: 'Lorazepam', prix: '900', image: 'https://www.informationhospitaliere.com/wp-content/uploads/2023/06/Lorazepam.jpg', description: 'Anxiolytique.' },
  { id: '63', nom: 'Diazepam injectable', prix: '900', image: 'https://simv-production.s3.fr-par.scw.cloud/products/66991b2f3930b-Diazepam-TVM-66991b2f49b1c.png', description: 'Crises d’épilepsie.' },
  { id: '64', nom: 'Morphine', prix: '5000', image: 'https://www.lavoisier.com/wp-content/uploads/2021/11/chlorhydrate-de-morphine-ampoule-verre-lavoisier.jpg', description: 'Douleur intense.' },
  { id: '65', nom: 'Paracétamol effervescent', prix: '500', image: 'https://www.upsa-nosproduits.com/sites/default/files/styles/produit/public/pack_3d_efferalgan_vit_c_eff_otc_12-2022_0.png?itok=sQnyLy-z', description: 'Douleurs et fièvre.' },
  { id: '66', nom: 'Bicarbonate de sodium', prix: '300', image: 'https://zaity.ci/wp-content/uploads/2020/10/bicarbonate.png', description: 'Brûlures d’estomac.' },
  { id: '67', nom: 'Amoxicilline + acide clavulanique', prix: '1600', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQohcMGG2V4TVkFHwrkaE5sGZcegeAQvUf3rA&s', description: 'Antibiotique large spectre.' },
  { id: '68', nom: 'Méfloquine', prix: '2500', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLmJ0MyGY6SyNI7Xl5OLmcMQcpiI9sF3X2yw&s', description: 'Paludisme.' },
  { id: '69', nom: 'Quinine', prix: '1500', image: 'https://static.sweetcare.com/img/prd/488/v-638784136101543669/klorane-000299kl_02.webp', description: 'Paludisme.' },
  { id: '70', nom: 'Loperamide', prix: '600', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKONBpjod8Z_ViJ3c7z58bk_QJi7CnLZ2fCA&s', description: 'Diarrhée.' },
  { id: '71', nom: 'Metronidazole gel', prix: '800', image: 'https://exphar.ci/wp-content/uploads/sites/5/2021/02/Metronidazole_Comprimes-Boite-.jpg', description: 'Infections vaginales.' },
  { id: '72', nom: 'Clotrimazole crème', prix: '900', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsrOLcpvLEaVIM0WVZFJvDOag3qNYscaU5XQ&s', description: 'Mycoses cutanées.' },
  { id: '73', nom: 'Epinéphrine', prix: '3000', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDV9NM9wejnAjU-AYhcGOW6kpFbjT58wTQbQ&s', description: 'Choc anaphylactique.' },
  { id: '74', nom: 'Hydroxyzine', prix: '800', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_JTOo6xRHTtjb1kGBmIqOx7HxLfInATuWRVvQWR9JwJBzXB2hcN_txdGOkb1PpJH9CJk&usqp=CAU', description: 'Allergies, anxiété.' },
  { id: '75', nom: 'Ranitidine', prix: '700', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIaVlRkdHCX1DfZ_UVMg-qBY2KpC_gedjHKA&s', description: 'Reflux gastrique.' },
  { id: '76', nom: 'Salbutamol inhalateur', prix: '2200', image: 'https://fr.everyone.org/media/catalog/product/cache/d4f2089fdd8c2cd44985732974e8ad33/s/c/screenshot_2024-06-24_at_10.44.38.png', description: 'Asthme.' },
  { id: '77', nom: 'Amitriptyline', prix: '1000', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTL04CYhpoNV_gsGR4hpeWX7f_j3WzPEtKkQ&s', description: 'Dépression.' },
  { id: '78', nom: 'Doxycycline', prix: '1300', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7g7GWjLCStxCa55mPzXvbLS6JDneZjgvlrA&s', description: 'Antibiotique.' },
  { id: '79', nom: 'Rifampicine', prix: '2000', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-KrML55eV5eySAu12gO1ovqKwk0kBTpLBFw&s', description: 'Tuberculose.' },
  { id: '80', nom: 'Isoniazide', prix: '1800', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_KjG3ZdRYckW1J5KM5dQMNtJmtD0nO08ePA&s', description: 'Tuberculose.' },
  { id: '81', nom: 'Corticostéroïdes inhalés', prix: '1500', image: 'https://res.cloudinary.com/zava-www-uk/image/upload/fl_progressive/a_exif,f_auto,e_sharpen:100,c_fit,w_920,h_690,q_70,fl_lossy/v1669046699/fr/services-setup/asthme/becotide/dzrf1kwgyt8x6aycw725.png', description: 'Asthme.' },
  { id: '82', nom: 'Levothyroxine', prix: '1000', image: 'https://img-3.journaldesfemmes.fr/bWTJ_Z5e9-rA5gf2HIbZ29tdkGI=/1080x/smart/28f00e8faa2c4b00906f595ab4ebcf55/ccmcms-jdf/32720662.jpg', description: 'Hypothyroïdie.' },
  { id: '83', nom: 'Clopidogrel', prix: '1200', image: 'https://mcareexports.com/wp-content/uploads/2021/06/Cidogril-75mg-tab.jpg', description: 'Anticoagulant.' },
  { id: '84', nom: 'Warfarine', prix: '1300', image: 'https://www.careformulationlabs.com/uploaded_files/warfarin-5.png', description: 'Anticoagulant.' },
  { id: '85', nom: 'Insuline lente', prix: '5500', image: 'https://gaskiyani.info/wp-content/uploads/2023/01/istockphoto-1250471519-612x612-1.jpg', description: 'Diabète.' },
  { id: '86', nom: 'Hydrochlorothiazide', prix: '900', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDpoSGTq72xMNLUcqve4sPU2yW7TKpSVF8OA&s', description: 'Hypertension.' },
  { id: '87', nom: 'Bisoprolol', prix: '1000', image: 'https://cdn.pim.mesoigner.fr/mesoigner/f2c5e31a150d666b32781a26de9d3f66/mesoigner-thumbnail-1000-1000-inset/729/963/bisoprolol-eg-1-25-mg-comprime-pellicule.webp', description: 'Hypertension.' },
  { id: '88', nom: 'Digoxine', prix: '1100', image: 'https://cdn.pim.mesoigner.fr/mesoigner/6937223300a8fbbdc171b539a15b8558/mesoigner-thumbnail-1000-1000-inset/171/264/digoxine-nativelle-0-25-mg-comprime.webp', description: 'Insuffisance cardiaque.' },
  { id: '89', nom: 'Nifédipine', prix: '950', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQefqpRwBSybEURHXIogh6NIcvzIWqxQduOxw&s', description: 'Hypertension.' },
  { id: '90', nom: 'Citalopram', prix: '1100', image: 'https://documedis.hcisolutions.ch/2020-01/api/products/image/PICBACK3D/productnumber/1211440/350', description: 'Antidépresseur.' },
  { id: '91', nom: 'Sertraline', prix: '1200', image: 'https://cdn.pim.mesoigner.fr/mesoigner/a10a3bfea12ec94868496e782ac6701e/mesoigner-thumbnail-1000-1000-inset/581/694/sertraline-biogaran-50-mg-gelule.webp', description: 'Antidépresseur.' },
  { id: '92', nom: 'Escitalopram', prix: '1200', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1PMXZIKGnfev-AUMiQIV2JZdFNm9VmWV_AA&s', description: 'Antidépresseur.' },
  { id: '93', nom: 'Lamotrigine', prix: '1500', image: 'https://assetpharmacy.com/wp-content/uploads/2017/09/Lamotrigine-100mg-Tablets-56-Tablets.jpg', description: 'Épilepsie.' },
  { id: '94', nom: 'Valproate de sodium', prix: '1400', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzKx_3ftjY1edjOuY4WCxbXEx5fj27jVPFIA&s', description: 'Épilepsie.' },
  { id: '95', nom: 'Topiramate', prix: '1600', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-20duqFOq0RR6tbQV-xadG-x567nMv1e8gw&s', description: 'Épilepsie.' },
  { id: '96', nom: 'Gabapentine', prix: '1300', image: 'https://cdn.pim.mesoigner.fr/mesoigner/c016c2f50928dee79b20f1e7cc04e8c0/mesoigner-thumbnail-1000-1000-inset/429/453/gabapentine-mylan-100-mg-gelule.webp', description: 'Douleur neuropathique.' },
  { id: '97', nom: 'Pregabaline', prix: '1400', image: 'https://exphar.ci/wp-content/uploads/sites/5/2024/09/pregabaneurine-douleurs-neuropathiques-588x374.png', description: 'Douleur neuropathique.' },
  { id: '98', nom: 'Cetirizine', prix: '700', image: 'https://www.pharmaciedesteinfort.com/media/catalog/product/cache/e34e4c303aca0a6b6a6aff8f2907f7d5/c/e/cetirizine-eg-10mg-20cpr-0000.jpg', description: 'Allergie.' },
  { id: '99', nom: 'Montelukast', prix: '1200', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIzLJU_BM2TFYipfqMqe2sV14vcj5r_tPIrw&s', description: 'Asthme.' },
  { id: '100', nom: 'Acide folique', prix: '500', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG2Vmik9IR4yW86izpnSNoTVlYSIYuTCyL1g&s', description: 'Supplément vitaminique.' },
];
const typesMedicaments = ['Tous', 'Antalgique', 'Antibiotique', 'Anti-inflammatoire', 'Bronchodilatateur', 'Antidiabétique'];
const usagesMedicaments = ['Tous', 'Douleur', 'Infection', 'Asthme', 'Diabète'];

export default function MedicamentsScreen() {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [filterUsage, setFilterUsage] = useState('Tous');
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');

  // Filtrage dynamique
  const filteredMedicaments = useMemo(() => {
    return medicaments.filter(med => {
      // Recherche texte dans le nom (insensible à la casse)
      if (!med.nom.toLowerCase().includes(searchText.toLowerCase())) return false;

      // Filtre type
      if (filterType !== 'Tous' && med.type !== filterType) return false;

      // Filtre usage
      if (filterUsage !== 'Tous' && med.usage !== filterUsage) return false;

      // Filtre prix
      if (prixMin && med.prix < Number(prixMin)) return false;
      if (prixMax && med.prix > Number(prixMax)) return false;

      return true;
    });
  }, [searchText, filterType, filterUsage, prixMin, prixMax]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nom}>{item.nom}</Text>
        <Text style={styles.prix}>{item.prix.toLocaleString()} FCFA</Text>
        <Text style={styles.typeUsage}>{item.type} | {item.usage}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titre}>Médicaments en Côte d'Ivoire</Text>

      {/* Recherche */}
      <TextInput
        style={styles.input}
        placeholder="Rechercher un médicament..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        {typesMedicaments.map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.filterBtn, filterType === type && styles.filterBtnActive]}
            onPress={() => setFilterType(type)}
          >
            <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        {usagesMedicaments.map(usage => (
          <TouchableOpacity
            key={usage}
            style={[styles.filterBtn, filterUsage === usage && styles.filterBtnActive]}
            onPress={() => setFilterUsage(usage)}
          >
            <Text style={[styles.filterText, filterUsage === usage && styles.filterTextActive]}>{usage}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtre prix */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <TextInput
          keyboardType="numeric"
          placeholder="Prix min (FCFA)"
          style={[styles.input, { flex: 1, marginRight: 5 }]}
          value={prixMin}
          onChangeText={setPrixMin}
        />
        <TextInput
          keyboardType="numeric"
          placeholder="Prix max (FCFA)"
          style={[styles.input, { flex: 1, marginLeft: 5 }]}
          value={prixMax}
          onChangeText={setPrixMax}
        />
      </View>

      {/* Liste des médicaments filtrée */}
      <FlatList
        data={filteredMedicaments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30 }}>Aucun médicament trouvé</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20, paddingHorizontal: 10 },
  titre: { fontSize: 22, fontWeight: 'bold', color: '#082630', marginBottom: 15, textAlign: 'center' },
  input: {
    borderColor: '#082630',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingVertical: 6,
    fontSize: 16,
    marginBottom: 10,
  },
  filterBtn: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterBtnActive: {
    backgroundColor: '#FF6C00',
    borderColor: '#FF6C00',
  },
  filterText: {
    color: '#555',
    fontWeight: '500',
    textAlign:'center',
   
    
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: 80, height: 80 },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  nom: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  prix: { fontSize: 14, color: '#FF6C00', marginTop: 4 },
  typeUsage: { fontSize: 12, fontStyle: 'italic', color: '#666', marginTop: 2 },
  desc: { fontSize: 12, color: '#666', marginTop: 4 },
});