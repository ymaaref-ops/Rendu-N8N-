# Tri automatique des mails de l'école avec n8n

Ce projet est un workflow n8n qui trie chaque matin les nouveaux mails de ma boîte Gmail école. Il applique à chaque mail un libellé de catégorie, sans rien supprimer, archiver ni envoyer à l'expéditeur. Il m'envoie ensuite un récapitulatif du tri par mail.

Le fichier du workflow est `1-Workflow/1er Workflow V3.json`. Les captures d'écran sont dans `1-Workflow/captures/`.

## 1. Objectif

Gagner du temps sur une boîte école qui reçoit beaucoup de mails de natures très différentes : cours, administration, vie étudiante, publicités. Le workflow range chaque mail dans la bonne catégorie, pour que je retrouve l'essentiel en un coup d'œil.

## 2. Fonctionnement étape par étape

Le workflow contient 12 nœuds. Voici leur rôle, dans l'ordre d'exécution.

**Étape 1 : déclenchement.** Le nœud « Tous les jours 8h » lance le workflow chaque jour à 8 h. Le nœud « test manuel » le lance à la demande, pour tester sans attendre.

![Déclencheurs du workflow](captures/01-declencheurs.png)

**Étape 2 : récupération des mails.** Le nœud « Récupérer les mails » (Gmail, opération *Get many messages*) cherche les mails qui répondent à ce filtre :
- `in:inbox` : seulement la boîte de réception ;
- `newer_than:2d` : reçus depuis moins de deux jours ;
- `-label:agent-traite` : pas encore traités par le workflow ;
- `-subject:"Récap du jour"` : on exclut mon propre récapitulatif.

Résultat : un mail n'est jamais traité deux fois.

![Récupération des mails](captures/02-recuperation-mails.png)

**Étape 3 : classification par l'IA.** Le nœud « Classer le mail » (Text Classifier) envoie à Google Gemini l'expéditeur, l'objet et les 2 000 premiers caractères du contenu. Gemini choisit une seule catégorie parmi quatre :
- **Cours & devoirs** : professeurs, plateformes de cours, rendus, notes ;
- **Administration** : scolarité, inscriptions, stages, attestations, paiements ;
- **Vie étudiante** : BDE, associations, événements, même avec un ton publicitaire ;
- **Newsletters & pubs** : offres commerciales venant de l'extérieur de l'école.

Si aucune catégorie ne convient, le mail part dans la sortie de repli, qui mène au libellé **À vérifier**. Le modèle est connecté via le nœud « N8n Server » (Gemini).

Les instructions données à l'IA, les catégories et les exemples sont en français. Mes mails sont en français, et le modèle reste ainsi cohérent avec eux.

![Classification par Gemini](captures/03-classification.png)

**Étape 4 : application des libellés.** Chaque sortie du classifieur mène à un nœud Gmail « Libellé … » (Cours, Admin, Vie étudiante, Newsletters, À vérifier). Ce nœud ajoute deux libellés au mail : sa catégorie, et le libellé technique **agent-traite**. Le mail reste non lu dans la boîte de réception.

![Application des libellés](captures/04-libelles.png)

**Étape 5 : regroupement.** Le nœud « Regrouper les mails traités » (Merge, 5 entrées) réunit les cinq branches en un seul flux.

**Étape 6 : rédaction du récapitulatif.** Le nœud « Rédiger le récap » (Code JavaScript) range les mails par catégorie et construit un texte : nombre de mails triés, puis pour chaque catégorie non vide la liste des objets et des expéditeurs. Il ajoute la date du jour au sujet.

![Rédaction du récapitulatif](captures/05-recap-code.png)

**Étape 7 : envoi du récapitulatif.** Le nœud « Envoyer le recap » (Gmail, *Send*) envoie ce texte par mail à mon adresse école.

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
- **Un libellé technique `agent-traite`.** C'est lui qui empêche de traiter un mail deux fois, et il sert de filtre à la recherche suivante.
- **Une fenêtre de deux jours.** Le workflow tourne chaque jour : deux jours laissent une marge si une exécution échoue, sans reprendre des mails anciens.
- **Une sortie « À vérifier ».** Plutôt que de forcer le classement, l'IA range dans ce libellé les mails qu'elle n'arrive pas à catégoriser. Je les relis moi-même.
- **Des catégories en français.** Les noms des nœuds, des catégories et des libellés sont en français, comme les mails. Les libellés Gmail sont donc directement lisibles.
- **Aucune action destructive sur les mails.** Pas de suppression, pas d'archivage, pas d'envoi au nom de la boîte école. Le seul mail envoyé est le récapitulatif, à moi-même.

## 4. Installation

1. Dans Gmail, crée les libellés `agent-traite`, `Cours & devoirs`, `Administration`, `Vie étudiante`, `Newsletters & pubs` et `À vérifier`.
2. Dans n8n, importe le fichier `1er Workflow V3.json` (menu *Import from file*).
3. Configure les identifiants :
   - **Gmail OAuth2** : connecte ton compte Google. Les comptes d'école bloquent parfois les applications externes ; vérifie que l'accès est autorisé.
   - **Google Gemini** : ajoute une clé API Gemini dans les identifiants du nœud « N8n Server ».
4. Dans chaque nœud Gmail « Libellé … » et dans « Récupérer les mails », remplace les identifiants de libellés par ceux de ton compte (ils sont propres à chaque compte Gmail).
5. Remplace l'adresse de destination du nœud « Envoyer le recap » par la tienne.
6. Lance le workflow avec « test manuel », vérifie les libellés dans Gmail, puis active le déclencheur de 8 h.

## 5. Confidentialité et sécurité

- Le contenu des mails (expéditeur, objet, début du texte) est envoyé à Google Gemini pour la classification. Avant d'utiliser ce workflow sur une boîte école, vérifie que le règlement de l'école l'autorise.
- Le workflow lit les mails et ajoute des libellés. Il ne supprime, n'archive et n'envoie aucun mail vers l'extérieur.
- Les identifiants (clés API, comptes OAuth) restent dans n8n. Ils ne doivent jamais être écrits dans ce dépôt.

## 6. Limites connues

- La recherche Gmail ne récupère pas plus de 50 mails par exécution (limite par défaut du nœud).
- Le classement dépend de la qualité de la réponse de Gemini. Les cas ambigus tombent dans « À vérifier ».
- Un mail reçu puis lu avant le passage de 8 h reste traité, car le filtre porte sur les mails non lus.
- Le récapitulatif est envoyé à une adresse écrite en dur dans le nœud « Envoyer le recap ».
