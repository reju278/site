/**
 * Le texte des trois pages légales, repris mot pour mot de remy-jupille.com.
 *
 * Il vit à part de `site.ts` parce qu'il en pèse le double et que personne ne
 * l'édite : le contenu de vitrine se relit, un document juridique se remplace
 * en bloc, le jour où un juriste en produit une nouvelle version.
 *
 * **Rien ici n'est écrit ni corrigé par l'agent.** Le texte est reproduit tel
 * qu'il est publié aujourd'hui, y compris ses défauts, signalés en commentaire
 * là où ils tombent. Réparer une phrase de CGV au jugé, c'est modifier un
 * document qui engage la société : cela se décide, cela ne se devine pas.
 *
 * Fichier produit par extraction, non saisi à la main, pour qu'aucune faute de
 * recopie ne s'ajoute à celles de la source.
 */

/** Un fragment de document légal. Les titres deviennent des `h2`. */
export type BlocLegal =
  | { type: "titre"; texte: string }
  | { type: "paragraphe"; texte: string }
  | { type: "liste"; elements: readonly string[] };

export type DocumentLegal = readonly BlocLegal[];

/**
 * Les conditions générales de vente.
 *
 * ⚠️ Le texte publié porte les traces d'un remplacement automatique qui a mal
 * tourné : le mot « email » y a été changé en « info@remy-jupille.com », y
 * compris là où il ne désignait pas l'adresse de contact. On lit donc « son
 * adresse info@remy-jupille.com et son mot de passe » ou « cet
 * info@remy-jupille.com d'accusé de réception ». Seize occurrences, dont une
 * partie seulement est légitime. Reproduites telles quelles : c'est le texte
 * qui fait foi aujourd'hui, et le corriger relève de Rémy.
 */
export const cgv: DocumentLegal = [
  {
    type: "paragraphe",
    texte:
      "Les conditions générales de vente et de prestations de service (ci-après « les Conditions Générales ») de JUPILLE GROUP LTD composées à la fois du présent Préambule et des clauses qui suivent ce dernier sont conclues entre d’une part, la JUPILLE GROUP LTD telle que décrite dans le document « Mentions légales » et, d’autre part, le Client désignant la personne ayant passé une commande soit via le site Internet de la JUPILLE GROUP LTD soit par téléphone soit lors d’un événement où la société JUPILLE GROUP LTD est présente.",
  },
  {
    type: "paragraphe",
    texte:
      "Les présentes Conditions Générales de Vente (« CGV ») ont pour objet de régir l’ensemble des droits et obligations des parties dans le cadre de toutes opérations conclues à titre onéreux sur les sites funnels.club, remy-jupille.com, remyjupille.com, rentier.club, digitalselfmade.com",
  },
  {
    type: "paragraphe",
    texte:
      "Le site funnels.club, remy-jupille.com, remyjupille.com, rentier.club, digitalselfmade.com est la propriété exclusive de JUPILLE GROUP LTD, dont le siège social se situe 26 Surcouf Avenue, 72350 Quatre Bornes, Maurice, immatriculée au registre du commerce sous le numéro BRN 22191318.",
  },
  {
    type: "paragraphe",
    texte:
      "En souscrivant à tout produit et/ou service présenté sur le site funnels.club, remy-jupille.com, remyjupille.com, rentier.club, digitalselfmade.com, les clients déclarent adhérer sans réserve aux dites conditions générales de vente.",
  },
  {
    type: "paragraphe",
    texte:
      "Les présentes conditions générales constituent l’intégralité des droits et obligations des parties dans le cadre de leurs relations contractuelles.",
  },
  {
    type: "paragraphe",
    texte:
      "Aucune condition spécifique, à l’initiative du client, ne pourra venir s’ajouter et/ou se substituer aux présentes conditions générales.",
  },
  {
    type: "paragraphe",
    texte:
      "Le fait pour le site funnels.club, remy-jupille.com, remyjupille.com, rentier.club, digitalselfmade.com de ne pas se prévaloir d’un manquement par le client à l’une quelconque des obligations contenues dans les présentes, ne serait être interprété pour l’avenir comme une renonciation à l’obligation en cause.",
  },
  { type: "titre", texte: "1 – OBJET" },
  {
    type: "paragraphe",
    texte:
      "Les présentes Conditions Générales ont pour objet de déterminer les conditions dans lesquelles s’effectue d’une part tout acte d’achat d’un ou de plusieurs Produits présentés sur le Site et définis à l’article 2 ci-dessous et d’autre part tout acte d’inscription à un séminaire ou à un coaching personnalisé (ci-après « les Services »).",
  },
  { type: "titre", texte: "2 – CARACTERISTIQUES DES PRODUITS" },
  {
    type: "paragraphe",
    texte:
      "Les livres, films et autres œuvres de l’esprit sont édités par la JUPILLE GROUP LTD (ci-après « les Produits »), seules titulaires des droits d’exploitation de ces œuvres.",
  },
  {
    type: "paragraphe",
    texte:
      "Les Produits sont exclusivement délivrés sous la forme électronique, par téléchargement ou streaming.",
  },
  {
    type: "paragraphe",
    texte:
      "La présentation graphique des Produits sur le Site ne sont que des illustrations. Leurs présentations peuvent donc être modifiées lors du téléchargement.",
  },
  {
    type: "titre",
    texte: "3 – LA COMMANDE DES PRODUITS ET L’INSCRIPTION AUX SERVICES",
  },
  {
    type: "paragraphe",
    texte:
      "3.1 – Le Client peut passer sa commande ou s’inscrire aux Services via le Site, par téléphone ou lors d’événements dans lesquels la société JUPILLE GROUP LTD est présente.",
  },
  {
    type: "paragraphe",
    texte: "3.2 – Commande de Produits et Inscription aux Services par le Site",
  },
  {
    type: "paragraphe",
    texte:
      "3.2.1 – Via le Site, le Client pourra passer commande lorsqu’il aura procédé à l’ouverture d’un compte. Le Client devra au préalable s’identifier en déclinant ses coordonnées et une fois identifié, il pourra se reconnecter à l’aide d’un identifiant composé de son adresse info@remy-jupille.com et d’un mot de passe qu’il aura choisi. Il pourra modifier le mot de passe à son gré. Ce mot de passe est strictement personnel et devra être conservé de manière confidentielle.",
  },
  {
    type: "paragraphe",
    texte:
      "Le Client reconnaît expressément que la saisie de son adresse info@remy-jupille.com et de son mot de passe vaut identification de sa part.",
  },
  { type: "paragraphe", texte: "3.2.2 – Conclusion du contrat – double clic" },
  {
    type: "paragraphe",
    texte:
      "Le contrat est valablement formé lorsque, une fois saisis son adresse info@remy-jupille.com et son mot de passe, le Client a effectué sa commande (1er clic), a été en mesure de lire et accepter les Conditions Générales, a vérifié la teneur de sa commande (tous les Produits qu’il souhaite acheter et/ou tous les Services auxquels il souhaite s’inscrire), en a corrigé les éventuelles erreurs et l’a confirmée par un second clic, conformément aux dispositions des articles 1369-1 à 1369-6 du Code civil. La procédure du double-clic vaut consentement de la part du Client consommateur, non-professionnel et entraîne l’exigibilité des sommes dues au titre de l’exécution du contrat par la sociétéJUPILLE GROUP LTD Conformément à l’article L121-19-3 du Code de la consommation, toute conclusion de contrat confirmée par le second clic entraîne une obligation de paiement.",
  },
  {
    type: "paragraphe",
    texte: "3.3 – Confirmation de la conclusion du contrat",
  },
  {
    type: "paragraphe",
    texte:
      "Un courrier électronique avec les Conditions Générales sera envoyé à l’adresse info@remy-jupille.com du Client (consommateur et non professionnel) afin de confirmer la conclusion du contrat sur support durable. Cet info@remy-jupille.com de confirmation transmettra également le numéro de la commande et permettra de reprendre l’ensemble des éléments qui font l’objet de l’obligation générale d’information, mentionnés au I de l’article L121-17 du Code de la consommation.",
  },
  {
    type: "paragraphe",
    texte:
      "Il est, par conséquent, vivement recommandé au Client de conserver cet info@remy-jupille.com d’accusé de réception.",
  },
  { type: "titre", texte: "4 – LES CONDITIONS TARIFAIRES" },
  { type: "paragraphe", texte: "4.1 – Devise – TVA – Autres taxes" },
  {
    type: "paragraphe",
    texte:
      "Les tarifs indiqués sur le Site sont en euros (€) TTC pour les consommateurs et non professionnels. Le taux de TVA appliqué est le taux légal en vigueur au jour de la transaction. En cas de modification du montant du taux de la TVA française pour un résident sur le territoire Français, l’adaptation des prix TTC sera immédiate, sans information préalable. Le taux de TVA est adapté aux pays européens selon les lois en vigueur.",
  },
  {
    type: "paragraphe",
    texte:
      "En cas d’erreur typographique manifeste et grossière sur l’affichage du prix, le contrat pourra être annulé.",
  },
  { type: "paragraphe", texte: "4.2 – Modification des tarifs" },
  {
    type: "paragraphe",
    texte:
      "La société JUPILLE GROUP LTD peut modifier les tarifs de ses Produits et de ses Services à tout moment. Toutefois, les modifications ne s’appliqueront pas aux contrats antérieurs valablement formés (article 3-2).",
  },
  { type: "titre", texte: "5 – LE PAIEMENT" },
  {
    type: "paragraphe",
    texte:
      "5.1 – Le paiement de la totalité du prix de la commande doit être effectué lors de la commande ; la réception de l’entier paiement par la société JUPILLE GROUP LTD déclenche la mise à disposition du Produit et/ou de l’inscription au(x) Service(s).",
  },
  {
    type: "paragraphe",
    texte:
      "La société JUPILLE GROUP LTD peut, de manière exceptionnelle, accorder un paiement en plusieurs fois, notamment eu égard au montant à régler et à la connaissance qu’elle a du Client concerné. Toutefois, la JUPILLE GROUP LTD n’a aucune obligation d’accorder de telles modalités de paiement. Le Client pourra en faire la demande en s’adressant au service clients de la JUPILLE GROUP LTD à info@remy-jupille.com",
  },
  {
    type: "paragraphe",
    texte:
      "5.2 – Pour régler sa commande, le Client dispose, à son choix, de l’ensemble des modes de paiement proposés au moment de la validation du bon de commande : par carte bancaire ou Paypal ou virement si demandé par le client et accepté par la société JUPILLE GROUP LTD",
  },
  {
    type: "paragraphe",
    texte:
      "En cas de paiement par carte bancaire, le Client reconnaît expressément que la communication de son numéro de carte bancaire et ou prélèvement SEPA à la JUPILLE GROUP LTD vaut autorisation de débit de son compte à concurrence du montant total correspondant aux Produits commandés ou à l’inscription aux Services. Le montant sera débité dès la conclusion du contrat.",
  },
  {
    type: "paragraphe",
    texte:
      "Le paiement sécurisé en ligne par carte bancaire est réalisé par l’intermédiaire de la société Secure & Pay ou MangoPay.",
  },
  {
    type: "paragraphe",
    texte:
      "Les informations transmises sont chiffrées par un logiciel dans les règles de l’art et ne peuvent être lues au cours du transport sur le réseau. Toute garantie quant à la sécurité de ce système est entièrement de la responsabilité de Stripe et PayPal, qui ont fait leurs preuves et prennent en charge des millions de paiements sécurisés tous les jours.",
  },
  {
    type: "paragraphe",
    texte:
      "5.3 – Le Client garantit la société JUPILLE GROUP LTD qu’il dispose des autorisations nécessaires pour utiliser le mode de paiement choisi par lui, lors de la validation du bon de commande. La société JUPILLE GROUP LTD se réserve le droit de suspendre toute gestion de commande en cas de refus d’autorisation de paiement par carte bancaire de la part des organismes officiellement accrédités ou en cas de non-paiement.",
  },
  {
    type: "paragraphe",
    texte:
      "La société JUPILLE GROUP LTD se réserve le droit de refuser d’honorer une commande émanant d’un Client qui n’aurait pas réglé totalement la présente commande ou partiellement une commande précédente ou avec lequel un litige de paiement serait en cours d’administration.",
  },
  {
    type: "paragraphe",
    texte:
      "5.4 – La société JUPILLE GROUP LTD se réserve la possibilité de mettre en place une procédure de vérification des commandes destinée à assurer qu’aucune personne n’utilise les coordonnées bancaires d’une autre personne à son insu. Dans le cadre de cette vérification, il peut être demandé au Client d’adresser par info@remy-jupille.com ou par courrier à la société JUPILLE GROUP LTD une copie d’une pièce d’identité, un justificatif de domicile ainsi que la copie de la carte bancaire ayant servi au paiement (copie recto verso en prenant soin de ne laisser apparaître que les 4 premiers et les 2 derniers chiffres du numéro sur l’avant et en masquant le cryptogramme et le numéro complet de la carte bancaire qui peut apparaître en creux sur l’arrière de la carte), ainsi qu’un KBIS de moins de 3 mois pour les entreprises. La commande ne sera validée qu’après réception et vérification des pièces envoyées.",
  },
  {
    type: "paragraphe",
    texte:
      "5.5 - Les paiements dépassant la mensualité sur 3 mois deviendront automatiquement des abonnements à durer limité.",
  },
  { type: "titre", texte: "6 – MISE A DISPOSITION DES PRODUITS – SAV" },
  {
    type: "paragraphe",
    texte:
      "6.1 – Les Produits sont mis à la disposition du Client après le complet paiement et exclusivement par voie de téléchargement, mis à disposition du Client sous un format usuel. Le Client doit vérifier si son système informatique dispose des capacités pour télécharger.",
  },
  {
    type: "paragraphe",
    texte:
      "6.2 – Pour assister le Client, après acquisition du Produit, la société JUPILLE GROUP LTD met à sa disposition un service info@remy-jupille.com à info@remy-jupille.com",
  },
  {
    type: "paragraphe",
    texte:
      "6.3 - Les vidéos se débloquent semaine après semaine et sont consultables à souhait.",
  },
  { type: "titre", texte: "7 – DELAI DE RETRACTATION" },
  {
    type: "paragraphe",
    texte:
      "7.1 – Absence de délai de rétractation pour toute commande de Produits",
  },
  {
    type: "paragraphe",
    texte:
      "Le Client consommateur ou non-professionnel ne dispose d’aucun droit de rétractation conformément à l’article L121-21-8 du Code de la consommation. En effet, lors de sa commande de Produits, il a donné son accord préalable et a expressément renoncé à son droit de rétractation.",
  },
  {
    type: "paragraphe",
    texte: "7.2 – Délai de rétractation pour toute inscription à un Service",
  },
  {
    type: "paragraphe",
    texte:
      "7.2.1 – Le Client consommateur ou non-professionnel dispose d’un délai de 14 jours calendaires, à compter de la date de conclusion du contrat, pour exercer son droit de rétractation, conformément à l’article L121-21 du Code de la consommation.",
  },
  {
    type: "paragraphe",
    texte:
      "7.2.2 – Le Client consommateur ou non-professionnel peut exercer ce droit via le formulaire de rétractation proposé à la fin des Conditions Générales ou via un info@remy-jupille.com exprimant clairement sa volonté de se rétracter à info@remy-jupille.com. La société JUPILLE GROUP LTD accusera réception de l’exercice du droit de rétractation, par l’envoi d’un info@remy-jupille.com à l’adresse indiquée par ledit Client.",
  },
  {
    type: "paragraphe",
    texte: "7.2.3 – Ce droit de rétractation s’exerce sans pénalité.",
  },
  {
    type: "paragraphe",
    texte:
      "7.2.4 – La société JUPILLE GROUP LTD s’engage à procéder au remboursement, par le même moyen de paiement utilisé pour la transaction initiale. Le remboursement est effectué dans un délai maximum de 30 jours calendaires à compter de la prise de connaissance par la JUPILLE GROUP LTD de la volonté du Client de se rétracter.",
  },
  {
    type: "titre",
    texte:
      "8 – GARANTIE CONTRACTUELLE DE SATISFACTION – CONDITIONS DE REMBOURSEMENT",
  },
  {
    type: "paragraphe",
    texte:
      "8.1 La réglementation exclut le délai de rétractation légal lors de la “fourniture d’enregistrements audio ou vidéo, ou de logiciels informatiques lorsqu’ils ont été descellés par le consommateur”. Le délai de rétractation légal est donc nul à partir du moment où le produit commandé est téléchargé et/accessible. Source : Article L121-20-2 du code de la consommation.",
  },
  {
    type: "paragraphe",
    texte:
      "8.2 – Dans certains cas particuliers, la société JUPILLE GROUP LTD peut proposer une garantie de satisfaction pour quelques Produits ou Services. Cette garantie est indiquée sur la page du Site présentant le Produit ou le Service concerné. Lorsqu’une telle garantie de satisfaction est indiquée, le Client pourra contacter la société JUPILLE GROUP LTD à info@remy-jupille.com pour demander le remboursement.",
  },
  {
    type: "paragraphe",
    texte:
      "8.3 – Les Services suivants sont expressément exclus de la garantie de satisfaction : préciser (coaching par exemple)",
  },
  {
    type: "paragraphe",
    texte: "8.4 – Conditions de remboursement applicables aux séminaires",
  },
  {
    type: "paragraphe",
    texte:
      "Le remboursement de l’inscription à un séminaire est possible dans les deux seuls cas suivants :",
  },
  {
    type: "liste",
    elements: [
      "le Client s’est présenté au séminaire et a manifesté son insatisfaction, de manière expresse et détaillée, avant la fin du 2e jour (14 heures). En cas de non présentation, le Client ne pourra être remboursé.",
    ],
  },
  {
    type: "paragraphe",
    texte:
      "8.5 – Dans le cas d’une demande de transférer l’inscription à une autre personne, il y a des frais administratif de 100 euros HT.",
  },
  {
    type: "paragraphe",
    texte:
      "8.6 A l’exception du droit de rétractation et de la garantie commerciale facultative, aucun remboursement n’est effectué après commande du produit. Aucun remboursement n’est effectué après réception des identifiants et mot de passe.",
  },
  {
    type: "paragraphe",
    texte:
      "Aucun remboursement n’est effectué s’il y a connexion à la plateforme membre. Aucun remboursement n’est effectué après le téléchargement en tout ou partie du produit commandé. Le remboursement de la prestation commandée n’est possible, que si une telle faculté est mentionnée sur la page de vente de la prestation concernée et sous les conditions qui y sont précisées.",
  },
  {
    type: "paragraphe",
    texte:
      "Sont également expressément exclus de toute possibilité de remboursement:",
  },
  {
    type: "liste",
    elements: [
      "Toute demande émanant d’un client ayant refusé de participer à tout ou partie des activités contenues dans le programme préparé par l’instructeur.",
      "Toute demande émanant d’un client ayant refusé d’appliquer un ou plusieurs des conseils de l’instructeur.",
      "Toute demande hors délai.",
      "Les conseils téléphoniques, les réservations de séances de coaching, de conférences, de séminaires, ainsi que tout événement ou produit ne portant pas explicitement, dans la description qui en est faite sur ce site, la mention « satisfait ou remboursé ».",
    ],
  },
  {
    type: "paragraphe",
    texte:
      "Sous réserve du respect par le client de ces formalités, le remboursement sera effectué dans les 30 jours ouvrés.",
  },
  { type: "titre", texte: "9 – LA RESPONSABILITÉ" },
  {
    type: "paragraphe",
    texte:
      "La société JUPILLE GROUP LTD est responsable de plein droit de la bonne exécution de la commande.",
  },
  {
    type: "paragraphe",
    texte:
      "Néanmoins, toute mauvaise exécution ou inexécution due à une cause imputable au Client (notamment système informatique obsolète ou sous dimensionné), à un cas de force majeure ou encore à un fait imprévisible et insurmontable d’un tiers au contrat peut exonérer tout ou partie de la responsabilité de la JUPILLE GROUP LTD",
  },
  {
    type: "titre",
    texte:
      "10 – SUSPENSION – RESILIATION DE COMPTE PAR LA SOCIETE JUPILLE GROUP LTD",
  },
  {
    type: "paragraphe",
    texte:
      "La société JUPILLE GROUP LTD se réserve le droit de suspendre ou de résilier le compte d’un Client qui contreviendrait aux dispositions des Conditions Générales, ou de manière générale aux dispositions légales applicables, sans préjudice de tous dommages et intérêts que pourrait solliciter la société JUPILLE GROUP LTD.",
  },
  {
    type: "paragraphe",
    texte:
      "Toute personne dont le compte aurait été suspendu ou clôturé ne pourra commander ultérieurement ni créer de nouveau compte sur le Site, sans l’autorisation préalable de la société JUPILLE GROUP LTD",
  },
  { type: "titre", texte: "11 – ARCHIVAGE – PREUVE" },
  {
    type: "paragraphe",
    texte:
      "Les registres informatisés, conservés dans des conditions raisonnables de sécurité, seront considérés comme les preuves des communications, des commandes et des paiements intervenus entre les parties.",
  },
  {
    type: "paragraphe",
    texte:
      "L’archivage des bons de commandes, des confirmations des commandes et des factures est effectué sur un support fiable et durable de manière à correspondre à une copie fidèle et durable conformément à l’article 1348 du Code civil.",
  },
  {
    type: "paragraphe",
    texte:
      "Les registres informatisés de la société JUPILLE GROUP LTD seront considérés par les parties comme preuve des communications, commandes, paiements et transactions intervenues entre les parties.",
  },
  { type: "titre", texte: "12 – DISPOSITIONS DIVERSES" },
  {
    type: "paragraphe",
    texte:
      "De manière générale, le Client et la JUPILLE GROUP LTD acceptent expressément la possibilité de s’échanger des informations via info@remy-jupille.com. L’adresse de correspondance de la société JUPILLE GROUP LTD sera info@remy-jupille.com",
  },
  {
    type: "paragraphe",
    texte:
      "Les Conditions Générales pourront être modifiées par la société JUPILLE GROUP LTD à tout moment pour intégrer d’une part, toute modification législative ou jurisprudentielle applicable notamment à l’e-commerce et, d’autre part, toute évolution technique ou technologique améliorant le Site.",
  },
  {
    type: "paragraphe",
    texte:
      "Si l’une quelconque des stipulations des présentes Conditions Générales est nulle, elle sera réputée non écrite, mais n’entraînera pas la nullité de l’ensemble des dispositions contractuelles.",
  },
  {
    type: "paragraphe",
    texte:
      "Toute tolérance ou renonciation d’une des Parties, dans l’application de tout ou partie des engagements pris dans le cadre des présentes Conditions Générales, quelles qu’en aient pu être la fréquence et la durée, ne saurait valoir modification des Conditions Générales, ni générer un droit quelconque.",
  },
  { type: "titre", texte: "13 – LE RÈGLEMENT DES LITIGES" },
  {
    type: "paragraphe",
    texte:
      "Les présentes Conditions Générales sont soumises au droit Mauricien.",
  },
  {
    type: "paragraphe",
    texte:
      "En cas de litige, le Client consommateur, non-professionnel ou professionnel pourra opter pour une médiation conventionnelle ou tout autre mode alternatif de règlement des conflits.",
  },
  {
    type: "paragraphe",
    texte:
      "Si le Client est un professionnel, compétence exclusive est attribuée expressément aux tribunaux de Maurice.",
  },
];

/**
 * La politique de confidentialité.
 *
 * ⚠️ Trois variables du gabarit d'origine n'ont jamais été remplies et
 * s'affichent en clair : « par e-mail à l'adresse email », puis deux fois « à
 * l'adresse votre email ». Ce sont les seuls endroits où le lecteur est censé
 * trouver l'adresse à laquelle exercer ses droits RGPD. Reproduites telles
 * quelles, à combler par Rémy.
 */
export const confidentialite: DocumentLegal = [
  {
    type: "paragraphe",
    texte:
      "Les présentes Politiques De Confidentialités régit la collecte et le traitement, par JUPILLE GROUP LTD, des données à caractère personnel (ci-après les « Données Personnelles ») des utilisateurs sur les sites funnels.club, remy-jupille.com, remyjupille.com, rentier.club, digitalselfmade.com (ci-après et les « Utilisateurs » et le « Site »).",
  },
  {
    type: "paragraphe",
    texte:
      "Elle est applicable à raison de toute utilisation par l’Utilisateur du Site et de ses différents services, incluant notamment la navigation sur le Site et les commandes de formations réalisées.",
  },
  {
    type: "paragraphe",
    texte:
      "La présente Politique de confidentialité vient compléter les dispositions applicables à la relation entre la compagnie JUPILLE GROUP LTD, et l’Utilisateur, et doit donc être lue en parallèle avec les autres conditions applicables, et en particulier avec les termes et conditions accessibles depuis le Site.",
  },
  { type: "titre", texte: "RESPONSABLE DE TRAITEMENT" },
  {
    type: "paragraphe",
    texte:
      "La JUPILLE GROUP LTD, dont le siège social se situe 26 Surcouf Avenue, 72350 Quatre Bornes, Maurice, immatriculée au registre du commerce sous le numéro BRN 22191318.",
  },
  {
    type: "paragraphe",
    texte:
      "En cette qualité, la compagnie JUPILLE GROUP LTD s’engage à respecter les dispositions issues de la Loi n°78-17 du 6 janvier 1978 (dite « Informatique et Libertés ») modifiée, et du Règlement Général sur la Protection des Données Personnelles (dit « RGPD »).",
  },
  {
    type: "paragraphe",
    texte:
      "La compagnie JUPILLE GROUP LTD peut être contactée par courrier à l’adresse indiquée ci-avant ou par e-mail à l’adresse email.",
  },
  { type: "titre", texte: "FINALITES" },
  {
    type: "paragraphe",
    texte:
      "Les Données Personnelles communiquées par l’Utilisateur à la compagnie JUPILLE GROUP LTD font l’objet d’un traitement informatique et sont conservées et utilisées par la compagnie JUPILLE GROUP LTD pour les finalités suivantes :",
  },
  {
    type: "paragraphe",
    texte:
      "Enregistrer et gérer les commandes de formation et vous fournir les services correspondants",
  },
  {
    type: "paragraphe",
    texte:
      "Communiquer avec les Utilisateurs afin de répondre à leurs demandes et sollicitations ;",
  },
  {
    type: "paragraphe",
    texte: "Gérer les réclamations et litiges éventuels ;",
  },
  {
    type: "paragraphe",
    texte:
      "Adresser à l’Utilisateur, après avoir recueilli son accord préalable exprès, des newsletters, messages d’information et offres promotionnelles.",
  },
  {
    type: "paragraphe",
    texte:
      "Par ailleurs, lorsque l’Utilisateur se rend sur le Site, des données de navigation sont susceptibles d’être collectées et traitées par la compagnie JUPILLE GROUP LTD ou par tout prestataire de son choix à des fins statistiques, afin d’améliorer l’utilisation du Site, et en particulier de mesurer le nombre de pages vues, le nombre de visites et le parcours de l’Utilisateur sur le site.",
  },
  { type: "titre", texte: "FONDEMENTS JURIDIQUES DES TRAITEMENTS" },
  {
    type: "paragraphe",
    texte:
      "Certains des traitements réalisés par la compagnie JUPILLE GROUP LTD conformément aux finalités énoncées ci-avant sont nécessaires pour permettre à la société la compagnie JUPILLE GROUP LTD de :",
  },
  {
    type: "paragraphe",
    texte:
      "Remplir ses obligations contractuelles vis-à-vis de certains Utilisateurs ;",
  },
  {
    type: "paragraphe",
    texte:
      "Respecter les obligations légales qui lui incombent ; Répondre à certains intérêts légitimes relatifs notamment à sa gestion.",
  },
  {
    type: "paragraphe",
    texte:
      "Dans tous les autres cas, les traitements réalisés par la compagnie JUPILLE GROUP LTD sont possibles dans la mesure où l’Utilisateur y a expressément consenti.",
  },
  { type: "titre", texte: "SECURITE DES DONNES PERSONNELLES" },
  {
    type: "paragraphe",
    texte:
      "La compagnie JUPILLE GROUP LTD prend toutes les mesures adéquates sur le plan technique et organisationnel pour assurer la sécurité des Données Personnelles de l’Utilisateur, en particulier, contre la perte, l’altération, la diffusion ou l’usage illégal de ces données La compagnie JUPILLE GROUP LTD s’assure que de telles mesures sont mises en place sur l’ensemble des opérations réalisées dans le cadre des traitements, et notamment lors de la collecte des Données Personnelles, de leur stockage et de leur hébergement.",
  },
  {
    type: "paragraphe",
    texte:
      "A cet égard, la compagnie JUPILLE GROUP LTD s’assure également que les tiers auxquels elle est susceptible de faire appel respectent cette exigence de protection des Données Personnelles de l’Utilisateur par la mise en place des mesures appropriées. Les mesures techniques et organisationnelles mises en place peuvent inclure le recours à des formulaires d’inscription sécurisés, le cryptage de certaines données (comme les données bancaires), et l’accès restreint aux Données Personnelles.",
  },
  {
    type: "paragraphe",
    texte:
      "La compagnie JUPILLE GROUP LTD invite l’Utilisateur à la plus grande prudence dans la communication de ses Données Personnelles, par ses soins, à des tiers. Certains messages ou sollicitations reçues peuvent provenir de personnes mal intentionnées cherchant à obtenir des informations personnelles concernant l’Utilisateur en vue d’une utilisation frauduleuse (pratique du phishing). Si l’Utilisateur reçoit un message qui paraît être une tentative de phishing, il est invité à ne pas y répondre et à ne pas ouvrir les pièces jointes, les images ou les liens contenus dans le message. L’Utilisateur dispose de la possibilité de le signaler par e-mail à l’adresse votre email et sur www.signal-spam.fr.",
  },
  { type: "titre", texte: "DESTINATAIRES DES DONNEES PERSONNELLES" },
  {
    type: "paragraphe",
    texte:
      "Les Données Personnelles de l’Utilisateur pourront être communiquées à des tiers sous-traitants de la compagnie JUPILLE GROUP LTD pour assurer l’accès et l’utilisation du Site et de ses services.",
  },
  {
    type: "paragraphe",
    texte:
      "Les Données Personnelles de l’Utilisateur ne font pas l’objet de communication ou de transfert à des tiers à des fins commerciales ou promotionnelles, sauf accord préalable exprès de l’Utilisateur.",
  },
  {
    type: "paragraphe",
    texte:
      "Le choix par l’Utilisateur de recevoir des offres ou messages de prospection commerciale de la part de la compagnie JUPILLE GROUP LTD et/ou de ses partenaires est subordonné à son accord préalable et exprès au moyen d’une case à cocher correspondante accessible lorsqu’il est invité à fournir des Données Personnelles (lors d’une commande de formation gratuite ou payante). Si l’Utilisateur ne souhaite plus les recevoir, il dispose de la possibilité de se désinscrire à tout moment via le lien situé au bas de chacun des messages reçus.",
  },
  {
    type: "paragraphe",
    texte:
      "Dans certains cas, la compagnie JUPILLE GROUP LTD est susceptible de communiquer les Données Personnelles de l’Utilisateur à toute autorité administrative ou judiciaire qui lui en ferait la demande, conformément à la législation en vigueur.",
  },
  {
    type: "titre",
    texte: "TRANSFERT DE DONNÉES PERSONNELLES EN DEHORS DE L’UNION EUROPEENNE",
  },
  {
    type: "paragraphe",
    texte:
      "Dans le cadre de ses activités, la compagnie JUPILLE GROUP LTD est susceptible de transférer les Données Personnelles de l’Utilisateur à des personnes ou à des entités situées en dehors de l’Union Européenne, dans les pays suivants : États-Unis.",
  },
  {
    type: "paragraphe",
    texte:
      "Il est possible que certains des pays tiers dans lesquels les Données Personnelles de l’Utilisateur sont transférées appliquent une législation moins protectrice des Données Personnelles. Dans cette hypothèse, la compagnie JUPILLE GROUP LTD met en œuvre les garanties appropriées afin d’assurer que les Données Personnelles de l’Utilisateur bénéficient d’un niveau de protection conforme à la règle applicable.",
  },
  {
    type: "paragraphe",
    texte:
      "Pour obtenir des informations supplémentaires sur ces garanties, l’Utilisateur peut contacter la compagnie JUPILLE GROUP LTD en formulant une demande par courrier à l’adresse mentionnée ci-avant, ou par e-mail à l’adresse votre email",
  },
  { type: "titre", texte: "DUREE DE CONSERVATION DES DONNÉES PERSONNELLES" },
  {
    type: "paragraphe",
    texte:
      "La compagnie JUPILLE GROUP LTD ne conservera les Données Personnelles de l’Utilisateur que pour une durée limitée, déterminée en fonction de la nature des données en cause, et du traitement concerné.",
  },
  {
    type: "paragraphe",
    texte:
      "Sur cette base, les Données Personnelles de l’Utilisateur seront conservées pour les durées suivantes :",
  },
  {
    type: "paragraphe",
    texte:
      "Données d’identification : 36 mois à compter de la dernière connexion ;",
  },
  {
    type: "paragraphe",
    texte:
      "Données relatives aux commandes : 36 mois à compter de la date de la commande ;",
  },
  {
    type: "paragraphe",
    texte:
      "Données bancaires : 13 mois au maximum à compter de leur fourniture ;",
  },
  {
    type: "paragraphe",
    texte:
      "Données prospects : 12 mois à compter de la dernière activité sur le site.",
  },
  {
    type: "paragraphe",
    texte:
      "Une fois ces durées atteintes, certaines des Données Personnelles en cause peuvent faire l’objet d’une procédure d’archivage à des fins de gestion de la comptabilité et de gestion des litiges ou réquisitions, pour une durée ne pouvant excéder les prescriptions légales dans ces matières.",
  },
  { type: "titre", texte: "DROITS DE L’UTILISATEUR" },
  {
    type: "paragraphe",
    texte:
      "Conformément à la Loi « Informatique et Libertés » modifiée et au RGPD, l’Utilisateur bénéficie d’un droit d’accès, de rectification, d’effacement ou de suppression de tout ou partie des Données Personnelles le concernant, d’un droit d’opposition et d’un droit à la limitation du traitement et à la portabilité des Données Personnelles, qu’il peut exercer par courrier envoyé à la compagnie JUPILLE GROUP LTD",
  },
  {
    type: "paragraphe",
    texte:
      "Pour les traitements fondés sur le recueil du consentement de l’Utilisateur, celui-ci bénéficie en outre du droit de retirer son consentement à tout moment.",
  },
  {
    type: "paragraphe",
    texte:
      "L’Utilisateur est averti que l’exercice de ces droits ne porte pas atteinte à la validité des opérations de traitement réalisées préalablement, ni au droit de la compagnie JUPILLE GROUP LTD de procéder à l’archivage de certaines des Données Personnelles en cause, conformément aux principes énoncés ci-avant.",
  },
  {
    type: "paragraphe",
    texte:
      "De telles demandes devront être présentées par l’Utilisateur personnellement et par écrit, signées et accompagnées de la photocopie d’une pièce d’identité portant la signature de son titulaire. Ces informations ne seront traitées qu’à des fins d’identification de l’Utilisateur et ne seront pas conservées pour une durée excédant celle nécessaire au traitement de la réponse.",
  },
  {
    type: "paragraphe",
    texte:
      "La demande précisera l’adresse e-mail ou postale à laquelle devra parvenir l’éventuelle réponse. La compagnie JUPILLE GROUP LTD disposera d’un délai d’un (1) mois pour répondre suivant réception de la demande.",
  },
  {
    type: "paragraphe",
    texte:
      "L’Utilisateur dispose par ailleurs du droit de formuler une réclamation auprès des autorités, et en particulier auprès de la CNIL.",
  },
  { type: "titre", texte: "UTILISATION DE COOKIES" },
  {
    type: "paragraphe",
    texte:
      "Un cookie est un fichier envoyé par un site Internet lorsqu’il est visité, et conservé dans les navigateurs Internet",
  },
  {
    type: "paragraphe",
    texte:
      "Généralement, les cookies sont utilisés afin de mesurer et d’évaluer le comportement des Utilisateurs qui se rendent sur un site Internet (nombre de visiteurs, durée des visites, éléments les plus consultés…). Il existe plusieurs types de cookies, parmi lesquels certains sont non identifiants, et d’autres qui sont identifiants. Certains cookies peuvent être associés à d’autres données dans le but de personnaliser l’expérience de l’Utilisateur sur un site Internet. Lorsque les cookies sont identifiants, ils permettent la collecte et le traitement de Données Personnelles.",
  },
  {
    type: "paragraphe",
    texte:
      "La compagnie JUPILLE GROUP LTD utilise des cookies lorsque l’Utilisateur navigue sur le Site. Ces cookies sont utilisés à des fins de mesure de fréquentation du site, afin de fournir à la compagnie JUPILLE GROUP LTD des informations sur la façon dont l’Utilisateur circule sur le site, et afin d’améliorer l’expérience de l’Utilisateur sur le site (par exemple pour conserver le contenu du panier d’achat de l’Utilisateur d’une visite à l’autre).",
  },
  {
    type: "paragraphe",
    texte:
      "Les cookies utilisés par la compagnie JUPILLE GROUP LTD sont stockés pendant un délai maximal de 13 mois à compter de leur premier dépôt sur l’ordinateur de l’Utilisateur.",
  },
  {
    type: "paragraphe",
    texte:
      "Il est également possible que des tiers utilisent des cookies afin de recueillir des données liées à la navigation de l’Utilisateur. La compagnie JUPILLE GROUP LTD n’est en aucun cas responsable des opérations liées à l’utilisation des cookies de tiers.",
  },
  {
    type: "paragraphe",
    texte:
      "L’Utilisateur a la possibilité de paramétrer le fonctionnement des cookies installés sur son ordinateur en configurant les paramètres de son navigateur. Des informations supplémentaires sur la façon dont l’Utilisateur peut configurer son navigateur et limiter l’action des cookies sont accessibles sur le site Internet de la CNIL (www.cnil.fr).",
  },
  {
    type: "paragraphe",
    texte:
      "Si l’Utilisateur choisit de désactiver ou de bloquer certains cookies, les fonctionnalités qui y sont associées (par exemple la personnalisation de l’expérience de navigation sur le Site) ne pourront pas lui être appliquées.",
  },
  {
    type: "paragraphe",
    texte:
      "Elle peut être modifiée par la compagnie JUPILLE GROUP LTD à tout moment.",
  },
  {
    type: "paragraphe",
    texte:
      "En cas de modification de la Politique de confidentialité, la nouvelle version en vigueur sera applicable à l’Utilisateur à compter de sa connexion au Site.",
  },
  {
    type: "paragraphe",
    texte:
      "En cas de litige entre l’Utilisateur et la compagnie JUPILLE GROUP LTD, la Politique de confidentialité à prendre en compte sera celle en vigueur au moment des faits à l’origine du litige.",
  },
];

/** Les mentions légales. Seul des trois documents à ne pas avoir de trou. */
export const mentions: DocumentLegal = [
  { type: "titre", texte: "1. Présentation du site" },
  {
    type: "paragraphe",
    texte:
      "Conformément aux dispositions de la loi mauricienne en vigueur, les présentes mentions légales ont pour objet de définir les modalités d'utilisation des sites internet appartenant à JUPILLE GROUP LTD. Les sites concernés sont : funnels.club, remy-jupille.com, remyjupille.com, rentier.club, digitalselfmade.com",
  },
  {
    type: "paragraphe",
    texte:
      "Ces sites sont la propriété exclusive de JUPILLE GROUP LTD, dont le siège social est situé à :",
  },
  {
    type: "paragraphe",
    texte: "26 Surcouf Avenue, 72350 Quatre Bornes, Maurice",
  },
  { type: "paragraphe", texte: "Immatriculée sous le BRN : 22191318" },
  { type: "paragraphe", texte: "Numéro de TVA : 28079169" },
  { type: "paragraphe", texte: "Capital social : 20 000€" },
  {
    type: "paragraphe",
    texte: "Adresse e-mail de contact : info@remy-jupille.com",
  },
  { type: "titre", texte: "2. Responsable de publication & hébergement" },
  { type: "paragraphe", texte: "Créateur du site : JUPILLE GROUP LTD" },
  { type: "paragraphe", texte: "Responsable de la publication : Rémy Jupille" },
  {
    type: "paragraphe",
    texte: "Contact responsable de publication : info@remy-jupille.com",
  },
  {
    type: "paragraphe",
    texte:
      "Hébergeur du site : ClickFunnels (Etison LLC, 3443 W. Bavaria St., Eagle, Idaho 83646, USA)",
  },
  { type: "titre", texte: "3. Description des services fournis" },
  {
    type: "paragraphe",
    texte:
      "Les sites de JUPILLE GROUP LTD ont pour objet de fournir des informations sur les services de formation en ligne, d'accompagnement entrepreneurial et de coaching digital. Le propriétaire s’efforce de fournir des informations aussi précises que possible, mais ne saurait garantir leur exactitude ou leur complétude. Toutes les informations sont susceptibles d'être modifiées à tout moment sans préavis.",
  },
  { type: "titre", texte: "4. Propriété intellectuelle" },
  {
    type: "paragraphe",
    texte:
      "JUPILLE GROUP LTD est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les contenus des sites (textes, images, logos, icônes, vidéos, logiciels, etc.). Toute reproduction, modification ou diffusion sans autorisation préalable est strictement interdite et passible de poursuites judiciaires.",
  },
  { type: "titre", texte: "5. Liens hypertextes & cookies" },
  {
    type: "paragraphe",
    texte:
      "Les sites peuvent contenir des liens vers des sites tiers. JUPILLE GROUP LTD ne saurait être tenu responsable du contenu de ces sites externes. Lors de la navigation, des cookies peuvent s’installer sur l’ordinateur de l’utilisateur afin d’améliorer son expérience et de recueillir des statistiques anonymes de navigation. L’utilisateur peut configurer son navigateur pour bloquer les cookies.",
  },
  { type: "titre", texte: "6. Protection des données personnelles (RGPD)" },
  {
    type: "paragraphe",
    texte:
      "Les informations personnelles collectées sur les sites de JUPILLE GROUP LTD sont uniquement destinées à fournir des services aux utilisateurs. Conformément à la réglementation en vigueur, chaque utilisateur dispose d’un droit d’accès, de rectification, de suppression et d’opposition aux données personnelles le concernant. Ces demandes peuvent être adressées à : info@remy-jupille.com Aucune donnée personnelle ne sera cédée à des tiers sans consentement explicite. Pour plus de détails, voir notre Politique de Confidentialité.",
  },
  { type: "titre", texte: "7. Droit applicable & juridiction compétente" },
  {
    type: "paragraphe",
    texte:
      "​Tout litige relatif à l’utilisation des sites de JUPILLE GROUP LTD est soumis au droit mauricien. En cas de litige, les tribunaux compétents seront ceux du ressort de l’île Maurice.",
  },
];
