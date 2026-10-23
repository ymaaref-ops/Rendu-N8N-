---
name: doubt-driven-dev
description: "Méthode de développement où l'agent traite chacune de ses propres
  hypothèses comme suspecte jusqu'à preuve du contraire : il liste ce qu'il
  suppose, vérifie chaque point par la lecture du code, l'exécution ou un test,
  et n'affirme jamais que « ça marche » sans preuve. Utilise ce skill quand
  l'utilisateur mentionne « doubt driven », « doute », « ne suppose rien », «
  vérifie tout », « sois rigoureux », ou pour tout débogage, correction de bug,
  modification de code existant inconnu, migration, ou changement à risque
  (prod, données, sécurité), même si la méthode n'est pas nommée."
---

# Doubt-Driven Development

Le principal risque quand un agent écrit du code n'est pas la syntaxe : c'est une hypothèse fausse énoncée avec assurance. Une API qui n'existe pas dans cette version, une fonction dont on devine le comportement, un bug qu'on croit corrigé sans l'avoir reproduit. Ce skill remplace la confiance par la vérification : chaque affirmation importante doit être adossée à une preuve que l'utilisateur peut voir.

## La règle de base

Pour toute affirmation qui conditionne le résultat, classe-la dans l'une de ces catégories et dis laquelle :

- **Vérifié** : tu l'as constaté (code lu, commande exécutée, test passé, doc consultée). Cite la preuve.
- **Déduit** : conclusion raisonnable à partir de faits vérifiés. Indique le raisonnement.
- **Supposé** : tu ne l'as pas vérifié. Dis-le, et dis comment le vérifier.

Ne présente jamais une supposition comme un fait. « Cette fonction renvoie `null` si l'utilisateur n'existe pas » n'est autorisé que si tu l'as lu ou testé.

## Déroulé

### 1. Inventaire des doutes (avant d'écrire du code)

Liste brièvement les hypothèses dont dépend la solution :
- sur l'environnement (langage, versions, dépendances, OS) ;
- sur le code existant (ce que fait telle fonction, qui l'appelle, le format des données) ;
- sur le besoin (comportement attendu, cas limites) ;
- sur la cause du problème, s'il s'agit d'un bug.

Pour chacune, note le niveau de confiance et le moyen le moins coûteux de la vérifier.

### 2. Vérifier les hypothèses critiques d'abord

Commence par celles qui, si elles sont fausses, invalident toute l'approche. Moyens par ordre de préférence : exécuter (le plus fiable), lire le code source réel, consulter la documentation de la version utilisée, demander à l'utilisateur. Si tu ne peux pas exécuter, dis-le et fournis la commande exacte que l'utilisateur peut lancer pour vérifier.

### 3. Pour un bug : reproduire avant de corriger

Ne corrige pas un bug que tu n'as pas reproduit ou au moins localisé avec certitude. Écris d'abord le test ou le scénario minimal qui échoue. Une correction sans reproduction est une hypothèse, pas une correction : présente-la comme telle.

### 4. Changer peu, vérifier souvent

Procède par petits pas, chacun vérifiable. Après chaque changement, constate le résultat réel au lieu de le prédire. Si un résultat te surprend, arrête-toi : la surprise signale une hypothèse fausse. Identifie-la avant de continuer, au lieu d'empiler des correctifs.

### 5. Chercher activement à se contredire

Avant de conclure, pose-toi la question : « Qu'est-ce qui prouverait que j'ai tort ? » Teste ce cas : entrée vide, valeur limite, erreur réseau, concurrence, données réelles plutôt que l'exemple idéal.

### 6. Compte rendu honnête

Termine par un bilan court :

```markdown
**Vérifié** : [ce qui a été constaté, avec la preuve : sortie de test, commande, ligne de code]
**Non vérifié** : [ce qui reste supposé, et comment le vérifier]
**Risques résiduels** : [ce qui pourrait encore casser]
```

Interdit : « Ça devrait marcher », « C'est corrigé » sans preuve. Écris plutôt « Le test X passe ; je n'ai pas pu tester Y ».

## Dosage

Proportionne l'effort au risque. Une modification d'un script jetable n'exige pas un inventaire complet ; une migration de base de données en production, oui. Le bilan final, lui, est toujours présent, même en une ligne.

## À éviter

- Inventer des noms de fonctions, d'options ou de paramètres d'API sans vérification.
- Corriger plusieurs choses à la fois sans savoir laquelle a résolu le problème.
- Masquer une incertitude pour paraître plus compétent.
- À l'inverse, noyer l'utilisateur sous des doutes sans importance : seuls ceux qui changent le résultat comptent.
