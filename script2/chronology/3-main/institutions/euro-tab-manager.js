import { updateContentDisplay } from '../content-display-manager.js';

const histoireContent = {
    rome: {
        photo: '/medias/images/euro/traite-de-rome.jpg',
        text: `Les fondations : de la CECA à la CEE

Tout commence en 1951 avec la création de la Communauté européenne du charbon et de l'acier (CECA). L'idée, proposée par le ministre français Robert Schuman, était de mettre en commun les ressources vitales (le charbon et l'acier) de la France et de l'Allemagne, rendant ainsi une nouvelle guerre entre ces deux pays "matériellement impossible."

Six pays y participent : la France, l'Allemagne de l'Ouest, l'Italie, la Belgique, les Pays-Bas et le Luxembourg. Ce fut un tel succès que, six ans plus tard, ces mêmes nations signent le traité de Rome en 1957. Ce traité donne naissance à la Communauté économique européenne (CEE), dont le principal objectif est de créer un marché commun où les biens, les services, les personnes et les capitaux peuvent circuler librement, sans entraves douanières. On l'appelle souvent le "Marché commun".

L'élargissement et la construction de l'unité

Les années qui suivent sont marquées par l'élargissement progressif. En 1973, le Royaume-Uni, l'Irlande et le Danemark rejoignent l'aventure. Puis, dans les années 80, c'est au tour de la Grèce, de l'Espagne et du Portugal. C'est le début d'une Europe à douze.

Un tournant majeur a lieu en 1986 avec l'Acte unique européen, qui relance le projet d'intégration en fixant l'objectif d'achever le marché unique pour 1993. Mais le véritable big bang se produit en 1992 avec le traité de Maastricht, qui transforme la CEE en Union européenne (UE). Ce traité ne se contente plus d'intégrer l'économie, il jette aussi les bases d'une union politique avec une politique étrangère et de sécurité commune, ainsi qu'une coopération en matière de justice et d'affaires intérieures. Il prévoit également la création d'une monnaie unique, l'euro.

L'euro et les défis du XXIe siècle

L'euro est introduit en 1999 pour les transactions bancaires et en 2002 sous forme de pièces et de billets. C'est l'un des plus grands succès de l'intégration européenne, symbolisant l'unité économique du continent.


Le 21e siècle est marqué par un élargissement sans précédent à l'Est, après la chute du mur de Berlin. En 2004, dix nouveaux pays, principalement d'Europe de l'Est, rejoignent l'UE. On passe de 15 à 25 membres, puis 27 aujourd'hui. L'UE doit faire face à de nouveaux défis : la crise financière de 2008, la crise des migrants, et plus récemment le Brexit, le départ du Royaume-Uni en 2020. Malgré ces épreuves, le projet européen continue d'évoluer, prouvant que l'unité, même imparfaite, reste une force face aux défis mondiaux.`
    },
    elargissements: {
        photo: '/medias/images/euro/elargissement-ue.jpg',
        text: `Des "Six" à la première vague d'adhésions

Au départ, la Communauté économique européenne (CEE) ne comptait que six membres fondateurs : la France, l'Allemagne de l'Ouest, l'Italie et les trois pays du Benelux (Belgique, Pays-Bas, Luxembourg). C'est ce qu'on appelait l'Europe des Six. Leur objectif était de consolider leur marché commun et d'éviter un retour des conflits.

Le premier grand tournant a lieu en 1973 avec l'adhésion du Royaume-Uni, de l'Irlande et du Danemark. C'est une étape symbolique car elle montre que le projet est attractif et dépasse le cadre initial. L'entrée du Royaume-Uni a été particulièrement difficile, car la France y a longtemps mis son veto.

L'Europe du Sud et la fin de la Guerre froide

Dans les années 1980, l'Europe s'ouvre au Sud. La Grèce rejoint la Communauté en 1981, suivie de l'Espagne et du Portugal en 1986. Ces adhésions sont importantes car elles marquent la consolidation de la démocratie dans ces pays après des périodes de dictature. L'Europe devient un espace de liberté et de paix.

La chute du mur de Berlin en 1989 et la fin de la Guerre froide ouvrent la voie à un élargissement sans précédent. En 1995, l'Autriche, la Finlande et la Suède rejoignent l'Union européenne (le nom de la CEE depuis le traité de Maastricht). Ces pays, avec une forte tradition de neutralité et une économie prospère, renforcent l'union.

Le "big bang" de 2004 et l'élargissement à l'Est

Le plus grand élargissement de l'histoire a lieu en 2004. Dix pays, principalement d'Europe de l'Est qui avaient été sous l'influence soviétique, rejoignent l'UE : la Pologne, la République tchèque, la Slovaquie, la Hongrie, la Slovénie, les pays baltes (Estonie, Lettonie, Lituanie) ainsi que Malte et Chypre. C'est un moment historique qui symbolise la réunification du continent européen et la fin de la division héritée de la Guerre froide.

Deux autres pays des Balkans, la Bulgarie et la Roumanie, les rejoignent en 2007. La Croatie devient le 28e membre en 2013.

Le Brexit : le premier départ

Après des décennies de croissance, l'Union européenne connaît son premier retrait avec le Brexit. Le Royaume-Uni, qui avait rejoint la CEE en 1973, a voté en faveur de sa sortie de l'UE lors d'un référendum en 2016. La sortie est devenue effective le 31 janvier 2020. C'est une décision lourde de conséquences, qui a relancé le débat sur l'avenir du projet européen et montre que l'unité n'est pas un acquis.`
    },
    pouvoirs: {
        photo: '/medias/images/euro/delegation-pouvoirs.jpg',
        text: `Le principe de délégation et de subsidiarité

Contrairement à un État fédéral classique, l'UE n'a pas de pouvoir "souverain" en propre sur tous les sujets. Son pouvoir repose sur un principe de délégation par les États membres. En clair, les pays de l'UE, en signant les traités, ont choisi de confier à l'Union certaines compétences pour qu'elles soient exercées en commun, parce qu'il est plus efficace de le faire à 27 plutôt que chacun de son côté.

Cette logique s'appelle la subsidiarité. C'est un principe fondamental de l'UE : l'Union n'intervient que si l'action envisagée ne peut pas être menée de manière satisfaisante au niveau national, régional ou local. C'est pourquoi l'UE ne s'occupe pas de tout, loin de là. Les États membres conservent par exemple des compétences exclusives sur leur politique intérieure, leur fiscalité, leur sécurité, etc.

Les pouvoirs de l'Union européenne

Les pouvoirs de l'UE sont principalement répartis entre trois institutions clés, souvent appelées le "triangle institutionnel" :

    La Commission européenne : C'est l'exécutif de l'UE. Elle est un peu comme le gouvernement de l'Union. Son rôle est de proposer les lois européennes (le pouvoir d'initiative législative) et de veiller à leur bonne application. Les commissaires sont indépendants et ne représentent pas leur pays d'origine.

    Le Parlement européen : Il représente les citoyens européens. C'est la seule institution de l'UE élue au suffrage universel direct. Il partage le pouvoir de faire la loi (le pouvoir législatif) avec le Conseil de l'Union européenne. Il a aussi un pouvoir de contrôle sur la Commission et le budget de l'UE.

    Le Conseil de l'Union européenne : Il représente les gouvernements des États membres. Chaque ministre y défend les intérêts de son pays. C'est l'autre moitié du pouvoir législatif. Il est l'institution où les États membres négocient et votent les lois proposées par la Commission.

Pour que l'UE puisse adopter une loi, il faut généralement que le Conseil et le Parlement se mettent d'accord, ce qui assure un équilibre entre la représentation des citoyens et celle des États. C'est un système de codécision. Le pouvoir judiciaire est quant à lui assuré par la Cour de justice de l'Union européenne (CJUE), qui s'assure que le droit de l'UE est respecté par tous.

Pourquoi une délégation ?

La délégation de ces pouvoirs n'est pas un abandon de souveraineté, mais une mise en commun pour des objectifs précis. Par exemple, pour l'environnement, la lutte contre la pollution ne peut pas se faire à l'échelle d'un seul pays. Il faut une action coordonnée. De même, un marché unique n'est possible que si les États acceptent de déléguer la régulation des échanges commerciaux à l'UE. En résumé, les États gardent leurs pouvoirs, mais ils délèguent une partie de leur souveraineté pour agir de manière plus efficace et puissante sur la scène mondiale.

`
    }
};

const institutionContent = {
    etats_souverains: {
        photo: '/medias/images/euro/ETATSUE.jpg',
        text: `Une union d'États souverains

L'Union européenne n'est pas un État fédéral comme les États-Unis, ni une simple organisation internationale. Elle se situe à un niveau unique, souvent qualifié de "supranational", où des États souverains ont choisi de transférer une partie de leurs pouvoirs de décision pour agir ensemble. Ce n'est pas un abandon de souveraineté, mais une mise en commun. Les États restent les "maîtres des traités" : sans leur accord unanime, rien ne peut changer dans les textes fondateurs de l'Union. Ce principe se reflète dans l'existence du Conseil européen, qui réunit les chefs d'État ou de gouvernement des 27 pays membres. C'est l'instance politique suprême, qui définit les grandes orientations et priorités de l'Union, et qui montre que les pays gardent un rôle central et puissant dans la direction de l'UE.

Un autre principe clé est la subsidiarité. Il signifie que les décisions doivent être prises au niveau le plus bas possible et le plus proche du citoyen. L'UE n'intervient que si une action est plus efficace à l'échelle européenne qu'à l'échelle nationale. Par exemple, la lutte contre le changement climatique ou la régulation du marché unique sont des domaines où l'action commune est indispensable. À l'inverse, l'éducation, la santé ou la culture relèvent presque exclusivement des compétences nationales.

Le processus de prise de décision est un bon exemple de cet équilibre : la Commission européenne propose les textes de loi, mais pour qu'ils soient adoptés, ils doivent être approuvés par les gouvernements nationaux (au sein du Conseil de l'Union européenne) et par le Parlement européen, qui représente directement les citoyens. Cette double validation assure que les lois européennes reflètent à la fois les volontés des États et celles des peuples.`
    },
    separation_pouvoirs: {
        photo: '/medias/images/euro/instiue.jpg',
        text: `Des institutions reposant sur la séparation des pouvoirs

Le fonctionnement de l'UE s'inspire du modèle démocratique de la séparation des pouvoirs, avec des institutions distinctes qui exercent des fonctions différentes, créant un système d'équilibre et de contrôle mutuel.

Le pouvoir législatif, c'est-à-dire le pouvoir de faire la loi, est partagé. Il n'appartient pas à une seule institution. D'un côté, nous avons le Parlement européen, directement élu par les citoyens tous les cinq ans. Il représente le peuple de l'Union. De l'autre, le Conseil de l'Union européenne, qui réunit les ministres des gouvernements nationaux. Il représente les États membres. Pour qu'une loi européenne soit adoptée, il faut qu'un accord soit trouvé entre ces deux institutions. On appelle ce mécanisme la codécision. Le Parlement et le Conseil peuvent amender et rejeter les propositions de la Commission, assurant ainsi un contrôle démocratique sur la législation.

Le pouvoir exécutif est principalement incarné par la Commission européenne. Elle agit comme le "gouvernement" de l'UE, mais avec des prérogatives limitées. Son rôle principal est d'avoir l'initiative législative : elle propose les projets de loi. Elle est également la "gardienne des traités", chargée de veiller à ce que les États membres et les entreprises respectent le droit de l'Union. Les commissaires sont nommés par les États membres mais doivent être approuvés par le Parlement européen.

Enfin, le pouvoir judiciaire est exercé par la Cour de justice de l'Union européenne (CJUE), basée à Luxembourg. Elle garantit l'interprétation et l'application uniforme du droit européen dans tous les pays membres. Elle peut sanctionner les États qui ne respectent pas leurs obligations et les particuliers ou entreprises qui enfreignent les règles de l'UE. Ses arrêts ont force de loi pour tous les pays membres, ce qui assure une cohérence juridique essentielle au bon fonctionnement du marché unique.`
    },
    champ_action: {
        photo: '/medias/images/euro/competences.jpg',
        text: `Le champ d'action de la politique européenne

Le champ d'action de l'Union européenne est vaste, mais il n'est pas illimité. Il est strictement encadré par les traités fondateurs, qui définissent les domaines de compétences. L'UE exerce des compétences exclusives dans certains domaines, où seule l'Union peut légiférer et adopter des actes contraignants. C'est le cas pour la politique commerciale commune (négocier les accords commerciaux avec les pays tiers) et les règles de concurrence sur le marché unique.

Dans d'autres domaines, les compétences sont partagées entre l'UE et les États membres. Cela signifie que l'UE et les pays peuvent tous deux légiférer, mais que les États ne peuvent le faire que si l'UE n'a pas encore exercé sa compétence ou a décidé de ne pas le faire. C'est le cas pour la politique de l'environnement, les transports, la protection des consommateurs ou l'agriculture. L'UE a ainsi mis en place une Politique agricole commune (PAC), qui gère la production agricole et le soutien aux agriculteurs à l'échelle européenne.

Enfin, l'UE dispose d'un pouvoir d'appui, de coordination et de complémentarité dans des domaines où la responsabilité principale reste aux États. C'est le cas de l'éducation, de la santé publique, du tourisme ou de la culture. L'UE peut par exemple financer des programmes d'échange comme Erasmus+ pour les étudiants ou des projets culturels, mais sans pouvoir imposer des programmes scolaires nationaux.

Sur les questions de politique étrangère et de sécurité, le pouvoir est surtout intergouvernemental. Les décisions sont prises à l'unanimité par le Conseil, ce qui donne à chaque État un droit de veto et limite la capacité d'action de l'UE sur la scène internationale. Néanmoins, l'UE a développé une politique étrangère de plus en plus visible, avec la nomination d'un Haut représentant et le développement de positions communes sur les crises mondiales.`
    }
};

const euroConseilContent = {
    haute_politique: {
        photo: '/medias/images/euro/conseileuro.jpg',
        text: `Le Conseil européen : l'instance de la haute politique

Le Conseil européen n'est pas à confondre avec le Conseil de l'Union européenne. C'est l'institution politique suprême de l'UE, qui incarne le leadership et la vision à long terme de l'Union. Il se compose des chefs d'État ou de gouvernement des 27 pays membres, du président du Conseil européen et du président de la Commission européenne. Le Haut représentant de l'Union pour les affaires étrangères et la politique de sécurité participe également à ses travaux. Le Conseil européen se réunit au moins quatre fois par an pour des sommets, mais des réunions extraordinaires peuvent être convoquées en cas de crise majeure. Il est la voix collective des États membres et le lieu où se forgent les grands consensus politiques. C'est ici que sont définies les priorités et les orientations générales de la politique de l'UE.

Le Conseil européen agit comme une boussole pour l'Union. Il ne légifère pas, c'est-à-dire qu'il ne vote pas les lois, mais il donne l'impulsion et la direction politique nécessaires. Ses décisions, prises par consensus, orientent le travail des autres institutions. C'est à lui que l'on doit les grandes initiatives, comme le Pacte vert pour l'Europe, les plans de relance économique ou la réponse aux crises géopolitiques. Ses conclusions sont des feuilles de route pour la Commission européenne, le Conseil de l'Union européenne et le Parlement européen. C'est un forum de négociation au plus haut niveau, où les leaders nationaux confrontent leurs visions pour trouver un terrain d'entente. La présidence du Conseil européen est assurée par une personne élue pour un mandat de deux ans et demi, qui organise les travaux et assure la continuité de l'action.`
    },
    missions_crises: {
        photo: '/medias/images/euro/criseeuro.jpg',
        text: `Les missions stratégiques et la gestion des crises

Le Conseil européen a trois missions principales. La première est de définir les orientations stratégiques de l'Union. Il identifie les défis à long terme (changement climatique, numérique, migration, sécurité) et définit la réponse européenne. Par exemple, c'est le Conseil européen qui a donné son feu vert pour le lancement de l'euro ou pour l'élargissement de l'Union aux pays d'Europe de l'Est. Il s'agit de décisions politiques majeures qui engagent l'avenir du projet européen.

La deuxième mission est la gestion des crises. Le Conseil européen est l'instance de dernier recours en cas de crise grave, qu'elle soit financière (crise de la dette souveraine de 2008), sanitaire (pandémie de Covid-19) ou géopolitique (guerre en Ukraine). Lors de ces sommets d'urgence, les dirigeants se réunissent pour trouver des solutions communes, coordonner leurs réponses et afficher une position unie. C'est dans ces moments que l'Union prouve sa capacité à être unie face à l'adversité.

La troisième mission est le développement de la politique étrangère et de sécurité commune (PESC). Le Conseil européen définit les lignes directrices de la PESC, en fixant les objectifs stratégiques de l'UE sur la scène internationale. Il prend les décisions importantes en matière de sanctions, d'opérations de maintien de la paix ou de relations avec les partenaires clés. Bien que cette politique repose en grande partie sur l'unanimité des États membres, le Conseil européen est l'instance qui permet d'afficher une voix européenne commune face au reste du monde.`
    },
    role_central: {
        photo: '/medias/images/euro/CEPW.jpg',
        text: `Un rôle central dans l'architecture institutionnelle

Le Conseil européen joue un rôle central dans l'équilibre des pouvoirs de l'UE. Il est le point de connexion entre les intérêts nationaux et l'agenda européen. Ses décisions, bien qu'elles ne soient pas des lois, ont une autorité politique immense et sont respectées par les autres institutions. Le Conseil de l'Union européenne, composé des ministres, s'appuie sur les conclusions du Conseil européen pour négocier et adopter les textes législatifs. De son côté, la Commission européenne prépare ses propositions législatives et ses plans d'action en se basant sur les orientations définies par les chefs d'État.

Ce rôle de "chef d'orchestre" est crucial. C'est le Conseil européen qui a la responsabilité d'arbitrer les désaccords entre les États et de donner une impulsion politique aux grands chantiers de l'UE, tels que l'approfondissement de l'union économique et monétaire ou les discussions sur la future architecture de défense européenne. Il est la preuve que l'Union européenne, malgré son caractère supranational, reste profondément ancrée dans la volonté des États qui la composent. Le fonctionnement du Conseil européen montre que, même si les États ont délégué une partie de leurs pouvoirs, ils continuent de diriger la destinée de l'Union. Le président du Conseil européen, en particulier, joue un rôle clé en médiateur et en représentant l'UE à l'international au niveau des chefs d'État.`
    }
};

const commissionContent = {
    pouvoir_executif: {
        photo: '/medias/images/euro/eurocomm.jpg',
        text: `La Commission européenne : le pouvoir exécutif de l'UE

La Commission européenne est l'organe exécutif de l'Union européenne. Elle est souvent comparée à un gouvernement de l'Union. Son siège est à Bruxelles. Elle est composée de 27 commissaires, un par État membre, et est dirigée par un président. Les commissaires ne représentent pas leur pays d'origine, mais l'intérêt général de l'UE. Ils sont indépendants et n'acceptent pas d'instructions des gouvernements nationaux. La Commission a trois fonctions principales : proposer des lois, gérer les politiques et le budget de l'UE, et veiller à l'application du droit européen. C'est l'institution qui fait avancer le projet européen au quotidien.`
    },
    role_legislatif: {
        photo: '/medias/images/euro/prodir.jpg',
        text: `Un rôle central dans le processus législatif et la gestion du budget

La Commission européenne est au cœur du processus de prise de décision de l'UE. Son pouvoir d'initiative législative lui confère un rôle stratégique. En proposant les lois, elle façonne l'agenda politique de l'Union. C'est elle qui propose des règlements (lois directement applicables) et des directives (lois qui doivent être transposées en droit national). Ses propositions doivent être approuvées par le Parlement et le Conseil pour devenir des lois. Ce processus est un équilibre des pouvoirs unique en son genre. La Commission a le pouvoir de proposition, mais elle ne peut pas légiférer seule.

En tant qu'organe exécutif, la Commission est également responsable de la gestion des fonds européens. Elle met en œuvre les politiques communes, gère les subventions et supervise les projets financés par le budget de l'UE. Par exemple, la Commission gère le Plan de relance "NextGenerationEU", qui vise à soutenir la transition verte et numérique de l'Europe. Cette fonction de gestion financière et de mise en œuvre fait d'elle un acteur majeur dans le développement économique et social des régions européennes.

La Commission joue aussi un rôle de représentation extérieure de l'UE sur les questions économiques et commerciales. Elle négocie les accords commerciaux au nom de l'Union. Elle est la porte-parole de l'UE au sein d'organisations internationales comme l'Organisation mondiale du commerce (OMC). Ce rôle permet à l'UE de parler d'une seule voix sur la scène internationale, ce qui lui donne un poids bien supérieur à celui de chaque État membre pris individuellement.`
    },
    role_president: {
        photo: '/medias/images/euro/VONDERL.jpg',
        text: `Le rôle spécifique du président de la Commission

Le président de la Commission est la figure de proue de l'institution. C'est lui ou elle qui donne l'impulsion politique et assure le leadership. Le président est proposé par le Conseil européen, en tenant compte des résultats des élections européennes, puis il est élu par le Parlement européen. Ce processus de nomination est un équilibre entre l'influence des États et la légitimité démocratique du Parlement. Le président de la Commission a un rôle crucial : il définit les orientations politiques de son mandat, nomme les commissaires (en accord avec les États membres), et répartit les portefeuilles entre eux. Il a un pouvoir d'influence considérable sur l'ensemble de l'institution.

Le président de la Commission joue un rôle de médiateur et de négociateur. Il est à la fois l'interlocuteur privilégié des chefs d'État et de gouvernement, avec qui il entretient des relations étroites, et la voix de l'UE sur la scène internationale, aux côtés du président du Conseil européen. Il représente l'UE lors des sommets du G7 ou du G20. Il est le visage de l'Europe aux yeux du monde.

Enfin, le président de la Commission est le garant de la cohérence et de l'efficacité de l'exécutif européen. Il assure la coordination entre les différents commissaires et veille à ce que les politiques de l'UE soient menées de manière efficace. Il est responsable devant le Parlement européen, qui peut le censurer et le contraindre à la démission, lui et son équipe. C'est une garantie démocratique essentielle qui assure la redevabilité de la Commission aux citoyens européens.`
    }
};

const conciliumContent = {
    voix_etats: {
        photo: '/medias/images/euro/conseilue.jpg',
        text: `Le Conseil de l'Union européenne : la voix des États membres

Le Conseil de l'Union européenne, souvent appelé simplement "le Conseil", est l'institution où siègent les ministres des gouvernements des États membres. Il ne faut pas le confondre avec le Conseil européen, qui réunit les chefs d'État ou de gouvernement, ni avec le Conseil de l'Europe, qui est une organisation distincte de l'UE. Le rôle du Conseil de l'Union européenne est de représenter les intérêts des États membres dans le processus législatif européen. C'est l'un des deux co-législateurs de l'UE, avec le Parlement européen. Il est la preuve que les gouvernements nationaux continuent de jouer un rôle central dans la prise de décision de l'Union.

Le Conseil de l'UE n'est pas une seule entité, mais se réunit en dix formations différentes, en fonction du sujet traité. Par exemple, le "Conseil Agriculture et Pêche" réunit les ministres de l'Agriculture des 27 pays, tandis que le "Conseil Économie et Finances (Ecofin)" rassemble les ministres des Finances. Ces formations se réunissent régulièrement pour négocier, adopter et amender les lois proposées par la Commission européenne. Les décisions sont prises, le plus souvent, à la majorité qualifiée, ce qui signifie qu'un certain nombre de pays représentant une certaine proportion de la population européenne doivent voter en faveur d'un texte pour qu'il soit adopté.

Le Conseil de l'UE partage le pouvoir législatif avec le Parlement européen. Aucune loi européenne majeure ne peut être adoptée sans son approbation. Son rôle de co-législateur lui donne un pouvoir considérable dans le façonnement des politiques de l'UE, et il est le lieu où les compromis sont recherchés entre les différentes visions nationales. C'est ici que les intérêts de la France, de l'Allemagne, de l'Espagne, etc., sont défendus et harmonisés.`
    },
    missions_decision: {
        photo: '/medias/images/euro/conseilue2.jpg',
        text: `Missions et processus de décision

Les missions du Conseil de l'Union européenne sont variées. La première est, comme nous l'avons vu, de négocier et d'adopter les actes législatifs européens, souvent en partenariat avec le Parlement. C'est une tâche colossale qui couvre tous les domaines de la politique européenne, du commerce à l'environnement. Le Conseil et le Parlement peuvent amender les propositions de la Commission, et un processus de "navette" a lieu entre les deux institutions pour parvenir à un accord sur le texte final.

Deuxièmement, le Conseil est responsable de l'approbation du budget de l'UE conjointement avec le Parlement. Il détermine les dépenses et les recettes de l'Union pour l'année à venir, et il est l'un des gardiens de la bonne gestion des deniers publics. Il joue un rôle de contrôle financier, en veillant à ce que les ressources européennes soient utilisées de manière efficace et responsable.

Troisièmement, le Conseil de l'UE coordonne les politiques économiques et sociales des États membres. Il s'assure que les gouvernements travaillent ensemble pour atteindre des objectifs communs, comme la croissance économique ou la création d'emplois. Par exemple, c'est au sein du Conseil qu'ont lieu les discussions sur les réformes structurelles nécessaires pour la zone euro, afin d'assurer sa stabilité.

Enfin, le Conseil a un rôle important dans la politique étrangère et de sécurité commune (PESC). Dans cette formation, les ministres des Affaires étrangères prennent des décisions en matière de politique étrangère, par exemple en imposant des sanctions à des pays tiers ou en définissant une position commune sur une crise internationale. C'est dans ce domaine que les décisions sont souvent prises à l'unanimité, ce qui donne à chaque État un droit de veto.`
    },
    presidence_tournante: {
        photo: '/medias/images/euro/conseilue3.jpg',
        text: `Le système de la présidence tournante

Le Conseil de l'Union européenne est un exemple parfait du fonctionnement de la démocratie représentative au niveau européen. Il assure que les lois européennes sont non seulement acceptées par les citoyens via leurs représentants au Parlement, mais aussi par leurs gouvernements nationaux. Le système de la présidence tournante est une caractéristique unique de cette institution. Chaque État membre assume à tour de rôle la présidence du Conseil pendant une période de six mois. C'est une responsabilité majeure qui permet à chaque pays, même les plus petits, de diriger l'agenda de l'UE pour une courte période.

Le pays qui assure la présidence est responsable de l'organisation et de la présidence des réunions du Conseil à tous les niveaux. Il doit aussi agir en tant que médiateur impartial pour faciliter les négociations et trouver des compromis entre les États membres sur les textes législatifs. C'est un rôle exigeant qui requiert une grande capacité de négociation et de coordination. La présidence tournante assure une certaine équité entre les États membres et leur donne l'opportunité d'influer directement sur les priorités européennes.

La complexité du Conseil de l'UE, avec ses différentes formations et son système de vote à la majorité qualifiée, est un reflet de la nature même de l'Union : une union unique de démocraties souveraines. Le Conseil montre que l'UE n'est pas une entité lointaine, mais un lieu de dialogue et de compromis permanent entre les gouvernements nationaux. Il est l'institution qui assure le lien constant entre l'échelon européen et les réalités politiques nationales.`
    }
};

const parlementContent = {
    voix_citoyens: {
        photo: '/medias/images/euro/electioneuro24.jpg',
        text: `Le Parlement européen : la voix des citoyens

Le Parlement européen est l'unique institution de l'Union européenne directement élue par les citoyens. C'est l'organe législatif et de contrôle démocratique de l'UE. Ses membres, appelés députés européens, sont élus tous les cinq ans au suffrage universel direct dans les 27 États membres. Le Parlement se réunit en session plénière à Strasbourg et organise ses commissions et réunions de groupes politiques à Bruxelles. Le nombre de députés par pays est proportionnel à sa population, ce qui donne plus de poids aux États les plus peuplés comme l'Allemagne ou la France, tout en assurant une représentation minimale pour les plus petits pays. Cette légitimité démocratique confère au Parlement un rôle essentiel dans le processus de décision de l'Union, le distinguant du Conseil de l'Union européenne qui représente les gouvernements.

Le rôle du Parlement européen a considérablement évolué au fil des ans, passant d'un simple organe consultatif à un véritable co-législateur. Aujourd'hui, il partage le pouvoir législatif sur un pied d'égalité avec le Conseil de l'Union européenne. Les propositions de la Commission européenne doivent être approuvées par les deux institutions pour devenir des lois. Ce processus de codécision est le cœur de la démocratie de l'UE : les citoyens, via leurs députés, et les États, via leurs ministres, doivent s'entendre pour faire avancer l'Union. Le Parlement est donc un lieu de débat politique intense, où les différents groupes politiques (sociaux-démocrates, libéraux, écologistes, etc.) défendent leurs positions sur les textes législatifs. Il est aussi un espace de dialogue et de compromis, où les députés travaillent en commission pour amender et négocier les textes avant leur vote en session plénière.`
    },
    missions_legislatives: {
        photo: '/medias/images/euro/parlement.jpg',
        text: `Les missions législatives et budgétaires

La première mission du Parlement européen est d'être un co-législateur. Il vote les règlements et les directives européens dans la quasi-totalité des domaines de la politique de l'UE. Le Parlement dispose d'un pouvoir d'amendement des textes proposés par la Commission. Son rôle ne se limite pas à approuver, il peut aussi les rejeter. Il est d'ailleurs le seul à pouvoir voter une motion de censure à l'encontre de la Commission, ce qui la forcerait à démissionner collectivement. Ce pouvoir de contrôle est le garant de la responsabilité de l'exécutif européen devant les représentants des citoyens.

La deuxième grande mission du Parlement est l'adoption du budget de l'UE, conjointement avec le Conseil de l'Union européenne. Le Parlement a le pouvoir d'amender et de voter le budget annuel, et il est responsable de la supervision de son exécution. Il doit s'assurer que les fonds européens sont bien gérés et qu'ils sont utilisés de manière efficace et transparente pour financer les politiques de l'UE, des subventions agricoles aux programmes de recherche.

La troisième mission est le contrôle démocratique des autres institutions de l'UE. Le Parlement a le pouvoir d'approuver ou de rejeter la nomination du président de la Commission et de l'ensemble du collège des commissaires. Chaque candidat commissaire doit se présenter devant une commission parlementaire pour une audition. Ce processus garantit que les personnes qui dirigent la Commission ont la confiance des représentants des citoyens. Le Parlement peut également poser des questions à la Commission, organiser des débats sur l'état de l'Union et créer des commissions d'enquête pour faire la lumière sur des sujets d'intérêt public.`
    },
    role_politique: {
        photo: '/medias/images/euro/parlementaires.jpg',
        text: `Un rôle politique et un lien avec les citoyens

Au-delà de ses fonctions législatives et budgétaires, le Parlement européen joue un rôle politique essentiel. Il est la tribune où les grands débats sur l'avenir de l'Europe ont lieu. Il représente la diversité des opinions politiques des citoyens européens et il est le lieu où les partis politiques nationaux se regroupent en familles politiques européennes, ce qui contribue à la formation d'une véritable sphère politique européenne.

Le Parlement joue également un rôle crucial dans les relations extérieures de l'UE. Il doit donner son accord pour que les accords commerciaux internationaux et les accords d'association soient conclus par l'Union. Cela lui permet de s'assurer que les valeurs européennes (comme les droits de l'homme ou les normes environnementales) sont respectées par les partenaires commerciaux de l'UE.

Enfin, le Parlement européen est le lien direct entre les citoyens et les institutions européennes. Il est le canal par lequel les citoyens peuvent s'exprimer et faire entendre leur voix au niveau européen. En tant que seule institution directement élue, il est le garant de la légitimité démocratique du projet européen. C'est à travers lui que les citoyens peuvent demander des comptes aux dirigeants de l'UE et influencer l'orientation de ses politiques. C'est une institution qui, par sa nature, incarne l'idéal démocratique et l'engagement des Européens à construire un avenir commun.`
    }
};

const justiceContent = {
    pouvoir_judiciaire: {
        photo: '/medias/images/euro/cjue0.jpg',
        text: `La Cour de justice de l'Union européenne : le pouvoir judiciaire de l'UE

La Cour de justice de l'Union européenne (CJUE), basée à Luxembourg, est l'institution judiciaire de l'UE. Son rôle est d'assurer le respect du droit de l'Union dans son interprétation et son application. La CJUE est composée de deux juridictions : la Cour de justice, qui traite les recours introduits par les États membres et les institutions, et le Tribunal, qui traite principalement les recours de particuliers et d'entreprises. Chaque État membre a un juge dans chaque juridiction, garantissant la représentation des systèmes juridiques nationaux. Ces juges sont nommés par les gouvernements pour un mandat de six ans renouvelable. La CJUE est une institution unique au monde, car elle a la capacité de faire appliquer le droit européen sur les États membres eux-mêmes, un pouvoir que peu d'organisations internationales possèdent.

Le rôle de la CJUE est crucial pour le bon fonctionnement de l'UE. Sans elle, les lois européennes pourraient être interprétées et appliquées différemment dans chaque pays, ce qui mettrait en péril le marché unique et l'égalité entre les citoyens. La CJUE est la gardienne de la primauté du droit de l'UE. Cela signifie que le droit européen l'emporte sur le droit national en cas de conflit. C'est un principe fondamental qui garantit l'unité juridique de l'Union. Les juges nationaux sont tenus de l'appliquer.`
    },
    missions_arrets: {
        photo: '/medias/images/euro/cjue1.jpg',
        text: `Missions et arrêts emblématiques

Les missions de la CJUE sont multiples. Sa principale mission est de trancher les litiges entre les États membres, les institutions de l'UE, les entreprises et les particuliers. Elle peut sanctionner un État qui ne respecte pas le droit de l'UE ou annuler un acte législatif européen s'il est jugé illégal. La Cour répond également à des questions préjudicielles posées par les juridictions nationales. Lorsqu'un juge national est confronté à une question d'interprétation du droit de l'UE, il peut demander à la CJUE de clarifier la règle. C'est le moyen le plus courant d'entrer en contact avec la Cour et cela garantit une interprétation uniforme du droit dans toute l'UE.

Tout au long de son histoire, la CJUE a rendu des arrêts qui ont façonné l'intégration européenne. Des affaires comme l'arrêt Cassis de Dijon (1979) ont établi le principe de la reconnaissance mutuelle des normes nationales et ont contribué à la création du marché unique. D'autres arrêts ont renforcé les droits des citoyens européens, comme l'arrêt van Gend en Loos (1963) qui a établi que les particuliers pouvaient invoquer directement le droit européen devant leurs tribunaux nationaux. Ces décisions ont eu un impact immense sur la vie des citoyens, en leur donnant le droit de travailler, de vivre et de voyager librement dans l'UE.`
    },
    role_central_justice: {
        photo: '/medias/images/euro/cjue2.jpg',
        text: `Un rôle central dans l'architecture institutionnelle

La Cour de justice joue un rôle essentiel dans l'équilibre des pouvoirs au sein de l'UE. Elle garantit que les autres institutions respectent la loi et qu'elles n'outrepassent pas leurs compétences. Elle est un contre-pouvoir indispensable à la Commission et au Conseil. En contrôlant la légalité des actes des institutions, elle assure un fonctionnement démocratique et transparent. La CJUE est aussi un acteur majeur dans l'évolution du droit européen, car ses interprétations ont souvent un effet créateur de droit, comblant les lacunes des traités et répondant aux défis contemporains.

Le rôle de la CJUE est une illustration de la nature unique de l'Union européenne. L'existence d'une Cour dotée d'un tel pouvoir est la preuve que les États membres ont accepté de se soumettre à une autorité judiciaire commune, garantissant ainsi l'état de droit à l'échelle du continent. La CJUE est le pilier sur lequel repose la confiance mutuelle des États, des entreprises et des citoyens dans le système juridique de l'UE. Elle est le dernier rempart contre l'arbitraire et le garant de l'unité juridique de l'Union. Sa légitimité est fondée sur l'autorité de la loi et la compétence de ses juges, faisant d'elle une institution respectée et essentielle au projet européen.`
    }
};

const partisContent = {
    moteur_democratie: {
        photo: '/medias/images/euro/europart0.jpg',
        text: `Les partis politiques européens : le moteur de la démocratie

Les partis politiques européens, souvent appelés europartis, sont des organisations politiques qui regroupent des partis nationaux de différents États membres partageant des idéologies similaires. Ils sont essentiels au fonctionnement de la démocratie européenne. Ils ne sont pas à confondre avec les groupes politiques du Parlement européen, qui sont des regroupements de députés, même si ces deux entités sont étroitement liées. Les europartis sont le pont entre les réalités politiques nationales et la sphère européenne. Ils permettent aux citoyens d'identifier les grandes familles politiques à l'échelle du continent et de comprendre les enjeux des élections européennes. On peut les voir comme les versions européennes des partis nationaux, créant une structure politique transnationale.

Le rôle des partis européens a été formalisé par les traités de l'UE. Ces partis ont des missions claires : contribuer à la formation d'une conscience politique européenne, exprimer la volonté des citoyens et animer la vie politique de l'Union. Lors des élections européennes, ils coordonnent les campagnes, organisent des débats et présentent des programmes communs à l'échelle du continent. En amont du scrutin, ils sélectionnent les candidats, et en 2014 et 2019, ils ont présenté des candidats têtes de liste (les Spitzenkandidaten) pour la présidence de la Commission européenne. Bien que ce système n'ait pas été formellement adopté, il a contribué à rendre la désignation du président de la Commission plus transparente et plus liée aux résultats électoraux, renforçant ainsi la légitimité démocratique du processus.`
    },
    role_parlement: {
        photo: '/medias/images/euro/europart1.jpg',
        text: `Un rôle central dans le Parlement européen

Le rôle le plus visible des europartis se situe au sein du Parlement européen. C'est là que les partis nationaux s'organisent en groupes politiques transnationaux. Chaque groupe est composé d'élus d'au moins un quart des États membres et compte au moins 23 députés. Ces groupes politiques ne sont pas de simples alliances, mais des entités structurées avec une présidence, des porte-paroles et des positions communes sur les sujets législatifs. Ils sont les acteurs principaux du processus parlementaire. Par exemple, le Groupe du Parti populaire européen (PPE, droite et centre-droit) ou le Groupe de l'Alliance progressiste des socialistes et démocrates (S&D, gauche et centre-gauche) sont les deux plus grands groupes politiques du Parlement.

C'est au sein de ces groupes que se forgent les majorités législatives. Les députés d'un même groupe votent généralement de manière coordonnée sur les projets de loi. Les grands compromis qui permettent d'adopter les lois européennes se font souvent entre les principaux groupes. Sans eux, le Parlement européen serait une assemblée fragmentée et incapable d'agir. Ils sont le moteur de la codécision, ce système qui permet au Parlement de légiférer avec le Conseil de l'Union européenne. Les présidents de ces groupes politiques jouent un rôle crucial en négociant les accords législatifs et en définissant la stratégie de leur famille politique.`
    },
    legitimite_democratique: {
        photo: '/medias/images/euro/europart2.jpg',
        text: `Une légitimité démocratique et un financement public

Pour que les partis politiques européens puissent jouer leur rôle, l'UE leur accorde une reconnaissance formelle et un financement public. Cette aide financière leur permet de financer leurs activités, leurs campagnes électorales et leurs think tanks, contribuant ainsi à l'animation du débat politique européen. Le financement est soumis à des règles strictes pour garantir la transparence et éviter les conflits d'intérêts. Cette aide est une reconnaissance du fait que ces partis sont indispensables pour la démocratie de l'Union.

Leur existence contribue à la légitimité démocratique de l'ensemble du projet européen. En offrant aux citoyens la possibilité de voter pour des listes nationales qui sont affiliées à des familles politiques européennes, les europartis rendent le processus de décision de l'UE plus lisible. Le citoyen sait que son vote pour un parti national est aussi un vote pour une certaine vision de l'Europe, représentée par un europarti. C'est un lien direct entre le niveau national et le niveau européen.

Malgré leur importance, les partis européens font face à des défis. Ils restent souvent moins connus du grand public que leurs homologues nationaux, et le débat politique européen peine parfois à se substituer aux débats nationaux. Cependant, leur rôle est appelé à croître à mesure que l'intégration européenne s'approfondit. Ils sont un pilier de la démocratie européenne, et leur bon fonctionnement est essentiel pour que l'UE continue de se rapprocher de ses citoyens.`
    }
};

const lobbiesContent = {
    acteurs_ombre: {
        photo: '/medias/images/euro/lobby0.jpg',
        text: `Les lobbies européens : les acteurs de l'ombre

Les lobbies européens, ou groupes d'intérêt, sont des organisations qui cherchent à influencer les décisions des institutions de l'Union européenne. Ils représentent une grande variété d'acteurs : des entreprises, des associations professionnelles, des ONG, des syndicats ou des régions. À Bruxelles, on estime qu'il y a plus de 25 000 lobbyistes, ce qui en fait, avec Washington, l'un des plus grands centres de lobbying au monde. Le lobbying est une pratique légale et encadrée, considérée comme une composante de la démocratie. Il permet aux institutions de l'UE d'obtenir des informations et des expertises techniques sur des sujets complexes avant de prendre des décisions. C'est un canal de communication important entre les décideurs et la société civile, bien qu'il soulève des questions de transparence et d'égalité d'accès.

Les lobbyistes européens opèrent de différentes manières. Ils participent à des consultations publiques, organisent des rencontres avec les parlementaires et les fonctionnaires de la Commission, et publient des rapports pour défendre leurs positions. Leur objectif est de faire valoir leurs intérêts dans le processus législatif, de l'élaboration d'une proposition par la Commission jusqu'à l'adoption finale par le Parlement et le Conseil. L'UE a mis en place un registre de transparence pour les groupes d'intérêt. Ce registre est une base de données publique où les lobbyistes doivent s'inscrire et déclarer leurs activités, leurs clients et leurs budgets. Il vise à rendre plus transparentes les relations entre les lobbyistes et les institutions européennes.`
    },
    role_decision: {
        photo: '/medias/images/euro/lobby1.jpg',
        text: `Un rôle central dans le processus de décision

Les lobbies sont des acteurs incontournables du processus de décision de l'UE. La Commission européenne, en particulier, les consulte régulièrement. C'est elle qui lance des consultations publiques sur ses projets de loi. Les groupes d'intérêt peuvent alors soumettre leurs analyses et leurs recommandations. De la même manière, les députés européens et les ministres nationaux reçoivent les lobbyistes pour entendre leurs arguments sur les textes législatifs en cours. Les lobbyistes sont de véritables experts sur les sujets qu'ils défendent et ils peuvent fournir des données techniques et économiques qui éclairent la prise de décision.

Par exemple, sur un sujet comme la réglementation environnementale, la Commission va consulter les entreprises du secteur (par exemple, les constructeurs automobiles), les associations de protection de l'environnement, les syndicats et les chercheurs. Leurs points de vue s'opposent souvent, et les institutions européennes doivent arbitrer entre ces intérêts divergents. Les lobbies sont souvent critiqués pour leur pouvoir d'influence, en particulier les plus puissants qui disposent de budgets conséquents et d'un grand nombre de collaborateurs. Ils peuvent peser sur les décisions en faveur de leurs intérêts, parfois au détriment de l'intérêt général. C'est pourquoi la transparence est une préoccupation majeure des institutions européennes et des citoyens.`
    },
    zoom_geants: {
        photo: '/medias/images/euro/lobby2.jpg',
        text: `Zoom sur les géants du lobbying

Certains secteurs d'activité ont une présence de lobbying particulièrement forte à Bruxelles en raison de leur poids économique et des enjeux réglementaires qui les concernent.

    Les géants de la tech : Des entreprises comme Google, Amazon, Apple et Meta sont parmi les plus grands lobbyistes à Bruxelles. Leurs budgets de lobbying se comptent en millions d'euros par an. Ils s'opposent notamment à la législation européenne sur la régulation des plateformes numériques (comme le Digital Services Act ou le Digital Markets Act), la protection des données (RGPD) ou la fiscalité. L'enjeu est de taille : il s'agit de défendre leurs modèles économiques face aux tentatives de l'UE de mieux encadrer leurs activités.

    L'agrobusiness : Le secteur agricole et alimentaire a une forte représentation, en raison de l'importance de la Politique agricole commune (PAC), qui est l'une des politiques les plus anciennes et les plus coûteuses de l'UE. Des associations comme le COPA-COGECA représentent les agriculteurs et les coopératives. Leurs activités visent à défendre les subventions agricoles et à influencer les normes environnementales et les règles de production.

    La finance et le Big Pharma : Le secteur financier, avec des acteurs comme les banques et les fonds d'investissement, est très présent pour influencer les réglementations sur les services financiers. De même, les grandes entreprises pharmaceutiques (le "Big Pharma") sont très actives. Elles cherchent à peser sur les politiques de santé, les prix des médicaments et les normes de sécurité. L'enjeu est de maintenir une réglementation favorable à leurs investissements en recherche et développement.

    L'industrie automobile : Les constructeurs automobiles, à travers leurs associations comme l'ACEA, sont des acteurs clés du lobbying. Ils cherchent à influencer les règles sur les émissions de CO2 et les normes de sécurité des véhicules. Les lobbies des énergies fossiles et du transport routier sont également très actifs pour tenter d'atténuer les réglementations climatiques de plus en plus ambitieuses de l'UE.`
    }
};

/**
 * Met à jour le contenu de l'onglet Histoire en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'rome').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateHistoireContent(selection, DOMRefs) {
    const content = histoireContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.histoirePhoto,
        textContainer: DOMRefs.histoireText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Met à jour le contenu de l'onglet Institutions en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'etats_souverains').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateInstitutionsContent(selection, DOMRefs) {
    const content = institutionContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.institutionsPhoto,
        textContainer: DOMRefs.institutionsText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Met à jour le contenu de l'onglet Conseil en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'haute_politique').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateConseilContent(selection, DOMRefs) {
    const content = euroConseilContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.conseilPhoto,
        textContainer: DOMRefs.conseilText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Met à jour le contenu de l'onglet Conseil de l'UE en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'voix_etats').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateConciliumContent(selection, DOMRefs) {
    const content = conciliumContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.conciliumPhoto,
        textContainer: DOMRefs.conciliumText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Met à jour le contenu de l'onglet Partis en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'moteur_democratie').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updatePartisContent(selection, DOMRefs) {
    const content = partisContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.partisPhoto,
        textContainer: DOMRefs.partisText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Met à jour le contenu de l'onglet Lobbies en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'acteurs_ombre').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateLobbiesContent(selection, DOMRefs) {
    const content = lobbiesContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.lobbiesPhoto,
        textContainer: DOMRefs.lobbiesText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Met à jour le contenu de l'onglet Justice en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'pouvoir_judiciaire').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateJusticeContent(selection, DOMRefs) {
    const content = justiceContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.justicePhoto,
        textContainer: DOMRefs.justiceText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Met à jour le contenu de l'onglet Parlement en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'voix_citoyens').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateParlementContent(selection, DOMRefs) {
    const content = parlementContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.parlementPhoto,
        textContainer: DOMRefs.parlementText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Met à jour le contenu de l'onglet Commission en utilisant le gestionnaire de contenu générique.
 * @param {string} selection - La clé de la sélection (ex: 'pouvoir_executif').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateCommissionContent(selection, DOMRefs) {
    const content = commissionContent[selection];
    if (!content) return;

    // Appel du gestionnaire de contenu générique
    updateContentDisplay({
        photoContainer: DOMRefs.commissionPhoto,
        textContainer: DOMRefs.commissionText,
        photoUrl: content.photo,
        text: content.text
    });
}

export function initEuroTab(DOMRefs) {
    const subNavButtons = DOMRefs.euroSubNav?.querySelectorAll('.sub-nav-btn');
    const subTabContainer = document.getElementById('euro-sub-tab-container');
    if (!subNavButtons || !subTabContainer) return;

    const subTabContents = subTabContainer.querySelectorAll('.sub-tab-content');
    const histoireMenu = DOMRefs.histoireMenu;
    const institutionsMenu = DOMRefs.institutionsMenu;
    const conseilMenu = DOMRefs.conseilMenu;
    const conciliumMenu = DOMRefs.conciliumMenu;
    const parlementMenu = DOMRefs.parlementMenu;
    const justiceMenu = DOMRefs.justiceMenu;
    const lobbiesMenu = DOMRefs.lobbiesMenu;
    const partisMenu = DOMRefs.partisMenu;
    const commissionMenu = DOMRefs.commissionMenu;

    subNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            subNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const subTabId = button.dataset.subTab + '-sub-tab';
            subTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === subTabId) {
                    content.classList.add('active');
                }
            });

            // Charger le contenu par défaut du sous-onglet nouvellement activé
            const menu = document.getElementById(`${button.dataset.subTab}-menu`);
            if (menu) {
                menu.dispatchEvent(new Event('change')); // Simule un changement pour charger le contenu
            };
        });
    });

    if (histoireMenu) {
        histoireMenu.addEventListener('change', (e) => {
            updateHistoireContent(e.target.value, DOMRefs);
        });
    }

    if (institutionsMenu) {
        institutionsMenu.addEventListener('change', (e) => {
            updateInstitutionsContent(e.target.value, DOMRefs);
        });
    }

    if (conseilMenu) {
        conseilMenu.addEventListener('change', (e) => {
            updateConseilContent(e.target.value, DOMRefs);
        });
    }

    if (conciliumMenu) {
        conciliumMenu.addEventListener('change', (e) => {
            updateConciliumContent(e.target.value, DOMRefs);
        });
    }

    if (parlementMenu) {
        parlementMenu.addEventListener('change', (e) => {
            updateParlementContent(e.target.value, DOMRefs);
        });
    }

    if (justiceMenu) {
        justiceMenu.addEventListener('change', (e) => {
            updateJusticeContent(e.target.value, DOMRefs);
        });
    }

    if (partisMenu) {
        partisMenu.addEventListener('change', (e) => {
            updatePartisContent(e.target.value, DOMRefs);
        });
    }

    if (lobbiesMenu) {
        lobbiesMenu.addEventListener('change', (e) => {
            updateLobbiesContent(e.target.value, DOMRefs);
        });
    }

    if (commissionMenu) {
        commissionMenu.addEventListener('change', (e) => {
            updateCommissionContent(e.target.value, DOMRefs);
        });
    }

    // Afficher le contenu par défaut au chargement
    updateHistoireContent('rome', DOMRefs);
}