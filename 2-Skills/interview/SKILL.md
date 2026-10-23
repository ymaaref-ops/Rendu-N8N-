---
name: interview
description: Mène un entretien structuré avec l'utilisateur pour clarifier un
  besoin AVANT de produire quoi que ce soit (spec, fonctionnalité, projet,
  document, plan, décision). Une question à la fois, en creusant les zones
  floues, puis une synthèse validée. Utilise ce skill dès que l'utilisateur dit
  « interview-moi », « interroge-moi », « pose-moi des questions », « aide-moi à
  clarifier », « on cadre le besoin », « grill me », ou lance un projet
  ambitieux dont les exigences sont manifestement incomplètes et demande à être
  challengé avant de commencer.
---

# Interview

Le but de ce skill est de faire sortir de la tête de l'utilisateur ce qu'il sait sans l'avoir formulé : les contraintes implicites, les cas limites, les critères de réussite, les arbitrages qu'il n'a pas encore faits. Un bon entretien évite de construire la mauvaise chose. On ne produit pas le livrable pendant l'entretien : on le prépare.

## Principes

**Une seule question par message.** Une liste de dix questions se fait survoler et donne des réponses bâclées. Une question précise obtient une réponse réfléchie, et la réponse oriente la question suivante.

**Commencer large, finir précis.** Ordre recommandé, à adapter :
1. Le pourquoi : quel problème, pour qui, qu'est-ce qui se passe si on ne fait rien.
2. Le quoi : à quoi ressemble le résultat idéal, comment on saura que c'est réussi.
3. Les contraintes : délais, budget, techno imposée, existant, personnes impliquées.
4. Les cas limites et les risques : ce qui peut mal tourner, les exceptions, les utilisateurs atypiques.
5. Les arbitrages : quand deux objectifs se contredisent, lequel gagne.
6. Le hors-périmètre : ce qu'on ne fait explicitement pas.

**Creuser les réponses vagues.** « Ça doit être rapide », « simple », « robuste », « pour tout le monde » ne sont pas des réponses. Reformule en demandant un chiffre, un exemple concret ou un contre-exemple : « Rapide, c'est moins d'une seconde ou moins d'une minute ? », « Donne-moi un cas où ce ne serait pas assez simple. »

**Proposer des hypothèses plutôt que des questions ouvertes** quand c'est possible : « Je suppose que les utilisateurs sont connectés. C'est juste ? » est plus rapide à trancher que « Qui sont les utilisateurs ? ». Si un outil de questions à choix est disponible, utilise-le pour les questions fermées à 2-4 options.

**Ne pas reposer ce qui est déjà connu.** Relis la conversation et les fichiers fournis avant chaque question.

**Signaler les tensions.** Si deux réponses se contredisent, dis-le immédiatement et demande laquelle prime.

## Déroulé

1. **Ouverture** : en une ou deux phrases, reformule ce que tu as compris et annonce que tu vas poser quelques questions, une à la fois. Indique que l'utilisateur peut dire « stop » ou « assez » à tout moment.
2. **Questions** : enchaîne. Après chaque réponse, accuse réception en une ligne seulement si c'est utile (pas de « Super question ! »), puis pose la suivante.
3. **Arrêt** : arrête-toi quand les questions restantes n'ont plus d'impact sur le résultat, en général entre 5 et 12 questions selon la taille du sujet. Si l'utilisateur demande d'arrêter, arrête immédiatement et note les points encore ouverts comme hypothèses.
4. **Synthèse** : produis le récapitulatif ci-dessous et demande validation explicite.
5. **Suite** : une fois validé, propose l'étape suivante (rédiger la spec, le plan, le code…). Ne la lance pas sans accord.

## Format de la synthèse

```markdown
## Synthèse de l'entretien : [sujet]

**Objectif** : [une phrase]
**Pour qui** : [utilisateurs / parties prenantes]
**Critères de réussite** : [mesurables si possible]
**Contraintes** : [liste]
**Décisions prises** : [arbitrages tranchés pendant l'entretien]
**Hors périmètre** : [ce qu'on ne fait pas]
**Hypothèses non vérifiées** : [ce que tu as supposé sans confirmation]
**Questions ouvertes** : [ce qui reste à trancher, et par qui]
```

## À éviter

- Poser plusieurs questions dans le même message.
- Commencer à produire le livrable avant la validation de la synthèse.
- Des questions dont la réponse ne changerait rien au résultat.
- Flatter les réponses ou commenter longuement chacune d'elles.
