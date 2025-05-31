document.addEventListener('DOMContentLoaded', () => {
    const materialList = document.getElementById('material-list');
    const contentArea = document.getElementById('content-area');
    let materialsData = {};
    let currentMaterialKey = null;
    let userSelections = {};

    // Complete materials data (your full data.json content)
    // This is embedded directly to avoid fetch issues and align with mcda_app_improved.html
    const materialsDataComplete = {
      "REG_1935_2004": {
        "type": "Regulation",
        "scope": "EU",
        "name": "Règlement (CE) n° 1935/2004",
        "summary": "Règlement cadre établissant les exigences générales pour tous les matériaux et objets destinés à entrer en contact avec des denrées alimentaires (MCDA) dans l'UE. Principes clés : inertie (Art. 3), Bonnes Pratiques de Fabrication (BPF), traçabilité, déclaration de conformité, étiquetage.",
        "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32004R1935",
        "details": "L'article 3 est fondamental : les MCDA ne doivent pas céder de constituants aux aliments en quantité susceptible de présenter un danger pour la santé humaine, d'entraîner une modification inacceptable de la composition des denrées, ou d'altérer leurs caractères organoleptiques. Le règlement prévoit l'adoption de mesures spécifiques pour certains groupes de matériaux (listés en Annexe I).",
        "keywords": ["règlement cadre", "UE", "général", "inertie", "BPF", "traçabilité", "déclaration conformité", "étiquetage"]
      },
      "REG_2023_2006": {
        "type": "Regulation",
        "scope": "EU",
        "name": "Règlement (CE) n° 2023/2006",
        "summary": "Règlement sur les Bonnes Pratiques de Fabrication (BPF) pour les MCDA. S'applique à tous les secteurs et stades de fabrication, transformation et distribution (sauf production de substances de départ).",
        "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32006R2023",
        "details": "Exige la mise en place d'un système d'assurance qualité et d'un système de contrôle de la qualité documentés. Vise à assurer la qualité et la sécurité des MCDA tout au long de la chaîne d'approvisionnement.",
        "keywords": ["BPF", "GMP", "UE", "fabrication", "qualité", "traçabilité"]
      },
      "REG_10_2011_CONSOL": {
        "type": "Regulation",
        "scope": "EU",
        "name": "Règlement (UE) n° 10/2011 consolidé (Plastiques MCDA)",
        "summary": "Règlement spécifique UE HARMONISÉ pour les matières plastiques destinées au contact alimentaire. Définit le champ d'application, la liste positive des substances autorisées (Annexe I), les limites de migration (LMG/LMS), les simulants, les conditions de test (Annexe V), les règles pour le multicouche/barrière fonctionnelle et les exigences de DoC (Annexe IV).",
        "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02011R0010-20200923",
        "amendments_note": "Ce règlement est fréquemment amendé (15+ fois). Toujours vérifier la dernière version consolidée applicable.",
        "keywords": ["plastique", "plastic", "PIM", "10/2011", "règlement spécifique", "harmonisé", "LMS", "LMG", "Annexe I", "Annexe II", "Annexe IV", "Annexe V"],
        "food_type_impact": ["aqueux", "acide", "gras", "sec"],
        "contact_conditions_impact": ["all"]
      },
      "REG_RECYCLE_PLAST_2022_1616": {
        "type": "Regulation",
        "scope": "EU",
        "name": "Règlement (UE) 2022/1616 (Plastiques Recyclés)",
        "summary": "Nouveau règlement UE pour les matières plastiques recyclées destinées au contact alimentaire. Remplace le Règl. (CE) 282/2008. Exige autorisation des procédés de recyclage par l'EFSA/Commission.",
        "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022R1616",
        "details": "Ce règlement vise à assurer la sécurité des plastiques recyclés en contact avec les aliments. Il établit des règles strictes pour la collecte, le tri et le traitement du plastique recyclé, et impose que les procédés de recyclage soient évalués et autorisés par l'EFSA et la Commission européenne. L'utilisation d'une barrière fonctionnelle peut être requise pour limiter la migration de contaminants potentiels issus du recyclage.",
        "keywords": ["plastique recyclé", "2022/1616", "recyclage", "autorisation", "EFSA", "barrière fonctionnelle"],
        "applies_if_recycled": true
      },
      "ARRETE_FR_PLASTIQUES_1994": {
        "type": "Regulation",
        "scope": "FR",
        "name": "Arrêté du 9 novembre 1994 (Plastiques)",
        "summary": "Réglementation française relative aux matériaux et objets en matière plastique mis ou destinés à être mis au contact des denrées, produits et boissons alimentaires.",
        "link": "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000729000/",
        "keywords": ["arrêté", "france", "plastique"]
      },
      "RISK_MIGRATION_PLASTIQUES": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques Potentiels (Plastiques)",
        "summary": "Migration de monomères résiduels, additifs (phtalates, antioxydants), NIAS (Substances Non Intentionnellement Ajoutées). Mauvaise utilisation (chaleur excessive) peut aggraver. Microplastiques.",
        "details": [
          {"TypeRisque": "Monomères Résiduels", "Description": "Substances de base n'ayant pas complètement polymérisé (ex: styrène, formaldéhyde). Leur migration est limitée par les LMS."},
          {"TypeRisque": "Additifs", "Description": "Substances ajoutées pour améliorer les propriétés du plastique (ex: plastifiants comme les phtalates, antioxydants, stabilisants UV). Seuls les additifs listés et respectant les LMS sont autorisés."},
          {"TypeRisque": "NIAS", "Description": "Impuretés, produits de réaction ou de dégradation formés involontairement pendant la fabrication ou l'utilisation. Leur évaluation toxicologique est complexe et souvent nécessaire."},
          {"TypeRisque": "Microplastiques", "Description": "Petits fragments de plastique pouvant se détacher du matériau. Leur impact sur la santé est un sujet de recherche en cours."},
          {"TypeRisque": "Mauvaise Utilisation", "Description": "Utilisation du plastique dans des conditions non prévues (ex: chauffage excessif) peut augmenter significativement la migration de substances."}
        ],
        "keywords": ["plastique", "migration", "risque", "monomère", "additif", "phtalate", "BPA", "NIAS", "microplastique", "chaleur"]
      },
      "LMG_PLAST": {
        "type": "Limit",
        "limit_type": "LMG",
        "material_scope": ["plastiques"],
        "name": "Limite de Migration Globale (Plastiques)",
        "value": "10 mg/dm²",
        "alternative_value": "60 mg/kg d'aliment (pour nourrissons/jeunes enfants, ou si ratio S/V non connu)",
        "reference_id": "REG_10_2011_CONSOL",
        "reference_details": "Article 12",
        "keywords": ["LMG", "migration globale", "overall migration", "plastique", "limite"]
      },
      "TEST_SIMULANTS_PLAST_ANNEX3": {
        "type": "Test Condition",
        "material_scope": ["plastiques"],
        "name": "Simulants Alimentaires (Plastiques - Annexe III)",
        "summary": "L'Annexe III du Règl. 10/2011 définit les simulants à utiliser en fonction du type d'aliment.",
        "details_table": [
          { "Simulant": "A", "Composition": "Éthanol 10% (v/v)", "Usage": "Aliments aqueux (pH > 4.5)" },
          { "Simulant": "B", "Composition": "Acide Acétique 3% (m/v)", "Usage": "Aliments acides (pH ≤ 4.5)" },
          { "Simulant": "C", "Composition": "Éthanol 20% (v/v)", "Usage": "Aliments alcooliques (≤ 20% vol), aliments organiques/lipophiles" },
          { "Simulant": "D1", "Composition": "Éthanol 50% (v/v)", "Usage": "Aliments alcooliques (> 20% vol), huile dans eau" },
          { "Simulant": "D2", "Composition": "Huile végétale", "Usage": "Aliments gras (matières grasses libres)" },
          { "Simulant": "E", "Composition": "Oxyde de poly(2,6-diphényl-p-phénylène) / Tenax®", "Usage": "Aliments secs (tests LMS)" }
        ],
        "reference_id": "REG_10_2011_CONSOL",
        "reference_details": "Annexe III",
        "keywords": ["test", "simulant", "plastique", "Annexe III", "éthanol", "acide acétique", "huile végétale", "Tenax"]
      },
      "COE_GUIDE_METAUX_2024": {
        "type": "Guidance",
        "scope": "CoE/EU Reference",
        "name": "Guide Technique EDQM Métaux et Alliages (2e éd. 2024)",
        "summary": "Référence technique clé du Conseil de l'Europe (EDQM) pour évaluer la sécurité des métaux et alliages. Complète la Résolution CM/Res(2020)9. Contient principes, LLS/SRL pour 21+ métaux, méthodes d'essai.",
        "link": "https://freepub.edqm.eu/publications",
        "details": "Ce guide, bien que non légalement contraignant au niveau de l'UE, est largement utilisé pour démontrer la conformité au principe d'inertie (Art. 3 du Règl. 1935/2004). Il fournit des Limites de Libération Spécifiques (LLS) pour de nombreux métaux (ex: Nickel, Chrome, Aluminium, Fer, Cuivre, Zinc, Plomb, Cadmium, Arsenic, Mercure). Les méthodes d'essai recommandées utilisent souvent l'acide citrique à 0,5% pour simuler les aliments acides, qui sont les plus corrosifs pour les métaux.",
        "keywords": ["EDQM", "Conseil Europe", "guide technique", "métal", "alliage", "LLS", "SRL", "test migration", "2024", "CM/Res(2020)9", "nickel", "chrome", "aluminium", "fer", "cuivre", "zinc", "plomb", "cadmium", "arsenic", "mercure"],
        "food_type_impact": ["acide", "aqueux"],
        "contact_conditions_impact": ["prolonged_contact", "high_temperature"]
      },
      "ARRETES_FR_METAUX": {
        "type": "Regulation",
        "scope": "FR",
        "name": "Arrêté du 13 janvier 1976 (Métaux et Alliages)",
        "summary": "Réglementation française relative aux matériaux et objets en métaux et alliages mis ou destinés à être mis au contact des denrées, produits et boissons alimentaires.",
        "link": "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000729000/",
        "keywords": ["arrêté", "france", "métal", "alliage"]
      },
      "FICHE_DGCCRF_METAUX": {
        "type": "Guidance",
        "scope": "FR",
        "name": "Fiche DGCCRF 'Métaux et alliages'",
        "summary": "Fiche d'information de la DGCCRF sur les métaux et alliages.",
        "link": "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/Metaux-et-alliages",
        "keywords": ["DGCCRF", "fiche", "métal", "alliage"]
      },
      "FICHE_DGCCRF_ACIER_INOXYDABLE": {
        "type": "Guidance",
        "scope": "FR",
        "name": "Fiche DGCCRF 'Acier Inoxydable'",
        "summary": "Fiche d'information spécifique de la DGCCRF sur l'acier inoxydable.",
        "link": "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/Acier-inoxydable",
        "keywords": ["DGCCRF", "fiche", "acier inoxydable"],
        "applies_if_stainless_steel": true
      },
      "FICHE_DGCCRF_ALUMINIUM": {
        "type": "Guidance",
        "scope": "FR",
        "name": "Fiche DGCCRF 'Aluminium'",
        "summary": "Fiche d'information spécifique de la DGCCRF sur l'aluminium.",
        "link": "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/Aluminium",
        "keywords": ["DGCCRF", "fiche", "aluminium"],
        "applies_if_aluminum": true
      },
      "RISK_MIGRATION_METAUX": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration / Contamination (Métaux)",
        "summary": "Corrosion ou usure peuvent entraîner migration de métaux. Inox de mauvaise qualité (Ni, Cr), alliages cuivreux (Cu, Pb), plomb résiduel, aluminium en milieu acide.",
        "details": [
          {"Source": "Corrosion/Usure", "Risk": "La surface du métal peut se dégrader au contact de certains aliments (acides, salins), libérant des ions métalliques dans l'aliment. Le type d'alliage est crucial (ex: un inox avec moins de 13% de chrome est moins résistant à la corrosion)."},
          {"Source": "Composition de l'Alliage", "Risk": "Certains éléments présents dans l'alliage (ex: Nickel, Chrome, Cuivre, Plomb) peuvent migrer. Les LLS/SRL définissent les limites acceptables."},
          {"Source": "Plomb/Cadmium", "Risk": "Ces métaux lourds sont très toxiques et strictement limités. Ils peuvent être présents comme impuretés dans certains alliages ou soudures (particulièrement dans les anciens produits)."},
          {"Source": "Aluminium", "Risk": "La migration de l'aluminium est plus importante au contact d'aliments très acides (pH bas) ou très salins. L'anodisation peut réduire ce risque."},
          {"Source": "Revêtements", "Risk": "Si le métal est revêtu (ex: fer blanc étamé, aluminium verni), l'intégrité et la conformité du revêtement sont essentielles. Un revêtement endommagé peut exposer le métal sous-jacent et entraîner sa migration."}
        ],
        "keywords": ["métal", "migration", "risque", "corrosion", "nickel", "chrome", "plomb", "cadmium", "aluminium", "cuivre", "alliage", "revêtement"]
      },
      "LIMIT_MIGRATION_NICKEL": {
        "type": "Limit",
        "limit_type": "LLS",
        "material_scope": ["metaux"],
        "name": "Limite de migration de Nickel",
        "value": "0.14 mg/kg",
        "notes": "Pour les aciers inoxydables en contact prolongé avec des aliments acides.",
        "applies_if_stainless_steel": true,
        "food_type_impact": ["acide"],
        "contact_conditions_impact": ["prolonged_contact"]
      },
      "NORM_EN_10088": {
        "type": "Norm/Standard",
        "material_scope": ["metaux"],
        "name": "EN 10088 (Aciers Inoxydables)",
        "description": "Aciers inoxydables - Conditions techniques de livraison pour les produits semi-finis, barres, fils, profils et produits plats.",
        "link": "https://www.boutique.afnor.org/fr-fr/norme/nf-en-100881-aciers-inoxydables-partie-1-liste-des-aciers-inoxydables/fa100001",
        "keywords": ["norme", "acier inoxydable"],
        "applies_if_stainless_steel": true
      },
      "DIR_84_500_CEE_MOD": {
        "type": "Regulation",
        "scope": "EU",
        "name": "Directive 84/500/CEE modifiée (par 2005/31/CE)",
        "summary": "Directive UE harmonisée spécifique aux objets céramiques (vaisselle, cuisson...) limitant la migration du Plomb (Pb) et du Cadmium (Cd). Exige une DoC spécifique.",
        "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:01984L0500-20050520",
        "scope_details": "Ne couvre PAS les céramiques techniques (ex: SiC, Si3N4, ZrO2) utilisées dans l'industrie. Concerne principalement faïence, grès, porcelaine...",
        "keywords": ["céramique", "ceramic", "plomb", "cadmium", "Pb", "Cd", "84/500", "directive", "vaisselle", "harmonisé"]
      },
      "RISK_MIGRATION_CERAMIQUES_VERRES": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Céramiques et Verres)",
        "summary": "Migration de plomb et de cadmium, surtout des décorations ou glaçures non conformes.",
        "details": "Les limites de migration sont définies par la Directive 84/500/CEE et varient selon le type d'objet (creux, plat, cuisson).",
        "keywords": ["céramique", "verre", "plomb", "cadmium", "migration", "risque", "décoration"]
      },
      "COE_GUIDE_PAPIER_CARTON": {
        "type": "Guidance",
        "scope": "CoE/EU Reference",
        "name": "Résolution AP(2002)1 du Conseil de l'Europe (Papier et Carton)",
        "summary": "Recommandations du Conseil de l'Europe sur les matériaux et objets en papier et carton destinés à entrer en contact avec les denrées alimentaires.",
        "link": "https://rm.coe.int/168071a21e",
        "keywords": ["Conseil Europe", "papier", "carton", "recommandation"]
      },
      "BFR_REC_XXXVI": {
        "type": "Guidance",
        "scope": "DE Reference",
        "name": "Recommandation BfR XXXVI (Papier et Carton)",
        "summary": "Recommandation de l'Institut Fédéral Allemand pour l'Évaluation des Risques (BfR) sur le papier et le carton en contact alimentaire. Souvent utilisée comme référence en l'absence de législation UE harmonisée.",
        "link": "https://www.bfr.bund.de/cm/343/recommendations-on-food-contact-materials.pdf",
        "keywords": ["BfR", "papier", "carton", "recommandation", "Allemagne"]
      },
      "RISK_MIGRATION_PAPIER_CARTON": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration / Contamination (Papier et Carton)",
        "summary": "Principaux risques: migration depuis papiers/cartons recyclés (huiles minérales, photoinitiateurs, autres contaminants). PFAS dans papiers traités anti-graisse. Formaldéhyde depuis colles.",
        "details": [
          {"Source": "Papier/Carton Recyclé", "Risk": "Les papiers/cartons recyclés peuvent contenir des contaminants issus de leur usage précédent (ex: encres d'impression, adhésifs, résidus chimiques). Les huiles minérales (MOSH/MOAH) et les photoinitiateurs sont des préoccupations majeures."},
          {"Source": "Traitements Chimiques", "Risk": "Migration de substances utilisées pour donner des propriétés spécifiques au papier/carton (ex: agents anti-graisse contenant des PFAS, agents de blanchiment, azurants optiques)."},
          {"Source": "Colles et Adhésifs", "Risk": "Migration de composants des colles utilisées dans la fabrication du carton ou l'assemblage des emballages (ex: formaldéhyde, acrylamide)."},
          {"Source": "Encres d'impression", "Risk": "Migration de composants de l'encre par 'set-off' ou perméation si l'encre n'est pas sur la face extérieure ou si une barrière n'est pas présente."},
          {"Source": "Microbiologique", "Risk": "Le papier/carton peut être un substrat pour la croissance microbienne si les conditions de stockage sont humides, pouvant entraîner la production de mycotoxines."}
        ],
        "keywords": ["papier", "carton", "migration", "risque", "MOSH", "MOAH", "photoinitiateur", "PFAS", "formaldéhyde", "encre", "recyclé", "contaminant"]
      },
      "ARRETE_FR_2020_08_05_CAOUTCHOUC": {
        "type": "Regulation",
        "scope": "FR",
        "name": "Arrêté FR du 5 août 2020 (Caoutchoucs et Élastomères)",
        "summary": "Réglementation française spécifique et détaillée pour les matériaux et objets en caoutchouc et les sucettes. Contient listes positives, restrictions, conditions de test et exigences DoC. Applicable depuis 1er juillet 2021.",
        "link": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042225149/",
        "keywords": ["arrêté", "france", "caoutchouc", "rubber", "liste positive", "LMS", "QMA", "test", "DoC", "2020"]
      },
      "RISK_MIGRATION_CAOUTCHOUCS": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Caoutchoucs et Élastomères)",
        "summary": "Migration d'additifs (vulcanisants, antioxydants), N-nitrosamines et substances N-nitrosables.",
        "details": "Les N-nitrosamines sont des substances potentiellement cancérigènes, leur migration est strictement limitée, notamment pour les tétines et sucettes.",
        "keywords": ["caoutchouc", "élastomère", "migration", "risque", "nitrosamine", "additif"]
      },
      "DIR_2007_42_CE": {
        "type": "Regulation",
        "scope": "EU",
        "name": "Directive 2007/42/CE (Pellicule de Cellulose Régénérée)",
        "summary": "Directive spécifique UE harmonisée pour les matériaux et objets en pellicule de cellulose régénérée destinés à entrer en contact avec les denrées alimentaires.",
        "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32007L0042",
        "keywords": ["cellulose régénérée", "film", "harmonisé", "directive"]
      },
      "RISK_MIGRATION_CELLULOSE": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Pellicule de Cellulose Régénérée)",
        "summary": "Migration de substances issues des additifs ou revêtements (ex: plastifiants, agents de surface).",
        "details": "La pellicule de cellulose régénérée est souvent traitée ou revêtue pour améliorer ses propriétés (ex: résistance à l'humidité, soudabilité). Les substances utilisées pour ces traitements doivent être conformes.",
        "keywords": ["cellulose", "migration", "risque", "additif", "revêtement"]
      },
      "RISK_MIGRATION_BOIS": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Bois)",
        "summary": "Migration de substances naturelles du bois (tanins, résines), contamination microbiologique, migration de substances issues de traitements (colles, vernis, huiles).",
        "details": "Le bois est un matériau poreux. Son utilisation doit être adaptée au type d'aliment et aux conditions de contact. Les bois traités nécessitent une attention particulière quant à la conformité des produits de traitement.",
        "keywords": ["bois", "migration", "risque", "tanin", "microbiologique", "traitement"]
      },
      "REG_450_2009": {
        "type": "Regulation",
        "scope": "EU",
        "name": "Règlement (CE) n° 450/2009 (Matériaux Actifs et Intelligents)",
        "summary": "Règlement spécifique UE harmonisé pour les matériaux et objets actifs et intelligents destinés à entrer en contact avec des denrées alimentaires.",
        "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32009R0450",
        "keywords": ["actif", "intelligent", "harmonisé", "règlement spécifique"]
      },
      "RISK_MIGRATION_ACTIF_INTELLIGENT": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Matériaux Actifs et Intelligents)",
        "summary": "Migration des substances actives ou des indicateurs vers l'aliment. Interaction non désirée avec l'aliment.",
        "details": "Les composants actifs ou intelligents doivent être autorisés et ne pas migrer au-delà des limites de sécurité. Leur fonction ne doit pas masquer l'altération de l'aliment.",
        "keywords": ["actif", "intelligent", "migration", "risque"]
      },
      "ARRETE_FR_1992_11_25_SILICONE": {
        "type": "Regulation",
        "scope": "FR",
        "name": "Arrêté du 25 novembre 1992 (Silicones)",
        "summary": "Réglementation française relative aux matériaux et objets en silicone mis ou destinés à être mis au contact des denrées, produits et boissons alimentaires.",
        "link": "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000729000/",
        "keywords": ["arrêté", "france", "silicone"]
      },
      "RISK_MIGRATION_SILICONES": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Silicones)",
        "summary": "Migration de siloxanes cycliques (D4, D5, D6) à haute température.",
        "details": "Ces substances sont volatiles et peuvent migrer lors de la cuisson. Des limites spécifiques peuvent s'appliquer.",
        "keywords": ["silicone", "migration", "risque", "siloxane", "D4", "D5", "D6"]
      },
      "RISK_MIGRATION_TEXTILES": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Textiles)",
        "summary": "Migration de colorants, apprêts, agents de finition, ou contaminants issus des fibres (naturelles ou synthétiques).",
        "details": "Les textiles peuvent être traités avec diverses substances chimiques. Leur conformité est essentielle pour éviter la contamination des aliments.",
        "keywords": ["textile", "migration", "risque", "colorant", "apprêt"]
      },
      "REG_2018_213_BPA_VERNIS": {
        "type": "Regulation",
        "scope": "EU",
        "name": "Règlement (UE) 2018/213 (BPA dans Vernis et Revêtements)",
        "summary": "Règlement spécifique UE limitant l'utilisation du Bisphénol A (BPA) dans les vernis et revêtements destinés à entrer en contact avec des denrées alimentaires.",
        "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32018R0213",
        "keywords": ["BPA", "bisphénol A", "vernis", "revêtement", "règlement spécifique"]
      },
      "RISK_MIGRATION_VERNIS_REVET": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Vernis et Revêtements)",
        "summary": "Migration de monomères (ex: BPA, BADGE, NOGE), solvants résiduels, photoinitiateurs.",
        "details": "L'intégrité du revêtement est cruciale. Un revêtement endommagé peut entraîner une migration accrue ou exposer le substrat.",
        "keywords": ["vernis", "revêtement", "migration", "risque", "BPA", "BADGE", "NOGE", "solvant"]
      },
      "RISK_MIGRATION_VERRE": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Verre)",
        "summary": "Migration de plomb et de cadmium pour le verre décoré. Le verre non décoré est généralement inerte.",
        "details": "Les décorations sur le verre peuvent contenir des métaux lourds. Les limites de migration sont les mêmes que pour la céramique (Directive 84/500/CEE).",
        "keywords": ["verre", "migration", "risque", "plomb", "cadmium", "décoré"]
      },
      "RISK_MIGRATION_CIRES": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Cires)",
        "summary": "Migration d'hydrocarbures (MOSH/MOAH) si la cire n'est pas de qualité alimentaire.",
        "details": "Les cires utilisées doivent être de pureté suffisante pour le contact alimentaire.",
        "keywords": ["cire", "migration", "risque", "MOSH", "MOAH"]
      },
      "RISK_MIGRATION_COLLES": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Colles et Adhésifs)",
        "summary": "Migration de monomères résiduels, solvants, ou autres composants des adhésifs.",
        "details": "Les colles ne sont pas censées être en contact direct avec l'aliment, mais la migration à travers les couches est possible. Les substances utilisées doivent être conformes.",
        "keywords": ["colle", "adhésif", "migration", "risque"]
      },
      "RISK_MIGRATION_ENCRES": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Encres d'Imprimerie)",
        "summary": "Migration de photoinitiateurs, solvants, pigments, ou autres composants de l'encre.",
        "details": "Le 'set-off' (transfert d'encre de la face imprimée vers la face en contact avec l'aliment) et la perméation sont les principaux mécanismes de migration. Une barrière fonctionnelle est souvent nécessaire.",
        "keywords": ["encre", "impression", "migration", "risque", "photoinitiateur", "solvant", "pigment", "set-off", "barrière fonctionnelle"]
      },
      "RISK_MIGRATION_LIEGE": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Liège)",
        "summary": "Migration de substances naturelles (tanins) ou de contaminants (TCA - trichloroanisole, responsable du 'goût de bouchon').",
        "details": "Le liège doit être traité pour éviter la contamination microbiologique et la formation de TCA.",
        "keywords": ["liège", "migration", "risque", "TCA", "goût de bouchon"]
      },
      "RISK_MIGRATION_RESINES_ECHANGE": {
        "type": "Risk Information",
        "scope": "General",
        "name": "Risques de Migration (Résines Échangeuses d'ions)",
        "summary": "Migration de monomères résiduels ou d'impuretés issues de la fabrication de la résine.",
        "details": "Les résines doivent être de qualité alimentaire et rincées avant utilisation pour minimiser la migration.",
        "keywords": ["résine échangeuse d'ions", "migration", "risque"]
      },
      "plastiques": {
        "name": "Plastiques",
        "description": "Matériaux polymères largement utilisés pour l'emballage et les articles de cuisine.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "REG_10_2011_CONSOL",
          "ARRETE_FR_PLASTIQUES_1994"
        ],
        "risks": [
          "RISK_MIGRATION_PLASTIQUES"
        ],
        "details": {
          "REG_10_2011_CONSOL": {
            "type": "Regulation",
            "scope": "EU",
            "name": "Règlement (UE) n° 10/2011 consolidé (Plastiques MCDA)",
            "summary": "Règlement spécifique UE HARMONISÉ pour les matières plastiques destinées au contact alimentaire. Définit le champ d'application, la liste positive des substances autorisées (Annexe I), les limites de migration (LMG/LMS), les simulants, les conditions de test (Annexe V), les règles pour le multicouche/barrière fonctionnelle et les exigences de DoC (Annexe IV).",
            "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02011R0010-20200923",
            "amendments_note": "Ce règlement est fréquemment amendé (15+ fois). Toujours vérifier la dernière version consolidée applicable.",
            "keywords": ["plastique", "plastic", "PIM", "10/2011", "règlement spécifique", "harmonisé", "LMS", "LMG", "Annexe I", "Annexe II", "Annexe IV", "Annexe V"],
            "food_type_impact": ["aqueux", "acide", "gras", "sec"],
            "contact_conditions_impact": ["all"]
          },
          "REG_RECYCLE_PLAST_2022_1616": {
            "type": "Regulation",
            "scope": "EU",
            "name": "Règlement (UE) 2022/1616 (Plastiques Recyclés)",
            "summary": "Nouveau règlement UE pour les matières plastiques recyclées destinées au contact alimentaire. Remplace le Règl. (CE) 282/2008. Exige autorisation des procédés de recyclage par l'EFSA/Commission.",
            "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022R1616",
            "details": "Ce règlement vise à assurer la sécurité des plastiques recyclés en contact avec les aliments. Il établit des règles strictes pour la collecte, le tri et le traitement du plastique recyclé, et impose que les procédés de recyclage soient évalués et autorisés par l'EFSA et la Commission européenne. L'utilisation d'une barrière fonctionnelle peut être requise pour limiter la migration de contaminants potentiels issus du recyclage.",
            "keywords": ["plastique recyclé", "2022/1616", "recyclage", "autorisation", "EFSA", "barrière fonctionnelle"],
            "applies_if_recycled": true
          },
          "RISK_MIGRATION_PLASTIQUES": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques Potentiels (Plastiques)",
            "summary": "Migration de monomères résiduels, additifs (phtalates, antioxydants), NIAS (Substances Non Intentionnellement Ajoutées). Mauvaise utilisation (chaleur excessive) peut aggraver. Microplastiques.",
            "details": [
              {"TypeRisque": "Monomères Résiduels", "Description": "Substances de base n'ayant pas complètement polymérisé (ex: styrène, formaldéhyde). Leur migration est limitée par les LMS."},
              {"TypeRisque": "Additifs", "Description": "Substances ajoutées pour améliorer les propriétés du plastique (ex: plastifiants comme les phtalates, antioxydants, stabilisants UV). Seuls les additifs listés et respectant les LMS sont autorisés."},
              {"TypeRisque": "NIAS", "Description": "Impuretés, produits de réaction ou de dégradation formés involontairement pendant la fabrication ou l'utilisation. Leur évaluation toxicologique est complexe et souvent nécessaire."},
              {"TypeRisque": "Microplastiques", "Description": "Petits fragments de plastique pouvant se détacher du matériau. Leur impact sur la santé est un sujet de recherche en cours."},
              {"TypeRisque": "Mauvaise Utilisation", "Description": "Utilisation du plastique dans des conditions non prévues (ex: chauffage excessif) peut augmenter significativement la migration de substances."}
            ],
            "keywords": ["plastique", "migration", "risque", "monomère", "additif", "phtalate", "BPA", "NIAS", "microplastique", "chaleur"]
          },
          "LMG_PLAST": {
            "type": "Limit",
            "limit_type": "LMG",
            "material_scope": ["plastiques"],
            "name": "Limite de Migration Globale (Plastiques)",
            "value": "10 mg/dm²",
            "alternative_value": "60 mg/kg d'aliment (pour nourrissons/jeunes enfants, ou si ratio S/V non connu)",
            "reference_id": "REG_10_2011_CONSOL",
            "reference_details": "Article 12",
            "keywords": ["LMG", "migration globale", "overall migration", "plastique", "limite"]
          },
          "TEST_SIMULANTS_PLAST_ANNEX3": {
            "type": "Test Condition",
            "material_scope": ["plastiques"],
            "name": "Simulants Alimentaires (Plastiques - Annexe III)",
            "summary": "L'Annexe III du Règl. 10/2011 définit les simulants à utiliser en fonction du type d'aliment.",
            "details_table": [
              { "Simulant": "A", "Composition": "Éthanol 10% (v/v)", "Usage": "Aliments aqueux (pH > 4.5)" },
              { "Simulant": "B", "Composition": "Acide Acétique 3% (m/v)", "Usage": "Aliments acides (pH ≤ 4.5)" },
              { "Simulant": "C", "Composition": "Éthanol 20% (v/v)", "Usage": "Aliments alcooliques (≤ 20% vol), aliments organiques/lipophiles" },
              { "Simulant": "D1", "Composition": "Éthanol 50% (v/v)", "Usage": "Aliments alcooliques (> 20% vol), huile dans eau" },
              { "Simulant": "D2", "Composition": "Huile végétale", "Usage": "Aliments gras (matières grasses libres)" },
              { "Simulant": "E", "Composition": "Oxyde de poly(2,6-diphényl-p-phénylène) / Tenax®", "Usage": "Aliments secs (tests LMS)" }
            ],
            "reference_id": "REG_10_2011_CONSOL",
            "reference_details": "Annexe III",
            "keywords": ["test", "simulant", "plastique", "Annexe III", "éthanol", "acide acétique", "huile végétale", "Tenax"]
          }
        }
      },
      "metaux_alliages": {
        "name": "Métaux et Alliages",
        "description": "Utilisés dans les boîtes de conserve, ustensiles de cuisine, équipements de transformation.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "COE_GUIDE_METAUX_2024",
          "ARRETES_FR_METAUX"
        ],
        "risks": [
          "RISK_MIGRATION_METAUX"
        ],
        "details": {
          "COE_GUIDE_METAUX_2024": {
            "type": "Guidance",
            "scope": "CoE/EU Reference",
            "name": "Guide Technique EDQM Métaux et Alliages (2e éd. 2024)",
            "summary": "Référence technique clé du Conseil de l'Europe (EDQM) pour évaluer la sécurité des métaux et alliages. Complète la Résolution CM/Res(2020)9. Contient principes, LLS/SRL pour 21+ métaux, méthodes d'essai.",
            "link": "https://freepub.edqm.eu/publications",
            "details": "Ce guide, bien que non légalement contraignant au niveau de l'UE, est largement utilisé pour démontrer la conformité au principe d'inertie (Art. 3 du Règl. 1935/2004). Il fournit des Limites de Libération Spécifiques (LLS) pour de nombreux métaux (ex: Nickel, Chrome, Aluminium, Fer, Cuivre, Zinc, Plomb, Cadmium, Arsenic, Mercure). Les méthodes d'essai recommandées utilisent souvent l'acide citrique à 0,5% pour simuler les aliments acides, qui sont les plus corrosifs pour les métaux.",
            "keywords": ["EDQM", "Conseil Europe", "guide technique", "métal", "alliage", "LLS", "SRL", "test migration", "2024", "CM/Res(2020)9", "nickel", "chrome", "aluminium", "fer", "cuivre", "zinc", "plomb", "cadmium", "arsenic", "mercure"],
            "food_type_impact": ["acide", "aqueux"],
            "contact_conditions_impact": ["prolonged_contact", "high_temperature"]
          },
          "RISK_MIGRATION_METAUX": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration / Contamination (Métaux)",
            "summary": "Corrosion ou usure peuvent entraîner migration de métaux. Inox de mauvaise qualité (Ni, Cr), alliages cuivreux (Cu, Pb), plomb résiduel, aluminium en milieu acide.",
            "details": [
              {"Source": "Corrosion/Usure", "Risk": "La surface du métal peut se dégrader au contact de certains aliments (acides, salins), libérant des ions métalliques dans l'aliment. Le type d'alliage est crucial (ex: un inox avec moins de 13% de chrome est moins résistant à la corrosion)."},
              {"Source": "Composition de l'Alliage", "Risk": "Certains éléments présents dans l'alliage (ex: Nickel, Chrome, Cuivre, Plomb) peuvent migrer. Les LLS/SRL définissent les limites acceptables."},
              {"Source": "Plomb/Cadmium", "Risk": "Ces métaux lourds sont très toxiques et strictement limités. Ils peuvent être présents comme impuretés dans certains alliages ou soudures (particulièrement dans les anciens produits)."},
              {"Source": "Aluminium", "Risk": "La migration de l'aluminium est plus importante au contact d'aliments très acides (pH bas) ou très salins. L'anodisation peut réduire ce risque."},
              {"Source": "Revêtements", "Risk": "Si le métal est revêtu (ex: fer blanc étamé, aluminium verni), l'intégrité et la conformité du revêtement sont essentielles. Un revêtement endommagé peut exposer le métal sous-jacent et entraîner sa migration."}
            ],
            "keywords": ["métal", "migration", "risque", "corrosion", "nickel", "chrome", "plomb", "cadmium", "aluminium", "cuivre", "alliage", "revêtement"]
          },
          "LIMIT_MIGRATION_NICKEL": {
            "type": "Limit",
            "limit_type": "LLS",
            "material_scope": ["metaux"],
            "name": "Limite de migration de Nickel",
            "value": "0.14 mg/kg",
            "notes": "Pour les aciers inoxydables en contact prolongé avec des aliments acides.",
            "applies_if_stainless_steel": true,
            "food_type_impact": ["acide"],
            "contact_conditions_impact": ["prolonged_contact"]
          },
          "NORM_EN_10088": {
            "type": "Norm/Standard",
            "material_scope": ["metaux"],
            "name": "EN 10088 (Aciers Inoxydables)",
            "description": "Aciers inoxydables - Conditions techniques de livraison pour les produits semi-finis, barres, fils, profils et produits plats.",
            "link": "https://www.boutique.afnor.org/fr-fr/norme/nf-en-100881-aciers-inoxydables-partie-1-liste-des-aciers-inoxydables/fa100001",
            "keywords": ["norme", "acier inoxydable"],
            "applies_if_stainless_steel": true
          }
        }
      },
      "ceramiques_verre": {
        "name": "Céramiques et Verre",
        "description": "Vaisselle, récipients de stockage, bouteilles.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "DIR_84_500_CEE_MOD"
        ],
        "risks": [
          "RISK_MIGRATION_CERAMIQUES_VERRES"
        ],
        "details": {
          "DIR_84_500_CEE_MOD": {
            "type": "Regulation",
            "scope": "EU",
            "name": "Directive 84/500/CEE modifiée (par 2005/31/CE)",
            "summary": "Directive UE harmonisée spécifique aux objets céramiques (vaisselle, cuisson...) limitant la migration du Plomb (Pb) et du Cadmium (Cd). Exige une DoC spécifique.",
            "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:01984L0500-20050520",
            "scope_details": "Ne couvre PAS les céramiques techniques (ex: SiC, Si3N4, ZrO2) utilisées dans l'industrie. Concerne principalement faïence, grès, porcelaine...",
            "keywords": ["céramique", "ceramic", "plomb", "cadmium", "Pb", "Cd", "84/500", "directive", "vaisselle", "harmonisé"]
          },
          "RISK_MIGRATION_CERAMIQUES_VERRES": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Céramiques et Verres)",
            "summary": "Migration de plomb et de cadmium, surtout des décorations ou glaçures non conformes.",
            "details": "Les limites de migration sont définies par la Directive 84/500/CEE et varient selon le type d'objet (creux, plat, cuisson).",
            "keywords": ["céramique", "verre", "plomb", "cadmium", "migration", "risque", "décoration"]
          }
        }
      },
      "papier_carton": {
        "name": "Papier et Carton",
        "description": "Emballages, sacs, filtres.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "COE_GUIDE_PAPIER_CARTON",
          "BFR_REC_XXXVI"
        ],
        "risks": [
          "RISK_MIGRATION_PAPIER_CARTON"
        ],
        "details": {
          "RISK_MIGRATION_PAPIER_CARTON": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration / Contamination (Papier et Carton)",
            "summary": "Principaux risques: migration depuis papiers/cartons recyclés (huiles minérales, photoinitiateurs, autres contaminants). PFAS dans papiers traités anti-graisse. Formaldéhyde depuis colles.",
            "details": [
              {"Source": "Papier/Carton Recyclé", "Risk": "Les papiers/cartons recyclés peuvent contenir des contaminants issus de leur usage précédent (ex: encres d'impression, adhésifs, résidus chimiques). Les huiles minérales (MOSH/MOAH) et les photoinitiateurs sont des préoccupations majeures."},
              {"Source": "Traitements Chimiques", "Risk": "Migration de substances utilisées pour donner des propriétés spécifiques au papier/carton (ex: agents anti-graisse contenant des PFAS, agents de blanchiment, azurants optiques)."},
              {"Source": "Colles et Adhésifs", "Risk": "Migration de composants des colles utilisées dans la fabrication du carton ou l'assemblage des emballages (ex: formaldéhyde, acrylamide)."},
              {"Source": "Encres d'impression", "Risk": "Migration de composants de l'encre par 'set-off' ou perméation si l'encre n'est pas sur la face extérieure ou si une barrière n'est pas présente."},
              {"Source": "Microbiologique", "Risk": "Le papier/carton peut être un substrat pour la croissance microbienne si les conditions de stockage sont humides, pouvant entraîner la production de mycotoxines."}
            ],
            "keywords": ["papier", "carton", "migration", "risque", "MOSH", "MOAH", "photoinitiateur", "PFAS", "formaldéhyde", "encre", "recyclé", "contaminant"]
          }
        }
      },
      "caoutchoucs_elastomeres": {
        "name": "Caoutchoucs et Élastomères",
        "description": "Joints, tétines, sucettes, gants.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "ARRETE_FR_2020_08_05_CAOUTCHOUC"
        ],
        "risks": [
          "RISK_MIGRATION_CAOUTCHOUCS"
        ],
        "details": {
          "ARRETE_FR_2020_08_05_CAOUTCHOUC": {
            "type": "Regulation",
            "scope": "FR",
            "name": "Arrêté FR du 5 août 2020 (Caoutchoucs et Élastomères)",
            "summary": "Réglementation française spécifique et détaillée pour les matériaux et objets en caoutchouc et les sucettes. Contient listes positives, restrictions, conditions de test et exigences DoC. Applicable depuis 1er juillet 2021.",
            "link": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042225149/",
            "keywords": ["arrêté", "france", "caoutchouc", "rubber", "liste positive", "LMS", "QMA", "test", "DoC", "2020"]
          },
          "RISK_MIGRATION_CAOUTCHOUCS": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Caoutchoucs et Élastomères)",
            "summary": "Migration d'additifs (vulcanisants, antioxydants), N-nitrosamines et substances N-nitrosables.",
            "details": "Les N-nitrosamines sont des substances potentiellement cancérigènes, leur migration est strictement limitée, notamment pour les tétines et sucettes.",
            "keywords": ["caoutchouc", "élastomère", "migration", "risque", "nitrosamine", "additif"]
          }
        }
      },
      "bois": {
        "name": "Bois",
        "description": "Utilisé pour les planches à découper, ustensiles, emballages (caisses, tonneaux).",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006"
        ],
        "risks": [
          "RISK_MIGRATION_BOIS"
        ],
        "details": {
          "RISK_MIGRATION_BOIS": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Bois)",
            "summary": "Migration de substances naturelles du bois (tanins, résines), contamination microbiologique, migration de substances issues de traitements (colles, vernis, huiles).",
            "details": "Le bois est un matériau poreux. Son utilisation doit être adaptée au type d'aliment et aux conditions de contact. Les bois traités nécessitent une attention particulière quant à la conformité des produits de traitement.",
            "keywords": ["bois", "migration", "risque", "tanin", "microbiologique", "traitement"]
          }
        }
      },
      "actifs_intelligents": {
        "name": "Matériaux Actifs et Intelligents",
        "description": "Emballages qui interagissent activement avec l'aliment ou son environnement.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "REG_450_2009"
        ],
        "risks": [
          "RISK_MIGRATION_ACTIF_INTELLIGENT"
        ],
        "details": {
          "REG_450_2009": {
            "type": "Regulation",
            "scope": "EU",
            "name": "Règlement (CE) n° 450/2009 (Matériaux Actifs et Intelligents)",
            "summary": "Règlement spécifique UE harmonisé pour les matériaux et objets actifs et intelligents destinés à entrer en contact avec des denrées alimentaires.",
            "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32009R0450",
            "keywords": ["actif", "intelligent", "harmonisé", "règlement spécifique"]
          },
          "RISK_MIGRATION_ACTIF_INTELLIGENT": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Matériaux Actifs et Intelligents)",
            "summary": "Migration des substances actives ou des indicateurs vers l'aliment. Interaction non désirée avec l'aliment.",
            "details": "Les composants actifs ou intelligents doivent être autorisés et ne pas migrer au-delà des limites de sécurité. Leur fonction ne doit pas masquer l'altération de l'aliment.",
            "keywords": ["actif", "intelligent", "migration", "risque"]
          }
        }
      },
      "cellulose_regeneree": {
        "name": "Pellicule de Cellulose Régénérée",
        "description": "Utilisée pour les emballages de confiserie, fromages, viandes.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "DIR_2007_42_CE"
        ],
        "risks": [
          "RISK_MIGRATION_CELLULOSE"
        ],
        "details": {
          "DIR_2007_42_CE": {
            "type": "Regulation",
            "scope": "EU",
            "name": "Directive 2007/42/CE (Pellicule de Cellulose Régénérée)",
            "summary": "Directive spécifique UE harmonisée pour les matériaux et objets en pellicule de cellulose régénérée destinés à entrer en contact avec les denrées alimentaires.",
            "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32007L0042",
            "keywords": ["cellulose régénérée", "film", "harmonisé", "directive"]
          },
          "RISK_MIGRATION_CELLULOSE": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Pellicule de Cellulose Régénérée)",
            "summary": "Migration de substances issues des additifs ou revêtements (ex: plastifiants, agents de surface).",
            "details": "La pellicule de cellulose régénérée est souvent traitée ou revêtue pour améliorer ses propriétés (ex: résistance à l'humidité, soudabilité). Les substances utilisées pour ces traitements doivent être conformes.",
            "keywords": ["cellulose", "migration", "risque", "additif", "revêtement"]
          }
        }
      },
      "silicones": {
        "name": "Silicones",
        "description": "Moules de cuisson, ustensiles, joints.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "ARRETE_FR_1992_11_25_SILICONE"
        ],
        "risks": [
          "RISK_MIGRATION_SILICONES"
        ],
        "details": {
          "ARRETE_FR_1992_11_25_SILICONE": {
            "type": "Regulation",
            "scope": "FR",
            "name": "Arrêté du 25 novembre 1992 (Silicones)",
            "summary": "Réglementation française relative aux matériaux et objets en silicone mis ou destinés à être mis au contact des denrées, produits et boissons alimentaires.",
            "link": "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000729000/",
            "keywords": ["arrêté", "france", "silicone"]
          },
          "RISK_MIGRATION_SILICONES": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Silicones)",
            "summary": "Migration de siloxanes cycliques (D4, D5, D6) à haute température.",
            "details": "Ces substances sont volatiles et peuvent migrer lors de la cuisson. Des limites spécifiques peuvent s'appliquer.",
            "keywords": ["silicone", "migration", "risque", "siloxane", "D4", "D5", "D6"]
          }
        }
      },
      "textiles": {
        "name": "Textiles",
        "description": "Filtres, sacs, toiles d'essuyage.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006"
        ],
        "risks": [
          "RISK_MIGRATION_TEXTILES"
        ],
        "details": {
          "RISK_MIGRATION_TEXTILES": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Textiles)",
            "summary": "Migration de colorants, apprêts, agents de finition, ou contaminants issus des fibres (naturelles ou synthétiques).",
            "details": "Les textiles peuvent être traités avec diverses substances chimiques. Leur conformité est essentielle pour éviter la contamination des aliments.",
            "keywords": ["textile", "migration", "risque", "colorant", "apprêt"]
          }
        }
      },
      "vernis_revetements": {
        "name": "Vernis et Revêtements",
        "description": "Revêtements intérieurs de boîtes métalliques, emballages papier/carton.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006",
          "REG_2018_213_BPA_VERNIS"
        ],
        "risks": [
          "RISK_MIGRATION_VERNIS_REVET"
        ],
        "details": {
          "REG_2018_213_BPA_VERNIS": {
            "type": "Regulation",
            "scope": "EU",
            "name": "Règlement (UE) 2018/213 (BPA dans Vernis et Revêtements)",
            "summary": "Règlement spécifique UE limitant l'utilisation du Bisphénol A (BPA) dans les vernis et revêtements destinés à entrer en contact avec des denrées alimentaires.",
            "link": "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32018R0213",
            "keywords": ["BPA", "bisphénol A", "vernis", "revêtement", "règlement spécifique"]
          },
          "RISK_MIGRATION_VERNIS_REVET": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Vernis et Revêtements)",
            "summary": "Migration de monomères (ex: BPA, BADGE, NOGE), solvants résiduels, photoinitiateurs.",
            "details": "L'intégrité du revêtement est cruciale. Un revêtement endommagé peut entraîner une migration accrue ou exposer le substrat.",
            "keywords": ["vernis", "revêtement", "migration", "risque", "BPA", "BADGE", "NOGE", "solvant"]
          }
        }
      },
      "verre": {
        "name": "Verre (seul)",
        "description": "Bouteilles, bocaux, verres à boire (non décorés).",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006"
        ],
        "risks": [
          "RISK_MIGRATION_VERRE"
        ],
        "details": {
          "RISK_MIGRATION_VERRE": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Verre)",
            "summary": "Migration de plomb et de cadmium pour le verre décoré. Le verre non décoré est généralement inerte.",
            "details": "Les décorations sur le verre peuvent contenir des métaux lourds. Les limites de migration sont les mêmes que pour la céramique (Directive 84/500/CEE).",
            "keywords": ["verre", "migration", "risque", "plomb", "cadmium", "décoré"]
          }
        }
      },
      "cires": {
        "name": "Cires",
        "description": "Utilisées comme revêtements ou additifs (ex: papier paraffiné, revêtements de fromage).",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006"
        ],
        "risks": [
          "RISK_MIGRATION_CIRES"
        ],
        "details": {
          "RISK_MIGRATION_CIRES": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Cires)",
            "summary": "Migration d'hydrocarbures (MOSH/MOAH) si la cire n'est pas de qualité alimentaire.",
            "details": "Les cires utilisées doivent être de pureté suffisante pour le contact alimentaire.",
            "keywords": ["cire", "migration", "risque", "MOSH", "MOAH"]
          }
        }
      },
      "colles": {
        "name": "Colles et Adhésifs",
        "description": "Utilisés pour assembler les emballages multicouches, étiquettes.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006"
        ],
        "risks": [
          "RISK_MIGRATION_COLLES"
        ],
        "details": {
          "RISK_MIGRATION_COLLES": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Colles et Adhésifs)",
            "summary": "Migration de monomères résiduels, solvants, ou autres composants des adhésifs.",
            "details": "Les colles ne sont pas censées être en contact direct avec l'aliment, mais la migration à travers les couches est possible. Les substances utilisées doivent être conformes.",
            "keywords": ["colle", "adhésif", "migration", "risque"]
          }
        }
      },
      "encres": {
        "name": "Encres d'Imprimerie",
        "description": "Utilisées pour imprimer les informations sur les emballages.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006"
        ],
        "risks": [
          "RISK_MIGRATION_ENCRES"
        ],
        "details": {
          "RISK_MIGRATION_ENCRES": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Encres d'Imprimerie)",
            "summary": "Migration de photoinitiateurs, solvants, pigments, ou autres composants de l'encre.",
            "details": "Le 'set-off' (transfert d'encre de la face imprimée vers la face en contact avec l'aliment) et la perméation sont les principaux mécanismes de migration. Une barrière fonctionnelle est souvent nécessaire.",
            "keywords": ["encre", "impression", "migration", "risque", "photoinitiateur", "solvant", "pigment", "set-off", "barrière fonctionnelle"]
          }
        }
      },
      "liege": {
        "name": "Liège",
        "description": "Bouchons, revêtements.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006"
        ],
        "risks": [
          "RISK_MIGRATION_LIEGE"
        ],
        "details": {
          "RISK_MIGRATION_LIEGE": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Liège)",
            "summary": "Migration de substances naturelles (tanins) ou de contaminants (TCA - trichloroanisole, responsable du 'goût de bouchon').",
            "details": "Le liège doit être traité pour éviter la contamination microbiologique et la formation de TCA.",
            "keywords": ["liège", "migration", "risque", "TCA", "goût de bouchon"]
          }
        }
      },
      "resines_echangeuses_ions": {
        "name": "Résines Échangeuses d'ions",
        "description": "Utilisées pour la purification de l'eau et d'autres liquides alimentaires.",
        "regulations": [
          "REG_1935_2004",
          "REG_2023_2006"
        ],
        "risks": [
          "RISK_MIGRATION_RESINES_ECHANGE"
        ],
        "details": {
          "RISK_MIGRATION_RESINES_ECHANGE": {
            "type": "Risk Information",
            "scope": "General",
            "name": "Risques de Migration (Résines Échangeuses d'ions)",
            "summary": "Migration de monomères résiduels ou d'impuretés issues de la fabrication de la résine.",
            "details": "Les résines doivent être de qualité alimentaire et rincées avant utilisation pour minimiser la migration.",
            "keywords": ["résine échangeuse d'ions", "migration", "risque"]
          }
        }
      }
    };

    materialsData = materialsDataComplete; // Assign the embedded data

    // Questions adapted according to the material
    const questions = {
        'plastiques_q1': {
            id: 'plastiques_q1',
            text: 'Est-ce du plastique recyclé ?',
            options: [
                { text: 'Oui', value: 'oui', next: 'plastiques_q2' },
                { text: 'Non', value: 'non', next: 'plastiques_q2' }
            ]
        },
        'plastiques_q2': {
            id: 'plastiques_q2',
            text: 'Quel est le type de plastique ?',
            options: [
                { text: 'PET (Polyéthylène Téréphtalate)', value: 'pet', next: 'food_type_question' },
                { text: 'PE (Polyéthylène)', value: 'pe', next: 'food_type_question' },
                { text: 'PP (Polypropylène)', value: 'pp', next: 'food_type_question' },
                { text: 'PVC (Polychlorure de Vinyle)', value: 'pvc', next: 'food_type_question' },
                { text: 'Autre', value: 'autre', next: 'food_type_question' }
            ]
        },
        'metaux_alliages_q1': {
            id: 'metaux_alliages_q1',
            text: 'Quel type de métal/alliage utilisez-vous ?',
            options: [
                { text: 'Acier Inoxydable', value: 'acier_inoxydable', next: 'food_type_question' },
                { text: 'Aluminium', value: 'aluminium', next: 'food_type_question' },
                { text: 'Autre Métal/Alliage', value: 'autre', next: 'food_type_question' }
            ]
        },
        'bois_q1': {
            id: 'bois_q1',
            text: 'Le bois est-il traité (vernis, colle, etc.) ?',
            options: [
                { text: 'Oui', value: 'oui', next: 'food_type_question' },
                { text: 'Non', value: 'non', next: 'food_type_question' }
            ]
        },
        'ceramiques_verre_q1': {
            id: 'ceramiques_verre_q1',
            text: 'L\'objet est-il décoré ?',
            options: [
                { text: 'Oui', value: 'oui', next: 'food_type_question' },
                { text: 'Non', value: 'non', next: 'food_type_question' }
            ]
        },
        'papier_carton_q1': {
            id: 'papier_carton_q1',
            text: 'Le papier/carton est-il recyclé ?',
            options: [
                { text: 'Oui', value: 'oui', next: 'papier_carton_q2' },
                { text: 'Non', value: 'non', next: 'papier_carton_q2' }
            ]
        },
        'papier_carton_q2': {
            id: 'papier_carton_q2',
            text: 'Le papier/carton est-il imprimé ou enduit ?',
            options: [
                { text: 'Oui', value: 'oui', next: 'food_type_question' },
                { text: 'Non', value: 'non', next: 'food_type_question' }
            ]
        },
        'food_type_question': {
            id: 'food_type_question',
            text: 'Quel est le type d\'aliment en contact ?',
            options: [
                { text: 'Aqueux', value: 'aqueux', next: 'contact_conditions_question' },
                { text: 'Acide', value: 'acide', next: 'contact_conditions_question' },
                { text: 'Gras', value: 'gras', next: 'contact_conditions_question' },
                { text: 'Sec', value: 'sec', next: 'contact_conditions_question' }
            ]
        },
        'contact_conditions_question': {
            id: 'contact_conditions_question',
            text: 'Quelles sont les conditions de contact (température, durée) ?',
            options: [
                { text: 'Courtes et Froides (< 5°C, < 30 min)', value: 'short_cold', next: 'display_results' },
                { text: 'Longues et Tempérées (> 5°C, > 30 min)', value: 'long_temperate', next: 'display_results' },
                { text: 'Haute Température (> 70°C)', value: 'high_temperature', next: 'display_results' }
            ]
        }
    };

    function populateMaterialList() {
        materialList.innerHTML = '';

        // Filter materials (exclude regulations and risks that are top-level)
        const materialKeys = Object.keys(materialsData).filter(key => {
            const item = materialsData[key];
            return item && item.name && item.description && !item.type;
        });

        materialKeys.sort((a, b) => materialsData[a].name.localeCompare(materialsData[b].name));

        materialKeys.forEach(materialKey => {
            const material = materialsData[materialKey];
            const listItem = document.createElement('li');
            listItem.textContent = material.name;
            listItem.setAttribute('data-material-key', materialKey);
            materialList.appendChild(listItem);
        });

        materialList.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', handleMaterialClick);
        });
    }

    function handleMaterialClick(event) {
        const materialKey = event.target.getAttribute('data-material-key');
        materialList.querySelectorAll('li').forEach(item => item.classList.remove('active'));
        event.target.classList.add('active');
        displayMaterialContent(materialKey);
    }

    function displayMaterialContent(materialKey) {
        currentMaterialKey = materialKey;
        contentArea.innerHTML = ''; // Clear previous content

        const material = materialsData[materialKey];
        const title = document.createElement('h2');
        title.innerHTML = `<i class="fas fa-cube"></i> ${material.name}`;
        contentArea.appendChild(title);

        if (material.description) {
            const description = document.createElement('div');
            description.className = 'info-card';
            description.innerHTML = `<p>${material.description}</p>`;
            contentArea.appendChild(description);
        }

        userSelections = {}; // Reset selections for new material
        userSelections[materialKey] = material.name; // Store selected material

        // Start the question flow based on material
        if (materialKey === 'plastiques') {
            displayQuestion('plastiques_q1');
        } else if (materialKey === 'metaux_alliages') {
            displayQuestion('metaux_alliages_q1');
        } else if (materialKey === 'bois') {
            displayQuestion('bois_q1');
        } else if (materialKey === 'ceramiques' || materialKey === 'verre') {
            displayQuestion('ceramiques_verre_q1');
        } else if (materialKey === 'papier_carton') {
            displayQuestion('papier_carton_q1');
        } else {
            // For materials without specific questions, jump to food type
            displayQuestion('food_type_question');
        }
    }

    function displayQuestion(questionId) {
        const question = questions[questionId];
        if (!question) {
            console.error('Question not found:', questionId);
            contentArea.innerHTML += '<h2>Erreur dans le questionnaire.</h2>';
            return;
        }

        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container fade-in';
        questionContainer.setAttribute('data-question-id', question.id); // Store question ID
        questionContainer.innerHTML = `
            <div class="question-title">${question.text}</div>
            <ul class="options-list"></ul>
        `;

        const optionsList = questionContainer.querySelector('.options-list');

        question.options.forEach(option => {
            const listItem = document.createElement('li');
            listItem.className = 'option-item';
            listItem.textContent = option.text;
            listItem.setAttribute('data-value', option.value); // Store option value
            listItem.addEventListener('click', () => handleAnswer(question.id, option.value, option.next));
            optionsList.appendChild(listItem);
        });

        contentArea.appendChild(questionContainer);
    }

    function handleAnswer(currentQuestionId, answerValue, nextStep) {
        userSelections[currentQuestionId] = answerValue;

        // Visually mark the selected option and disable others for the current question
        const currentQuestionContainer = contentArea.querySelector(`.question-container[data-question-id="${currentQuestionId}"]`);
        if (currentQuestionContainer) {
            const options = currentQuestionContainer.querySelectorAll('.option-item');
            options.forEach(opt => {
                opt.style.pointerEvents = 'none'; // Disable further clicks
                opt.classList.remove('active'); // Remove active from others
                if (opt.dataset.value === answerValue) {
                    opt.classList.add('active'); // Add active to selected
                }
            });
        }

        setTimeout(() => {
            if (nextStep === 'display_results') {
                displayResults();
            } else if (questions[nextStep]) {
                displayQuestion(nextStep);
            } else {
                // Fallback to display results if next step is not defined or invalid
                displayResults();
            }
        }, 300); // Small delay for visual feedback
    }

    function displayResults() {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'fade-in';
        resultsContainer.style.marginTop = '2rem';

        const material = materialsData[currentMaterialKey];
        if (!material) {
            resultsContainer.innerHTML = '<p>Erreur: Matériau non trouvé pour afficher les résultats.</p>';
            contentArea.appendChild(resultsContainer);
            return;
        }

        let resultsHtml = '<h3><i class="fas fa-clipboard-check"></i> Analyse de Conformité</h3>';

        // Helper to filter items based on user selections
        const filterItems = (items) => {
            return items.filter(itemKey => {
                const item = materialsData[itemKey];
                if (!item) return false;

                // Check material-specific conditions
                if (userSelections['plastiques_q1'] === 'oui' && item.applies_if_recycled === false) return false;
                if (userSelections['metaux_alliages_q1'] === 'acier_inoxydable' && item.applies_if_stainless_steel === false) return false;
                if (userSelections['metaux_alliages_q1'] === 'aluminium' && item.applies_if_aluminum === false) return false;
                if (userSelections['bois_q1'] === 'oui' && item.applies_if_treated === false) return false;
                if (userSelections['ceramiques_verre_q1'] === 'oui' && item.applies_if_decorated === false) return false;
                if (userSelections['papier_carton_q1'] === 'oui' && item.applies_if_recycled === false) return false;
                if (userSelections['papier_carton_q2'] === 'oui' && item.applies_if_printed_coated === false) return false;

                // Check food type impact
                const selectedFoodType = userSelections['food_type_question'];
                if (item.food_type_impact && item.food_type_impact.length > 0 && !item.food_type_impact.includes('all') && !item.food_type_impact.includes(selectedFoodType)) {
                    return false;
                }

                // Check contact conditions impact
                const selectedContactCondition = userSelections['contact_conditions_question'];
                if (item.contact_conditions_impact && item.contact_conditions_impact.length > 0 && !item.contact_conditions_impact.includes('all') && !item.contact_conditions_impact.includes(selectedContactCondition)) {
                    return false;
                }

                return true;
            });
        };

        // Display Regulations
        const applicableRegulations = filterItems(material.regulations || []);
        if (applicableRegulations.length > 0) {
            resultsHtml += `
                <div class="info-card success">
                    <h4><i class="fas fa-gavel"></i> Réglementations Applicables</h4>
                    <ul class="styled-list">
            `;
            applicableRegulations.forEach(regKey => {
                const regulation = materialsData[regKey];
                if (regulation) {
                    resultsHtml += `<li><strong>${regulation.name} (${regulation.scope})</strong>: ${regulation.summary}`;
                    if (regulation.link) {
                        resultsHtml += ` <a href="${regulation.link}" target="_blank" class="external-link"><i class="fas fa-external-link-alt"></i></a>`;
                    }
                    resultsHtml += '</li>';
                }
            });
            resultsHtml += '</ul></div>';
        }

        // Display Risks
        const applicableRisks = filterItems(material.risks || []);
        if (applicableRisks.length > 0) {
            resultsHtml += `
                <div class="info-card warning">
                    <h4><i class="fas fa-exclamation-triangle"></i> Risques Potentiels</h4>
                    <ul class="styled-list">
            `;
            applicableRisks.forEach(riskKey => {
                const risk = materialsData[riskKey];
                if (risk) {
                    resultsHtml += `<li><strong>${risk.name}</strong>: ${risk.summary}</li>`;
                }
            });
            resultsHtml += '</ul></div>';
        }

        // Display other details (migration limits, norms, etc.)
        if (material.details) {
            for (const detailKey in material.details) {
                // Only display details that are not already covered by regulations or risks
                if (material.regulations.includes(detailKey) || material.risks.includes(detailKey)) {
                    continue;
                }

                const detail = materialsData[detailKey]; // Get detail from top-level materialsData
                if (!detail) continue; // Skip if detail not found at top level

                // Apply filtering to details as well
                if (!appliesToFoodType(detail, userSelections['food_type_question']) ||
                    !appliesToContactConditions(detail, userSelections['contact_conditions_question']) ||
                    !appliesToMaterialSpecificQuestions(detail, userSelections)) {
                    continue;
                }

                resultsHtml += `
                    <div class="info-card">
                        <h4><i class="fas fa-info-circle"></i> ${detail.name}</h4>
                        <p>${detail.summary || detail.description || ''}</p>
                `;

                if (detail.details_table) {
                    resultsHtml += '<div class="table-container"><table><thead><tr>';
                    if (detail.details_table.length > 0) {
                        Object.keys(detail.details_table[0]).forEach(header => {
                            resultsHtml += `<th>${header}</th>`;
                        });
                        resultsHtml += '</tr></thead><tbody>';
                        detail.details_table.forEach(rowData => {
                            resultsHtml += '<tr>';
                            Object.values(rowData).forEach(cellData => {
                                resultsHtml += `<td>${cellData}</td>`;
                            });
                            resultsHtml += '</tr>';
                        });
                        resultsHtml += '</tbody></table></div>';
                    }
                }

                if (detail.keywords) {
                    resultsHtml += '<div class="keyword-tags">';
                    detail.keywords.slice(0, 8).forEach(keyword => {
                        resultsHtml += `<span class="keyword-tag">${keyword}</span>`;
                    });
                    resultsHtml += '</div>';
                }

                resultsHtml += '</div>';
            }
        }

        // Display selected conditions summary
        resultsHtml += `
            <div class="info-card">
                <h4><i class="fas fa-flask"></i> Conditions de Contact Saisies</h4>
                <ul class="styled-list">
                    <li><strong>Matériau:</strong> ${userSelections[currentMaterialKey]}</li>
                    <li><strong>Type d'aliment:</strong> ${userSelections['food_type_question'] || 'Non spécifié'}</li>
                    <li><strong>Conditions de contact:</strong> ${userSelections['contact_conditions_question'] || 'Non spécifié'}</li>
                </ul>
            </div>
        `;

        // Recommended actions
        resultsHtml += `
            <div class="info-card">
                <h4><i class="fas fa-tasks"></i> Actions Recommandées</h4>
                <ol class="styled-list">
                    <li>Demander la déclaration de conformité au fournisseur</li>
                    <li>Vérifier la composition du matériau selon les listes positives</li>
                    <li>Planifier les tests de migration selon les conditions d'usage</li>
                    <li>Documenter l'analyse de risque complète</li>
                    <li>Assurer la traçabilité et les bonnes pratiques de fabrication</li>
                </ol>
            </div>
        `;

        resultsContainer.innerHTML = resultsHtml;
        contentArea.appendChild(resultsContainer);
    }

    // Initial population and display
    populateMaterialList();
    // Optionally, display the welcome page or a default material on load
    // displayMaterialContent('plastiques'); // Example: load plastics by default
});