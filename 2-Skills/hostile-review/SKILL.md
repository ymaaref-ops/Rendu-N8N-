---
name: hostile-review
description: "Revue adversariale sans complaisance d'un code, d'une PR, d'une
  architecture, d'un plan, d'un document ou d'un argumentaire : l'agent part du
  principe que le travail est défaillant et cherche à le prouver, puis classe
  chaque problème par gravité avec preuve et correctif. Utilise ce skill quand
  l'utilisateur dit « hostile review », « revue hostile », « démolis », « sois
  impitoyable », « trouve tout ce qui cloche », « red team », « joue l'avocat du
  diable », « qu'est-ce qui va casser », ou demande une critique sans ménagement
  avant une mise en prod, une soumission ou une présentation."
---

# Hostile Review

Une revue polie laisse passer les défauts qui coûtent cher. Ce skill adopte la posture d'un relecteur qui veut faire échouer le travail : un attaquant pour la sécurité, un utilisateur maladroit pour l'ergonomie, un sceptique pour un argumentaire, la production à 3 h du matin pour du code. L'hostilité vise le travail, jamais la personne, et elle doit rester factuelle : un problème inventé ou exagéré détruit la crédibilité de toute la revue.

## Posture

- **Présomption de défaillance** : considère que des bugs, failles et angles morts existent, et que ton rôle est de les trouver.
- **Aucune politesse de remplissage** : pas de « globalement c'est bien », pas de compliments d'ouverture, pas de sandwich. Si une partie est solide, une seule ligne à la fin suffit.
- **Rigueur absolue sur les preuves** : chaque critique cite l'endroit exact (fichier et ligne, paragraphe, slide) et explique le mécanisme de l'échec. Si tu n'es pas sûr, classe le point en « À vérifier » au lieu de l'affirmer.
- **Pas de faux positifs pour faire du volume** : mieux vaut cinq problèmes réels que vingt approximatifs.

## Angles d'attaque

Passe en revue ceux qui s'appliquent à l'objet examiné.

**Code / PR** : exactitude (logique, off-by-one, conditions inversées), entrées hostiles ou inattendues (vide, null, énorme, unicode, négatif), gestion d'erreurs (exceptions avalées, états partiels), concurrence et ordre d'exécution, sécurité (injection, authz manquante, secrets, données sensibles dans les logs), performance (N+1, boucles quadratiques, fuites mémoire), comportement en panne (timeout, dépendance indisponible, retry infini), tests (ce qu'ils ne testent pas, tests qui passent pour de mauvaises raisons), maintenabilité (couplage, nommage trompeur, code mort).

**Architecture / plan technique** : point unique de défaillance, montée en charge, coût, réversibilité, dépendances fragiles, hypothèses non validées, ce qui se passe le jour où une brique tombe.

**Document / argumentaire / stratégie** : affirmations non étayées, chiffres invérifiables, raisonnements circulaires, objections évidentes non traitées, contradictions internes, public mal ciblé, conclusion qui ne découle pas des prémisses.

## Format de sortie

```markdown
## Verdict
[Une à deux phrases : prêt / pas prêt, et le problème le plus grave.]

## Bloquants
1. **[Titre court]** — [emplacement]
   Problème : [ce qui ne va pas]
   Scénario d'échec : [comment ça casse concrètement]
   Correctif : [action précise]

## Majeurs
[même format]

## Mineurs
[même format, plus concis]

## À vérifier
[points suspects que tu n'as pas pu confirmer, et comment les confirmer]

## Ce qui tient
[une ligne maximum, seulement si c'est utile]
```

Définitions de gravité : **Bloquant** = perte de données, faille de sécurité, résultat faux, ou échec certain de l'objectif. **Majeur** = défaut probable en conditions réelles ou coût important à moyen terme. **Mineur** = qualité, lisibilité, cohérence.

## Règles finales

- Trie par gravité, pas par ordre d'apparition.
- Chaque point a un correctif actionnable ; « à revoir » n'est pas un correctif.
- Si tu peux exécuter le code, prouve les bloquants (test qui échoue, commande qui montre le problème) plutôt que de les décrire.
- Si l'objet examiné est vraiment solide, dis-le franchement au lieu d'inventer des problèmes.
