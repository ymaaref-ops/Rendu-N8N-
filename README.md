# Workflow d'automatisation de traitement de mails

Ce workflow n8n trie chaque matin à 8 h les mails récents de ma boîte Gmail école. Il applique à chaque mail un libellé de catégorie et un libellé technique, sans rien supprimer ni archiver. Il m'envoie ensuite un récapitulatif du tri.

Le workflow s'appelle « Workflow d'automatisation de traitement de mails » dans n8n. Les captures d'écran sont dans `1-Workflow/captures/`.

## 1. Objectif

Gagner du temps sur une boîte école qui reçoit des mails très différents : cours, administration, vie étudiante, publicités. Le workflow range chaque mail dans la bonne catégorie, pour que je retrouve l'essentiel en un coup d'œil.

## 2. Fonctionnement étape par étape

Le workflow compte 12 nœuds. Voici leur rôle, dans l'ordre.

**Étape 1 : déclenchement.** Le nœud « Tous les jours 8h » (Schedule Trigger) lance le workflow chaque jour à 8 h. Le nœud « test manuel » le lance à la demande, uniquement pour les tests.

![Déclencheurs du workflow](captures/01-declencheurs.png)

**Étape 2 : récupération des mails.** Le nœud « Récupérer les mails » (Gmail, opération *Get many messages*) cherche les mails qui répondent à ce filtre :
- `in:inbox` : seulement la boîte de réception ;
- `newer_than:2d` : reçus depuis moins de deux jours, lus ou non ;
- `-label:Agent-traité` : pas encore traités par le workflow ;
- `-subject:"Récap du jour"` : on exclut le récapitulatif lui-même.

Le nœud récupère au maximum 50 mails par exécution (limite par défaut du nœud Gmail). Le libellé `Agent-traité` garantit qu'un mail n'est traité qu'une seule fois.

![Récupération des mails](captures/02-recuperation-mails.png)

**Étape 3 : classification par l'IA.** Le nœud « Classer le mail » (Text Classifier) envoie à Google Gemini l'expéditeur, l'objet et les 2 000 premiers caractères du mail. Gemini choisit une seule catégorie parmi quatre :
- **Cours & devoirs** : professeurs, plateformes de cours, rendus, notes ;
- **Administration** : scolarité, inscriptions, stages, documents officiels ;
- **Vie étudiante** : BDE, associations, événements, même avec un ton publicitaire ;
- **Newsletters & pubs** : envois commerciaux venant de l'extérieur de l'école.

Si aucune catégorie ne convient clairement, le mail part dans la sortie de repli « Other », qui mène au libellé **À vérifier**. Le modèle Gemini est connecté via le nœud « N8n Server ».

Les instructions, les catégories et les exemples donnés à l'IA sont en français, comme mes mails.

![Classification par Gemini](captures/03-classification.png)

**Étape 4 : application des libellés.** Chaque sortie du classifieur mène à un nœud Gmail « Libellé … » (Cours, Admin, Vie étudiante, Newsletters, À vérifier). Ce nœud ajoute deux libellés au mail : sa catégorie et le libellé technique `Agent-traité`.

![Application des libellés](captures/04-libelles.png)

**Étape 5 : regroupement.** Le nœud « Regrouper les mails traités » (Merge, 5 entrées) réunit les cinq branches en un seul flux.

**Étape 6 : rédaction du récapitulatif.** Le nœud « Rédiger le récap » (Code JavaScript) range les mails par catégorie et construit le texte : nombre de mails triés, puis pour chaque catégorie non vide la liste des objets et des expéditeurs. Il ajoute la date du jour au sujet « Récap du jour – … ».

![Rédaction du récapitulatif](captures/05-recap-code.png)

**Étape 7 : envoi du récapitulatif.** Le nœud « Envoyer le recap » (Gmail, *Send a message*) envoie ce texte à ma propre boîte. S'il n'y a aucun nouveau mail, aucun récapitulatif n'est envoyé.

![Envoi du récapitulatif](captures/06-envoi-recap.png)

### Schéma du flux

```
Tous les jours 8h ─┐
                   ├─► Récupérer les mails ─► Classer le mail (Gemini)
test manuel ───────┘                              │
                 ┌──────────┬──────────┬──────────┼──────────┐
                 ▼          ▼          ▼          ▼          ▼
            Libellé     Libellé    Libellé    Libellé    Libellé
             Cours       Admin    Vie étud.  Newslett.  À vérifier
                 └──────────┴──────────┴──────────┴──────────┘
                                    ▼
                    Regrouper les mails traités (Merge)
                                    ▼
                          Rédiger le récap (Code)
                                    ▼
                          Envoyer le recap (Gmail)
```

## 3. Choix de conception

- **Un seul libellé de catégorie par mail.** La boîte reste lisible : on sait où chercher.
- **Un libellé technique `Agent-traité`.** C'est lui qui empêche de traiter un mail deux fois : il sert de filtre à chaque exécution.
- **Une fenêtre de deux jours.** Le workflow tourne chaque jour : deux jours laissent une marge si une exécution échoue, sans reprendre des mails trop anciens.
- **Une sortie « À vérifier ».** Plutôt que de forcer le classement, l'IA range dans ce libellé les mails qu'elle ne sait pas catégoriser. Je les relis moi-même.
- **Des noms en français.** Les nœuds, les catégories et les libellés sont en français, comme les mails. Les libellés Gmail sont directement lisibles.
- **Aucune action destructive.** Pas de suppression, pas d'archivage, pas d'envoi à l'extérieur. Le seul mail envoyé est le récapitulatif, à ma propre adresse.

## 4. Installation

1. Dans Gmail, crée les libellés `Agent-traité`, `Cours & devoirs`, `Administration`, `Vie étudiante`, `Newsletters & pubs` et `À vérifier`.
2. Le workflow est fourni au format TypeScript (`Workflow d'automatisation de traitement de mails.workflow.ts`, dans `1-Workflow/`). Il se déploie dans n8n avec l'outil `n8ncli` (`n8ncli push`).
3. Configure les identifiants :
   - **Gmail OAuth2** : connecte ton compte Google. Les comptes d'école bloquent parfois les applications externes ; vérifie que l'accès est autorisé.
   - **Google Gemini** : ajoute une clé API Gemini dans les identifiants du nœud « N8n Server ».
4. Dans les nœuds Gmail (« Récupérer les mails » et les cinq « Libellé … »), sélectionne les libellés de ton compte : leurs identifiants sont propres à chaque compte.
5. Dans « Envoyer le recap », remplace l'adresse de destination par la tienne.
6. Lance le workflow avec « test manuel », vérifie les libellés dans Gmail, puis active le déclencheur de 8 h.

## 5. Confidentialité et sécurité

- Le début du contenu des mails (expéditeur, objet, 2 000 premiers caractères) est envoyé à Google Gemini pour la classification. Avant d'utiliser ce workflow sur une boîte école, vérifie que le règlement de l'école l'autorise.
- Le workflow ajoute des libellés et envoie un seul mail, le récapitulatif, à ma propre boîte. Il ne supprime, n'archive et n'envoie rien d'autre.
- Les identifiants (clés API, comptes OAuth) restent dans n8n. Ils ne doivent jamais être écrits dans ce dépôt.

## 6. Limites connues

- Au maximum 50 mails sont traités par exécution. Les mails au-delà seront pris à l'exécution suivante, tant qu'ils restent dans la fenêtre de deux jours.
- Le classement dépend de la réponse de Gemini. Les cas ambigus tombent dans « À vérifier ».
- Le récapitulatif est adressé à une adresse écrite dans le nœud « Envoyer le recap ».
