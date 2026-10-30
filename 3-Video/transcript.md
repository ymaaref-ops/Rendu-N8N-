# Transcript de la vidéo de présentation

Vidéo : [video-presentation-workflow.mp4](video-presentation-workflow.mp4) (12 min 56)

Transcription automatique de la vidéo. Seuls les termes techniques mal reconnus ont été corrigés (n8n, n8ncli, Claude Code, noms des nœuds). Le passage noté […] était inaudible.

---

**00:00** Bonsoir Lucas, j'espère que tu te portes bien, que tout roule pour toi.

**00:07** Donc voilà, on se retrouve aujourd'hui pour cette vidéo sur mon projet n8n.

**00:13** Voilà donc sans plus tarder.

**00:17** Allons-y. Donc moi, pour te parler un peu de ce que j'ai fait comme projet, j'ai choisi en fait de me baser sur ma boîte mail d'école pour en fait trier les mails.

**00:30** Voilà, donc concrètement, qu'est-ce que j'ai fait ?

**00:34** J'ai créé un workflow n8n qui en fait va se lancer chaque matin à 08h00 et qui va pouvoir en fait me trier les mails et me faire un récap de ceci.

**00:45** Tu vois, j'utilise Google Gemini pour qu'elle puisse me faire un mail de récap de ces mails.

**00:52** Voilà.

**00:54** Donc la règle de sécurité de ce workflow, c'est qu'en fait il ne supprime et n'archive aucun mail. Donc c'est une mesure de sécurité, c'est-à-dire au pire, même s'il se trompe de catégorie de mail […],

**01:08** jamais il va les supprimer, voilà.

**01:11** D'ailleurs, je l'ai pas dit dans le README, mais je le dis maintenant dans la vidéo, peut-être je vais l'ajouter dans le README : c'est que tout mon workflow est en français.

**01:19** Pourquoi ?

**01:19** Parce qu'en fait le prompt et les exemples donnés à l'IA le sont aussi.

**01:25** Ce qui permet en fait de rendre la classification plus cohérente.

**01:29** Parce que tous les mails que je vais traiter dans ma boîte mail, ils sont en français.

**01:34** Donc c'est pour ça que j'ai décidé de faire le workflow en français.

**01:38** Voilà, pour que tu saches pourquoi.

**01:41** Voilà.

**01:43** Donc le plan, c'est que mon workflow, tu vois, il est composé de 5 étapes.

**01:47** Là, juste à gauche, c'est le cahier des specs que tu pourras lire de ton côté.

**01:52** Je sais que tu l'as pas demandé, mais moi je l'ai mis quand même, on l'avait fait ensemble.

**01:57** Bref, donc voilà le workflow. Le plan, c'est en 5 étapes, et je vais t'expliquer les 5 étapes en live avec ma boîte mail pour que tu puisses voir concrètement comment ça se passe, et puis que le workflow est fonctionnel surtout.

**02:10** Voilà donc, sans plus tarder, je vais zoomer un peu.

**02:15** On va s'attaquer au déclencheur.

**02:17** Voilà, donc le workflow n8n, pardon, il commence par 2 déclencheurs. Donc on va trouver le premier.

**02:25** C'est un Manual Trigger, « test manuel ». Forcément, il s'active manuellement, c'était surtout pour la phase de test, la démo. Et en fait, celui qui marche réellement,

**02:35** bah c'est le Schedule Trigger, celui-ci, « Tous les jours 8h ».

**02:40** Voilà, il va s'activer tous les jours

**02:43** pour pouvoir faire

**02:45** un tri des mails ainsi qu'un récap, et ça je l'explique juste après.

**02:51** Voilà, donc maintenant qu'on a fait le déclencheur, on peut s'attaquer à la récupération.

**02:55** Donc voilà, je vais prendre un nœud Get many messages.

**02:58** Il s'appelle « Récupérer les mails ». En fait, Gmail ici va récupérer les mails de la boîte de réception des 2 derniers jours,

**03:07** sans le libellé Agent-Traite.

**03:08** Pourquoi ?

**03:09** Parce qu'en fait, chaque mail qui va être traité va avoir un libellé Agent-Traite.

**03:13** Donc si le mail a déjà un libellé Agent-Traite, il va pas le traiter.

**03:17** En gros, c'est mon anti-doublon.

**03:19** Donc voilà, il est très important.

**03:21** Donc ce nœud, en fait, je vais appuyer dessus.

**03:25** À l'intérieur, tu peux voir qu'il y a un filtre, comme dans la barre de recherche de la boîte de réception : `in:inbox` pour la boîte principale, `newer_than:2d` pour les mails qui datent de moins de 2 jours.

**03:40** `-label:agent-traite` : le « - », c'est pour exclure les mails qui ont ce libellé. Et `-subject:"Récap du jour"`, c'est aussi pour exclure

**03:50** les mails qui ont pour intitulé « Récap du jour », parce que c'est le mail de récap du jour, désolé je me répète, qui va m'être envoyé.

**03:59** Donc voilà, c'est pour éviter.

**04:02** C'est pour éviter une répétition, au cas où.

**04:06** J'ai pas été clair dès le début : mon automatisation, elle va me permettre en fait de mettre un libellé, de faire un tri sur les mails, et de m'envoyer un récap.

**04:17** Concrètement, voilà, ça va ressembler à ça, tu vois : Agent-Traite, suivi de la catégorie à laquelle il appartient.

**04:23** La catégorie, justement, c'est la classification IA. En fait, Gemini lit l'expéditeur, l'objet

**04:30** et le début du mail,

**04:31** puis il choisit une seule catégorie.

**04:33** En cas de doute, le mail part dans une catégorie « À vérifier ».

**04:37** Donc moi, j'ai mis 4 catégories : une « Cours & devoirs », une « Administration », une « Vie étudiante » et une autre « Newsletters & pubs ». Et enfin, un choix à côté qui s'appelle « Other », que j'ai ensuite associé à un libellé « À vérifier ».

**04:52** C'est lorsqu'en fait l'IA

**04:53** n'est pas sûre du mail, c'est-à-dire qu'elle ne sait pas dans quelle catégorie le renvoyer.

**05:00** Elle va le mettre dans « À vérifier ».

**05:03** Voilà tout ce que je lui demande de faire.

**05:08** Pardon, donc pour l'IA de Gemini,

**05:10** j'ai utilisé, comme tu nous l'avais demandé, une clé API qu'on a créée de notre côté, et surtout le Gemini Flash Lite Latest, voilà, comme tu peux voir juste ici.

**05:22** Bon, de toute façon, tu pourras le voir de ton côté.

**05:28** Ouais, voilà, là-dessus c'est good.

**05:31** Ensuite, on enchaîne sur l'étiquetage des mails.

**05:34** Bah en fait, chaque sortie est reliée du classifieur,

**05:39** bah du classifieur, elle est reliée

**05:43** à un nœud Gmail avec l'opération Add label to message, là, celui que tu vois, Add label.

**05:52** Voilà,

**05:52** chaque mail reçoit le libellé de sa catégorie, plus le libellé technique Agent-Traite. Aucune suppression et aucun archivage,

**05:59** encore une fois. Donc, en fait,

**06:03** ici,

**06:05** 2 libellés.

**06:07** Pardon, ici en fait,

**06:08** bah les mails qui vont être classés selon

**06:13** leurs catégories, tout simplement.

**06:15** Voilà, donc là tu vois que c'est en vert parce que j'ai fait une simulation tout à l'heure, moi j'en fais une tous les jours. Tu peux voir qu'il va aller dans la catégorie qui correspond, par exemple ici, là, il est dans « Newsletters & pubs », « À vérifier », « Vie étudiante ». Comme tu remarques, les récaps du jour n'ont pas de libellé Agent-Traite, normal, vu que grâce à la règle, ça évite de les retraiter.

**06:39** Tu vois, comme ici, toutes les catégories qui apparaissent sur ta gauche.

**06:43** Voilà, j'espère que je suis pas trop rapide.

**06:47** Je me suis entraîné plusieurs fois.

**06:50** Donc maintenant, on passe à la dernière étape.

**06:53** Donc là, tu peux voir en fait qu'il y a un Merge. Ce nœud Merge, en fait, il va regrouper les mails traités. En fait, le mode Append, c'est quoi ?

**07:03** Bah tu sais, en fait, il y a 5 branches qui finissent séparées, et le Merge configuré avec 5 entrées, les 5 inputs, ça va permettre de les regrouper en un seul flux. Parce que sinon,

**07:15** sans lui, je recevrais un récap

**07:18** par branche.

**07:20** Donc en fait, ce nœud, il est suivi

**07:25** d'un nœud JavaScript,

**07:27** d'un nœud Code.

**07:28** Donc on a besoin d'écrire du code pour convertir les identifiants en noms lisibles, et ensuite

**07:38** je range tout par catégorie dans le texte du mail. Voilà, tout simplement.

**07:46** Petite précision : tu vois, si une catégorie est vide, c'est-à-dire qu'au moment du classement,

**07:54** à la 2e étape, le classement du mail, ils ne trouvent rien dans la catégorie « Cours » par exemple, dans le récap il ne va pas l'écrire. Ça veut dire qu'elle ne va pas s'afficher, voilà, tout simplement.

**08:06** Ensuite, enfin, on va retrouver le nœud Gmail Send a message.

**08:09** Bah tout simplement, en fait, je vais m'envoyer à moi-même mon récap. Il envoie le récap à ma propre adresse.

**08:20** Donc,

**08:22** voilà.

**08:24** Et pour te montrer concrètement à quoi ça ressemble, ça va ressembler à ça.

**08:29** « Ce matin, 6 mails ont été triés », avec le nom de la catégorie du libellé.

**08:34** Voilà.

**08:36** Bim bim bim, ça c'était une erreur, mais bon, là je l'ai mis à jour.

**08:41** Voilà, j'utilise ça pour ma boîte depuis la semaine dernière et ça m'est très utile.

**08:46** Donc voilà, ça c'est la présentation de mon workflow.

**08:50** Donc sans plus tarder, maintenant on va aller un peu sur le terminal et je vais te faire des petites commandes.

**08:56** Voilà, donc pour que tu saches le début :

**08:58** j'étais sur OpenChamber, et après j'ai décidé d'aller sur Claude Code parce que j'ai un abonnement Claude.

**09:02** Donc je voulais tester Claude Code après avoir fait OpenChamber.

**09:05** Même si sur OpenChamber j'avais réussi à connecter mon Claude, c'était vraiment galère.

**09:09** Et sur Claude Code, c'est un peu plus simple.

**09:12** Mais bon, donc là aujourd'hui on va faire 3 commandes.

**09:16** Je m'étais dit justement qu'on allait commencer par une commande

**09:21** n8ncli. En fait, on va ramener le dossier.

**09:24** Enfin, on va ramener,

**09:25** on va ramener mon workflow n8n qui est sur le cloud, on va le mettre en local sur mon PC. Donc pour ce faire, bah on va faire tout simplement une commande :

**09:37** `n8ncli pull`.

**09:38** Voilà. Bah on va pull le workflow. Ça va peut-être prendre un peu de temps.

**09:44** Je l'avais testé tout à l'heure.

**09:53** Comme tu vois, là, dans la discussion,

**09:55** bon, ça c'était il y a plusieurs jours, mais j'avais demandé en fait si j'avais la bonne version de n8ncli, si elle était à jour.

**10:01** Il m'a dit que oui.

**10:04** D'ailleurs, parenthèse, là je suis dans le bon dossier, j'ai oublié de te présenter.

**10:08** Là, je suis dans le bon dossier : Users, yecin, OneDrive, Bureau, M1 Eugenia. En fait, sur mon bureau, c'est là où j'ai mis mon dossier n8n, même si bon, là en soi on n'en a pas besoin parce que c'est juste pour du cloud.

**10:22** Donc une fois que j'ai pull mon workflow n8n,

**10:26** je vais voir en fait s'il est valide, tout simplement. Donc on va faire un `n8ncli validate`.

**10:36** Normalement, il est censé me sortir « valid ».

**10:46** Un petit instant, voilà, « valid », comme tu peux le voir juste là à gauche. Et enfin, pour finir,

**10:54** on va passer sur un…

**10:57** bah en fait, on va juste voir si le workflow n8n est synchronisé,

**11:03** s'il est à jour avec mon PC, en fait si j'ai la bonne version. Donc on va faire un `n8ncli`…

**11:13** `status`.

**11:16** Voilà, j'ai oublié le « cli », pardon.

**11:21** `status`.

**11:24** Normalement, ça devrait dire… voilà : « No changes to push or pull ».

**11:30** Donc là, je suis bien à jour. D'ailleurs, il faut savoir que je l'ai mis sur GitHub.

**11:34** Ouais, j'ai travaillé en local.

**11:37** Après, il a exporté directement sur le cloud.

**11:39** Enfin bref, pull, push,

**11:42** la totale.

**11:42** Donc voilà. Sache que tu nous avais demandé aussi de faire un feedback sur ton cours.

**11:46** Je te l'avais déjà fait par mail, mais je voulais te dire que c'était génial, parce que le fait de travailler sur n8n, moi je trouve que c'est un outil qui est vraiment très intéressant lorsqu'on est dans l'IA et l'automatisation.

**11:56** Moi, tu vois, je te parlais de Make et de Zapier et tout.

**12:00** Donc franchement, le cours, rien que le fait que ce soit sur n8n, c'est top. Mais le fait que toi, lorsque t'en parles, tu vois, t'es vraiment passionné du truc et que tu le maîtrises,

**12:09** c'est ce qui fait qu'on se rend compte qu'il y a vraiment beaucoup de choses à faire.

**12:13** Et tu vois, le fait que tu sois ambassadeur et tout, t'as mis en place des templates, j'en ai regardé.

**12:21** Franchement, c'est top.

**12:21** Donc franchement, j'ai hâte du prochain cours avec toi.

**12:24** Je sais pas c'est quoi ton cours en M2.

**12:27** Mais voilà, ce que je t'avais demandé, c'était d'aller moins vite sur ce que tu as fait.

**12:32** Et puis même, à chaque fois tu venais nous expliquer en classe un par un, et ça c'est trop sympa.

**12:38** Donc voilà, c'est un peu mon feedback.

**12:43** C'est un peu mon feedback sur ton cours, Lucas. Merci pour ton écoute, j'espère que la vidéo sera pas trop longue.

**12:50** Je crois que j'ai un peu dépassé, mais voilà. Écoute, bonne correction et à bientôt.
