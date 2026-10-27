const n8n_Server = languageModel({ type: '@n8n/n8n-nodes-langchain.lmChatGoogleGemini', version: 1.2, config: { name: 'N8n Server', parameters: { modelName: 'models/gemini-flash-lite-latest', options: {} }, credentials: { googlePalmApi: newCredential('Google Gemini API', 'GEMINI_CREDENTIAL_ID') }, position: [512, 208] } });

const test_manuel = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'test manuel', position: [32, -112] }
});

const r_cup_rer_les_mails = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Récupérer les mails', parameters: { operation: 'getAll', simple: false, filters: { q: '   in:inbox newer_than:2d -label:agent-traite -subject:"Récap du jour"' }, options: {} }, credentials: { gmailOAuth2: newCredential('Gmail account', 'GMAIL_CREDENTIAL_ID') }, position: [288, -16], webhookId: '13738dcf-9324-4cff-9622-1e3f6fd4b3d3' }
});

const classer_le_mail = node({
  type: '@n8n/n8n-nodes-langchain.textClassifier',
  version: 1.1,
  config: { name: 'Classer le mail', parameters: { inputText: expr('<email>\n<expediteur>{{ $json.from.text }}</expediteur>\n<objet>{{ $json.subject }}</objet>\n<contenu>{{ ($json.text || \'\').slice(0, 2000) }}</contenu>\n</email>'), categories: { categories: [{ category: 'Cours & devoirs', description: 'Mails liés aux cours : professeurs, plateformes pédagogiques, devoirs, rendus, examens, notes, emplois du temps.' }, { category: 'Administration', description: 'Mails administratifs de l\'école : scolarité, inscriptions, stages, attestations, paiements, documents officiels.' }, { category: 'Vie étudiante', description: 'Mails du BDE, des associations étudiantes et des clubs de l\'école : soirées, intégration, événements, sport, activités extra-scolaires, même s\'ils ont un ton promotionnel.' }, { category: 'Newsletters & pubs', description: 'Newsletters, publicités et offres commerciales envoyées par des entreprises ou services extérieurs à l\'école. Ne concerne pas les mails du BDE, des associations ou des événements de l\'école, qui vont dans Vie étudiante.' }] }, options: { multiClass: false, fallback: 'other', systemPromptTemplate: '<role>\nTu es un assistant qui trie les mails de la boîte e-mail scolaire d\'un étudiant.\n</role>\n<instructions>\n<goal>\nClasser chaque mail dans une seule des catégories suivantes : {categories}\n</goal>\n<context>\n- Les mails viennent de la boîte école d\'un étudiant : professeurs, administration, BDE et associations, entreprises extérieures.\n- Tu reçois seulement l\'expéditeur, l\'objet et le début du contenu (2000 caractères maximum).\n- Un mail du BDE, d\'une association ou d\'un club de l\'école va dans "Vie étudiante", même s\'il a un ton publicitaire.\n- Un mail sur un stage va dans "Administration" s\'il concerne des démarches (convention, attestation, signature), et dans "Cours & devoirs" s\'il concerne un rendu noté (rapport, soutenance).\n- Si aucune catégorie ne correspond clairement, ne force pas le choix : utilise la catégorie de repli "other".\n</context>\n<examples>\n<example_1>\n<inputs>\n<expediteur>M. Durand - j.durand@ecole-exemple.fr</expediteur>\n<objet>Rendu TP3 Bases de données - date limite vendredi</objet>\n<contenu>Bonjour à tous, je vous rappelle que le TP3 est à déposer sur la plateforme de cours avant vendredi 18h. Tout retard sera pénalisé.</contenu>\n</inputs>\n<output>Cours & devoirs</output>\n</example_1>\n<example_2>\n<inputs>\n<expediteur>Service Scolarité - scolarite@ecole-exemple.fr</expediteur>\n<objet>Convention de stage à signer avant le 15 novembre</objet>\n<contenu>Bonjour, votre convention de stage est disponible sur votre espace étudiant. Merci de la signer et de la retourner avant le 15 novembre.</contenu>\n</inputs>\n<output>Administration</output>\n</example_2>\n<example_3>\n<inputs>\n<expediteur>BDE Ecole Exemple - bde@ecole-exemple.fr</expediteur>\n<objet>Dernière chance : -50% sur les places de la soirée d\'intégration !</objet>\n<contenu>Offre flash jusqu\'à dimanche minuit ! Réserve ta place pour la soirée d\'intégration du 24 octobre à moitié prix. Places limitées !</contenu>\n</inputs>\n<output>Vie étudiante</output>\n</example_3>\n<example_4>\n<inputs>\n<expediteur>StudyBox - newsletter@studybox-mail.com</expediteur>\n<objet>Offre étudiante : 3 mois offerts sur ton abonnement</objet>\n<contenu>Profite de notre offre de rentrée : 3 mois gratuits avec ton adresse étudiante. Se désabonner de cette newsletter.</contenu>\n</inputs>\n<output>Newsletters & pubs</output>\n</example_4>\n<example_5>\n<inputs>\n<expediteur>Lucas Martin - lucas.martin.92@gmail.com</expediteur>\n<objet>Suite à notre échange</objet>\n<contenu>Salut, je reviens vers toi comme convenu. Tu peux me rappeler quand tu as un moment ?</contenu>\n</inputs>\n<output>other</output>\n</example_5>\n</examples>\n<output_format>\nPour la catégorie choisie, mets true ; pour toutes les autres, mets false. Suis exactement les instructions de format ci-dessous. N\'explique rien et renvoie uniquement le JSON.\n</output_format>\n</instructions>' } }, position: [512, -64], retryOnFail: true, waitBetweenTries: 5000, subnodes: { model: n8n_Server } }
});

const libell_Cours = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Libellé Cours', parameters: { operation: 'addLabels', messageId: expr('{{ $json.id }}'), labelIds: ['Label_8033388069744587249', 'Label_5598186670240002008'] }, credentials: { gmailOAuth2: newCredential('Gmail account', 'GMAIL_CREDENTIAL_ID') }, position: [1024, -304], webhookId: '9e83577e-2cad-45de-a1c6-06a4444c2477' }
});

const regrouper_les_mails_trait_s = merge({
  version: 3.2,
  config: { name: 'Regrouper les mails traités', parameters: { numberInputs: 5 }, position: [1568, -64] }
});

const libell_Admin = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Libellé Admin', parameters: { operation: 'addLabels', messageId: expr('{{ $json.id }}'), labelIds: ['Label_5598186670240002008', 'Label_992612316674515620'] }, credentials: { gmailOAuth2: newCredential('Gmail account', 'GMAIL_CREDENTIAL_ID') }, position: [1024, -160], webhookId: 'ee3e0458-2a10-440d-b317-41e896270f2d' }
});

const libell_Vie_tudiante = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Libellé Vie étudiante', parameters: { operation: 'addLabels', messageId: expr('{{ $json.id }}'), labelIds: ['Label_5598186670240002008', 'Label_8882427963098397010'] }, credentials: { gmailOAuth2: newCredential('Gmail account', 'GMAIL_CREDENTIAL_ID') }, position: [1024, -16], webhookId: 'c461d31f-7604-4e79-b02c-a1f55a1515a1' }
});

const libell_Newsletters = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Libellé Newsletters', parameters: { operation: 'addLabels', messageId: expr('{{ $json.id }}'), labelIds: ['Label_5598186670240002008', 'Label_3927594584244291448'] }, credentials: { gmailOAuth2: newCredential('Gmail account', 'GMAIL_CREDENTIAL_ID') }, position: [1024, 128], webhookId: '626eab05-1e02-4552-9949-d29348e246cf' }
});

const libell_v_rifier = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Libellé À vérifier', parameters: { operation: 'addLabels', messageId: expr('{{ $json.id }}'), labelIds: ['Label_5598186670240002008', 'Label_1183626852112681000'] }, credentials: { gmailOAuth2: newCredential('Gmail account', 'GMAIL_CREDENTIAL_ID') }, position: [1024, 272], webhookId: 'e8cc3aa9-4c17-46ec-a238-be08c830114b' }
});

const tous_les_jours_8h = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: { name: 'Tous les jours 8h', parameters: { rule: { interval: [{ triggerAtHour: 8 }] } }, position: [32, 64] }
});

const r_diger_le_r_cap = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: { name: 'Rédiger le récap', parameters: { jsCode: '// 1. Correspondance entre l\'identifiant de chaque libellé et son nom\nconst categories = {\n  "Label_8033388069744587249": "Cours & devoirs",\n  "Label_992612316674515620": "Administration",\n  "Label_8882427963098397010": "Vie étudiante",\n  "Label_3927594584244291448": "Newsletters & pubs",\n  "Label_1183626852112681000": "À vérifier",\n};\n\n// 2. Une liste vide par catégorie\nconst groupes = {};\nfor (const nom of Object.values(categories)) groupes[nom] = [];\n\n// 3. Les mails complets (avec objet et expéditeur) récupérés au début\nconst mailsComplets = $(\'Récupérer les mails\').all().map(item => item.json);\n\n// 4. On range chaque mail traité dans sa catégorie\nfor (const item of $input.all()) {\n  const mail = item.json;\n  const original = mailsComplets.find(m => m.id === mail.id);\n  const idCategorie = mail.labelIds.find(id => categories[id]);\n  const nomCategorie = categories[idCategorie] || "À vérifier";\n  const expediteur = original.from.value[0].name || original.from.value[0].address;\n  groupes[nomCategorie].push(`• ${original.subject} (${expediteur})`);\n}\n\n// 5. On rédige le récap\nconst total = $input.all().length;\nconst date = new Date().toLocaleDateString(\'fr-FR\', {\n  weekday: \'long\', day: \'numeric\', month: \'long\', timeZone: \'Europe/Paris\'\n});\n\nlet corps = `Bonjour,\\n\\nCe matin, ${total} mail(s) ont été triés :\\n`;\nfor (const [nom, liste] of Object.entries(groupes)) {\n  if (liste.length === 0) continue; // on n\'affiche pas les catégories vides\n  corps += `\\n${nom} (${liste.length})\\n${liste.join(\'\\n\')}\\n`;\n}\n\nreturn [{ json: { sujet: `Récap du jour – ${date}`, corps: corps } }];' }, position: [1776, -16] }
});

const envoyer_le_recap = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Envoyer le recap', parameters: { sendTo: 'votre.adresse@ecole.fr', subject: expr('{{ $json.sujet }}'), emailType: 'text', message: expr('{{ $json.corps }}'), options: { appendAttribution: false } }, credentials: { gmailOAuth2: newCredential('Gmail account', 'GMAIL_CREDENTIAL_ID') }, position: [2000, -16], webhookId: '56e88b68-dae3-4b8c-8243-479a09c990b9' }
});

const wf = workflow('TqHwppmn5Sz03A5I', "Workflow d'automatisation de traitement de mails", { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true, description: "Trie chaque matin à 8 h les mails récents de la boîte Gmail école, applique à chacun un libellé de catégorie et envoie un récapitulatif du tri. Aucun mail n'est supprimé ni archivé." });

export default wf
  .add(sticky('Étiquetage Gmail : \n\nChaque mail reçoit le libellé de sa catégorie plus le libellé technique Agent-traité. Aucune suppression, aucun archivage.', [libell_Cours, libell_Admin, libell_Vie_tudiante, libell_Newsletters, libell_v_rifier], { name: 'Sticky Note', color: 4, width: 464, height: 880, position: [864, -400] }))
  .add(test_manuel)
  .to(r_cup_rer_les_mails)
  .to(classer_le_mail)
  .add(classer_le_mail.output(0).to(libell_Cours))
  .add(classer_le_mail.output(1).to(libell_Admin))
  .add(classer_le_mail.output(2).to(libell_Vie_tudiante))
  .add(classer_le_mail.output(3).to(libell_Newsletters))
  .add(classer_le_mail.output(4).to(libell_v_rifier))
  .add(tous_les_jours_8h)
  .to(r_cup_rer_les_mails)
  .add(sticky('Déclencheurs : \n\n"Le workflow démarre tous les jours à 8 h (Schedule Trigger). Le déclencheur manuel sert uniquement aux tests."', [test_manuel, tous_les_jours_8h], { name: 'Sticky Note2', width: 224, height: 528, position: [-16, -272] }))
  .add(sticky('2. Récupération : \n\n"Gmail récupère les mails de la boîte de réception des 2 derniers jours, sans le libellé Agent-traité, pour ne jamais traiter un mail deux fois."', [r_cup_rer_les_mails], { name: 'Sticky Note3', color: '#D62495', width: 192, height: 528, position: [240, -272] }))
  .add(sticky('Classification IA : \n\n"Gemini lit l\'expéditeur, l\'objet et le début du mail, puis choisit une seule catégorie. En cas de doute, le mail part dans \'À vérifier\'."', [n8n_Server, classer_le_mail], { name: 'Sticky Note4', color: 6, width: 304, height: 656, position: [464, -288] }))
  .add(sticky('Récap : \n\nLes mails traités sont regroupés, puis un récapitulatif par catégorie est rédigé et envoyé par mail.', [regrouper_les_mails_trait_s, r_diger_le_r_cap, envoyer_le_recap], { name: 'Sticky Note5', color: 2, width: 704, height: 432, position: [1504, -160] }))
  .add(sticky('# Cahier des specs\n\n## 1. Objectif\nTrier automatiquement, une fois par jour, les mails récents de ma boîte Gmail école en leur appliquant un libellé, puis m\'envoyer un récapitulatif du tri. Aucun mail n\'est supprimé ni archivé.\n\n## 2. Déclencheurs\n- **Schedule Trigger** : exécution automatique tous les jours à 8 h.\n- **Manual Trigger** : lancement à la demande, pour les tests.\n- **Requête Gmail** : `in:inbox newer_than:2d -label:agent-traite -subject:"Récap du jour"`\n  Elle sélectionne les mails de la boîte de réception des 2 derniers jours (lus ou non), sans le libellé Agent-traite, et en excluant le récap du jour lui-même.\n\n## 3. Règles de tri\nChaque mail reçoit **une seule catégorie**, choisie par l\'IA :\n- **Cours & devoirs** : profs, plateformes de cours, rendus, notes\n- **Administration** : scolarité, inscriptions, stages, documents officiels\n- **Vie étudiante** : BDE, associations, événements\n- **Newsletters & pubs** : envois commerciaux extérieurs à l\'école\n- **À vérifier** : repli quand aucune catégorie ne convient clairement\n\nL\'IA analyse l\'expéditeur, l\'objet et les 2000 premiers caractères du mail. Chaque mail reçoit aussi le libellé technique **Agent-traite**, qui l\'empêche d\'être traité deux fois.\n\n## 4. Outils\nn8n Cloud, Schedule Trigger, Manual Trigger, Gmail (Get many messages, Add label to message, Send a message), Text Classifier avec Google Gemini, Merge, Code (JavaScript).\n\n## 5. Résultats attendus\n- Chaque mail traité porte son libellé de catégorie et le libellé Agent-traite.\n- Je reçois un mail « Récap du jour » qui liste les mails triés, classés par catégorie.\n- S\'il n\'y a aucun nouveau mail, aucun récap n\'est envoyé.\n\n## 6. Contraintes\n- Un mail n\'est traité qu\'une seule fois (libellé Agent-traite).\n- 50 mails maximum par exécution (limite par défaut du nœud Gmail).\n- Aucune action destructive : pas de suppression, pas d\'archivage.\n- Le seul mail envoyé est le récap, adressé à ma propre boîte.', [], { name: 'Cahier des specs', color: 3, width: 600, height: 1036, position: [-800, -544] }))
  .add(libell_Cours.to(regrouper_les_mails_trait_s.input(0)))
  .add(libell_Admin.to(regrouper_les_mails_trait_s.input(1)))
  .add(libell_Vie_tudiante.to(regrouper_les_mails_trait_s.input(2)))
  .add(libell_Newsletters.to(regrouper_les_mails_trait_s.input(3)))
  .add(libell_v_rifier.to(regrouper_les_mails_trait_s.input(4)))
  .add(regrouper_les_mails_trait_s)
  .to(r_diger_le_r_cap
  .to(envoyer_le_recap))
