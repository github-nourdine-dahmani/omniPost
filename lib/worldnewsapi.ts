"use server";

import { RawArticleSeed, TopNews } from "@/types";
import { PrismaClient, Job, Article, ArticleSeed } from "@prisma/client";
import { randomUUID } from "crypto";
import slugify from "slugify";

const prisma = new PrismaClient();

export async function fetchTopNews() {
    console.log(">>>> fetchTopNews");

    // const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`)
    // const data = await res.json();

    const res = await fetch(
        `https://api.worldnewsapi.com/top-news?source-country=fr&language=fr&api-key=${process.env.NEXT_PUBLIC_WORLDNEWSAPI_KEY}`
    );

    // if(!res.ok) {
    //     console.log(res.message)
    //     throw new Error('Failed to fetch top news');
    // }

    const data = await res.json();

    // console.log("fetched top news", data);

    // const data = {
    //     "top_news": [
    //         {
    //             "news": [
    //                 {
    //                     "id": 288792816,
    //                     "title": "Ouverture du procès de l'auteur de l'attentat de la basilique de Nice",
    //                     "text": "L'audience doit débuter à 10H00 devant la cour composée uniquement de magistrats professionnels. Le jeune Tunisien comparaît pour assassinats et tentatives d'assassinat en relation avec une entreprise terroriste. Il encourt une peine de réclusion criminelle à perpétuité. Le matin du 29 octobre, armé d'un couteau de cuisine, il avait quasiment décapité Nadine Vincent, une fidèle de 60 ans, blessé de 24 coups de couteau une mère de famille franco-brésilienne, Simone Barreto Silva, 44 ans, qui avait réussi à s'enfuir avant de succomber et égorgé le sacristain Vincent Loquès, 55 ans, père de deux filles. Contrairement aux autres grands procès liés à des affaires de terrorisme, l'attentat du 14 juillet 2016 à Nice notamment, le procès de Brahim Aouissaoui ne se tiendra pas dans la salle des \"grands procès\" du palais de justice, qui doit être démontée début mars, mais dans une autre salle de cour d'assises. Grièvement blessé par des policiers après son attentat, Brahim Aouissaoui soutient qu'il ne se souvient de rien. Son examen médical n'a cependant révélé aucune lésion cérébrale et l'expertise psychiatrique a conclu à l'absence d'altération ou d'abolition de son discernement au moment des faits. Surtout, les écoutes de ses conversations téléphoniques en prison ont démontré, selon l'accusation, \"que sa prétendue amnésie était pour le moins très exagérée\". Des avocats de parties civiles, une trentaine enregistrés à l'ouverture de l'audience, ont dénoncé une \"amnésie fictive\", voire \"une supercherie\" de l'accusé dont, selon Me Philippe Soussi, avocat notamment du mari d'une victime et de l'Association française des victimes du terrorisme (AFVT), \"la radicalisation est ancienne et profonde\". \"Après plus de quatre ans de détention à l'isolement total, la question qui va se poser à l'ouverture de l'audience sera celle de son état de santé mentale actuel, de sa capacité à comprendre les charges qui pèsent contre lui, et donc de sa capacité à pouvoir se défendre comme tout accusé a le droit de le faire\", a fait valoir son avocat Martin Méchin. Pour le parquet antiterroriste, \"de nombreux éléments laissent penser qu'au moment de quitter la Tunisie (...), il avait déjà l'intention de commettre un attentat en France\", comme \"sa radicalisation avérée et sa fréquentation d'individus impliqués dans des dossiers terroristes\" en Tunisie. - \"Haine\" contre la France - Par ailleurs, \"l'exploitation de son téléphone et de son compte Facebook établissent qu'il continuait à consulter des sites islamistes\" ; qu'il s'était intéressé à la décapitation du professeur Samuel Paty le 16 octobre 2020 ; \"qu'il avait connaissance des menaces proférées contre la France par des médias proches d'Al-Qaïda et qu'il éprouvait manifestement une haine\" contre la France, qualifié de \"pays des mécréants et des chiens\", a développé le magistrat instructeur. Sans expliciter \"dans ses messages ses intentions exactes, il laissait entendre qu'il avait un projet et conseillait à certains de ses contacts d'effacer leurs discussions\", a noté le magistrat, soulignant \"sa volonté déterminée de se rendre en France\". La veille au soir de l'attentat, dans un message audio, Brahim Aouissaoui avait expliqué à un compatriote résidant en région parisienne qu'il ne pouvait pas se rendre à Paris, faute d'argent, mais disait-il : \"J'ai un autre programme dans ma tête. Que Dieu le facilite\". L'interrogatoire de Brahim Aouissaoui sur les faits aura lieu le 24 février. L'attentat de la basilique de Nice a été le troisième acte d'un automne particulièrement sanglant après la republication par Charlie Hebdo de caricatures du prophète Mahomet, le 2 septembre 2020, jour de l'ouverture du procès des attentats du 7 janvier 2015. Avant l'attentat commis par Brahim Aouissaoui, le 25 septembre, un Pakistanais - condamné récemment à 30 ans de réclusion - avait blessé au hachoir deux personnes devant les anciens locaux de Charlie Hebdo à Paris. Le 16 octobre, un jeune Tchétchène avait décapité le professeur Samuel Paty dans les Yvelines. Quatre jours avant que le jeune Tunisien passe à l'action, un média proche d'Al-Qaïda appelait les musulmans à \"égorger\" des Français, notamment dans \"leurs églises\". Le procès est prévu jusqu'au 26 février.",
    //                     "summary": "L'audience doit débuter à 10H00 devant la cour composée uniquement de magistrats professionnels.Le jeune Tunisien comparaît pour assassinats et tentatives d'assassinat en relation avec une entreprise terroriste. Il encourt une peine de réclusion...",
    //                     "url": "https://www.laprovence.com/article/france-monde/5979223524568914/ouverture-du-proces-de-lauteur-de-lattentat-de-la-basilique-de-nice",
    //                     "image": "https://pictures.laprovence.com/cdn-cgi/image//media/afp/b9de9e02e42a485f049b301fd191b914eeb1ccc1.jpg",
    //                     "video": null,
    //                     "publish_date": "2025-02-10 03:00:25",
    //                     "author": "Afp Import",
    //                     "authors": [
    //                         "Afp Import"
    //                     ],
    //                     "language": "fr",
    //                     "category": "politics",
    //                     "source_country": "fr"
    //                 },
    //                 {
    //                     "id": 288818908,
    //                     "title": "Attentat de la basilique de Nice : trois semaines de procès pour un accusé « amnésique »",
    //                     "text": "Brahim Aouissaoui va-t-il parler ? C’est la grande inconnue du procès qui s’ouvre lundi 10 février, pour trois semaines, devant la cour d’assises spéciale de Paris. Nul ne sait si ce Tunisien de 25 ans va expliquer pourquoi, le 29 octobre 2020, il a mortellement poignardé trois personnes à l’intérieur de la basilique de Nice. Car pour l’instant, c’est le silence complet. \n\nDurant toute l’instruction, Brahim Aouissaoui a affirmé ne se souvenir de rien. Ni des faits, ni même de son histoire familiale. « Une véritable fumisterie. L’enquête et les expertises médicales ont permis d’établir que cette amnésie ne tenait pas la route », gronde Me Philippe Soussi, avocat des parties civiles. « La principale question est celle de l’état de santé mentale actuel de mon client. Il a passé quatre ans à l’isolement et je ne suis pas certain qu’il puisse comprendre les enjeux du procès », oppose Me Martin Méchin, l’avocat de Brahim Aouissaoui.\n\nMême si l’accusé reste silencieux, l’audience va permettre de reconstituer le parcours de ce jeune homme radicalisé, qui a quitté la Tunisie dans la nuit du 18 au 19 septembre 2020. Les enquêteurs sont persuadés qu’il avait alors en tête l’intention de frapper en France où le contexte était alors sensible. Charlie Hebdo venait de republier des caricatures du prophète Mohammed, ce qui avait conduit le groupe Al-Qaida à proférer de nouvelles menaces visant l’Hexagone.\n\n« Il n’a pas frappé cette église par hasard »\n\nParti par la mer avec 23 autres personnes, Brahim Aouissaoui débarque le lendemain sur l’île de Lampedusa. En raison du Covid, les policiers italiens confinent alors le groupe sur un navire pendant une vingtaine de jours. Arrivé à Bari le 9 octobre, Brahim Aouissaoui se voit notifier un ordre de quitter l’Italie sous sept jours. Mais il prend la route pour la Sicile pour travailler quelques jours dans une plantation d’oliviers. De quoi gagner suffisamment d’argent pour se rendre en train à Nice où il arrive le 27 octobre en début de soirée.\n\nGrâce aux caméras de vidéosurveillance, les enquêteurs ont pu retracer ses pérégrinations dans la ville. Selon eux, c’est dans la journée du 28 octobre qu’il a choisi sa cible. « Il n’a pas frappé cette église par hasard. Dans la journée, il a clairement fait des repérages, passant à six reprises devant la basilique, s’arrêtant même plusieurs minutes pour examiner les lieux », constate Me Samia Maktouf, avocate des parties civiles.\n\nTrois morts en dix minutes\n\nLe 29 octobre, à 8 h 28, Brahim Aouissaoui entre dans l’église qui vient d’être ouverte par le sacristain Vincent Loquès. Juste après lui, Nadine Devillers, une habituée de la basilique, entre à son tour. Elle sera la première à être agressée par le terroriste, qui lui portera 17 coups de couteau. Dans les secondes suivantes, une autre femme arrive et voit le corps de Nadine Devillers allongé au sol. Elle ressort aussitôt de l’église et explique la situation à Simone Barreto Silva, une quadragénaire franco-brésilienne. Plutôt que de s’enfuir, cette dernière décide d’entrer dans la basilique pour voir si elle peut porter secours à la femme qui gît au sol.\n\nÀ ce moment, Vincent Loquès est parti boire un café. Très vite prévenu, le sacristain entend les cris de détresse de Simone Barreto Silva, à son tour attaquée par Brahim Aouissaoui. Le sacristain se met alors à courir dans l’église pour la secourir. Il est à son tour poignardé à de très nombreuses reprises par l’assaillant. Simone Barreto Silva, elle, parvient à s’échapper mais mourra quelques minutes plus tard dans un restaurant. Touché par huit balles tirées par des policiers municipaux, Brahim Aouissaoui survivra à ses blessures.\n\nTrois morts en dix minutes. Un homme et deux femmes tombés dans une église. À la barre, cette semaine, des proches viendront parler d’eux. Des mots pour entretenir la mémoire et, peut-être aussi, pour dire le courage et l’altruisme dont ont fait preuve Simone Barreto Silva et Vincent Loquès ce matin d’octobre dans la basilique Notre-Dame-de-l’Assomption de Nice.\n\nLes trois victimes de l’attentat\n\nVincent Loquès, 54 ans. Marié, père de deux filles, il était le sacristain de la basilique depuis 2013. Il était très connu des paroissiens. « Vincent, depuis ma fenêtre je te voyais ouvrir l’église, j’entendais le bruit de tes clés. Aujourd’hui, la cloche a sonné, tu n’es plus là. Ton silence est assourdissant », disait un message déposé devant l’église après l’attentat.\n\nNadine Devillers, 60 ans. Mariée et sans enfant, cette croyante discrète avait l’habitude de prier dans cette église, près de chez elle. Décrite comme altruiste et généreuse, elle était une passionnée de théâtre et prenait des cours d’art dramatique.\n\nSimone Barreto Silva, 44 ans. Cette Brésilienne de naissance, aide-soignante de profession et mère de trois enfants, vivait en France depuis trente ans. «Simone, c’était la joie de vivre, elle était très croyante et voulait la paix entre les gens », confiait une cousine en 2020 à La Croix.",
    //                     "summary": "Nul ne sait si Brahim Aouissaoui, l’auteur de l’attentat à la basilique de Nice, va s’exprimer lors de son procès qui s’ouvre lundi 10 février à Paris. Durant l’instruction, ce Tunisien de 25 ans a affirmé avoir tout oublié, une amnésie à laquelle ne croient ni l’accusation ni les parties civiles.",
    //                     "url": "https://www.la-croix.com/societe/attentat-de-la-basilique-de-nice-trois-semaines-de-proces-pour-un-accuse-amnesique-20250209",
    //                     "image": "https://i.la-croix.com/1400x933/smart/2025/02/09/1971775-le-29-octobre-2020-brahim-aouissaoui-avait-tue-au-.jpg",
    //                     "video": null,
    //                     "publish_date": "2025-02-10 05:05:37",
    //                     "author": "Pierre Bienvault",
    //                     "authors": [
    //                         "Pierre Bienvault"
    //                     ],
    //                     "language": "fr",
    //                     "category": "politics",
    //                     "source_country": "FR"
    //                 },
    //             ]
    //         },
    //         {
    //             "news": [
    //                 {
    //                     "id": 288777716,
    //                     "title": "Donald Trump annonce la mise en place de droits de douane de 25 % sur l’aluminium et l’acier entrant aux Etats-Unis",
    //                     "text": "Les Etats-Unis vont appliquer des droits de douane de 25 % sur l’aluminium et l’acier importé dans le pays, a annoncé dimanche 9 février le président américain, Donald Trump, sans préciser quand ces nouvelles taxes entreraient en vigueur.\n\n« Tout l’acier arrivant aux Etats-Unis aura 25 % de droits de douane », a déclaré le chef de l’Etat dans l’avion présidentiel le transportant jusqu’à La Nouvelle-Orléans pour assister au Super Bowl, la finale de la Ligue professionnelle de football américain. M. Trump a ajouté que le même niveau de droits de douane s’appliquerait à l’aluminium. Les annonces précises sur le sujet auront lieu « lundi », a précisé le président américain.\n\nDonald Trump a aussi affirmé qu’il annoncerait « mardi ou mercredi » des « droits de douane réciproques », afin d’aligner la taxation des produits entrant aux Etats-Unis sur la manière dont sont taxés les produits américains à l’étranger. « S’ils nous taxent à 130 % et que nous ne les taxons pas, cela ne restera pas comme ça », a-t-il affirmé.\n\n« Cela n’affectera pas tous les pays parce que certains imposent les mêmes droits de douane que nous. Mais ceux qui profitent des Etats-Unis se verront rendre la pareille », a-t-il ajouté.\n\nLevier de négociations\n\nDepuis l’investiture de Donald Trump en janvier, les droits de douane sont au cœur de sa politique économique et diplomatique, vus comme un moyen de résorber le déficit commercial des Etats-Unis autant que comme un levier de négociations avec les pays visés.\n\nDepuis mardi, les produits venant de Chine sont renchéris par des droits de douane additionnels de 10 %, mesure à laquelle Pékin a décidé de rétorquer par des surtaxes ciblées sur certains produits américains à partir du 10 février.\n\nLes exportations du Mexique et du Canada vers les Etats-Unis devaient aussi initialement se voir infliger des droits de douane de 25 % à compter de mardi. Mais Donald Trump leur a accordé à la dernière minute un sursis d’un mois après avoir reçu des engagements sur le renforcement de la sécurité aux frontières.",
    //                     "summary": "Le président américain a fait cette annonce, dimanche, à bord d’Air Force One, l’avion présidentiel, sans préciser son entrée en vigueur. Il a aussi promis la mise en place de « droits de douane réciproques ».",
    //                     "url": "https://www.lemonde.fr/economie/article/2025/02/10/donald-trump-annonce-la-mise-en-place-de-droits-de-douane-de-25-sur-l-aluminium-et-l-acier-entrant-aux-etats-unis_6539284_3234.html",
    //                     "image": "https://img.lemde.fr/2023/07/14/270/0/3248/1624/1342/671/60/0/35270de_1689322730345-369852.jpg",
    //                     "video": null,
    //                     "publish_date": "2025-02-10 00:36:07",
    //                     "author": "Le Monde Avec Afp",
    //                     "authors": [
    //                         "Le Monde Avec Afp"
    //                     ],
    //                     "language": "fr",
    //                     "category": "politics",
    //                     "source_country": "fr"
    //                 },
    //                 {
    //                     "id": 288780196,
    //                     "title": "Escalade des droits de douane aux Etats-Unis, Trump cible aluminium et acier importés",
    //                     "text": "\"J'annoncerai des droits de douane sur l'acier lundi. (...) Tout l'acier arrivant aux Etats-Unis aura 25% de droits de douane\", a déclaré le chef de l'Etat dans l'avion présidentiel qui le menait à la Nouvelle-Orléans pour assister au Super Bowl, la finale de la Ligue professionnelle de football américain. Le milliardaire républicain a ajouté que le même sort serait réservé à l'aluminium importé. Lors de son premier mandat (2017-21), Donald Trump avait déjà imposé des droits de douane sur l'acier et l'aluminium afin de protéger l'industrie américaine qu'il estimait être confrontée à une concurrence déloyale en provenance de pays asiatiques et européens. Donald Trump a aussi affirmé dimanche qu'il annoncerait \"mardi ou mercredi\" des \"droits de douane réciproques\", afin d'aligner la taxation des produits entrant aux Etats-Unis sur la manière dont sont taxés les produits américains à l'étranger. \"S'ils nous taxent à 130% et que nous ne les taxons pas, cela ne restera pas comme ça\", a-t-il lancé. \"Cela n'affectera pas tous les pays parce que certains imposent les mêmes droits de douane que nous. Mais ceux qui profitent des Etats-Unis se verront rendre la pareille\", a-t-il ajouté. \"Ils nous taxent, on les taxe\", avait déjà esquissé le président vendredi, lors d'une conférence de presse avec le Premier ministre japonais Shigeru Ishiba. Depuis son investiture le 20 janvier, les droits de douane sont au coeur de la politique économique et diplomatique de Donald Trump: ils sont présentés autant comme un moyen de résorber le déficit commercial des Etats-Unis que d'obtenir des concessions des pays visés. Depuis mardi, les produits venant de Chine sont renchéris par des droits de douane additionnels de 10% -- mesure à laquelle Pékin va répliquer par des surtaxes ciblées sur certains produits américains à partir du 10 février. Les nouvelles taxes chinoises portent sur 14 milliards de dollars de biens américains, tandis que les droits de douane annoncés par Donald Trump concernent 525 milliards de dollars de biens chinois. - \"Etre prêts\" - Les exportations du Mexique et du Canada vers les Etats-Unis devaient aussi initialement se voir infliger des droits de douane (de 25%) en dépit d'un accord de libre-échange liant les trois pays d'Amérique du Nord. Mais Donald Trump, qui reproche à ses deux voisins de ne pas en faire assez pour juguler le trafic de drogue, leur a accordé à la dernière minute un sursis d'un mois après avoir reçu des engagements sur le renforcement de la sécurité aux frontières. L'offensive sur les droits de douane a donné lieu à d'autres rebondissements, comme le report d'une taxation sur des colis d'une valeur de moins de 800 dollars venant de Chine. L'Union européenne se sait dans la ligne de mire de Donald Trump, qui avait indiqué qu'il prendrait une décision \"très bientôt\" la concernant. Lors d'une interview diffusée dimanche par la chaîne américaine CNN, le président français Emmanuel Macron a déclaré que les Européens devaient \"être prêts (...) à réagir\" à de nouvelles barrières douanières. M. Macron a également mis en garde contre les conséquences d'une telle mesure pour les Américains: \"Si vous imposez des droits de douane sur plusieurs secteurs, cela entraînera une augmentation des prix et créera de l'inflation aux Etats-Unis.\" Donald Trump et ses équipes, qui ne cessent de promettre un \"nouvel âge d'or\" pour les Etats-Unis, ont jusqu'ici largement minoré ce risque, alors que la reconquête du pouvoir d'achat était au coeur de la campagne électorale du républicain. Le déficit commercial de la première économie mondiale s'est creusé l'an dernier à près de 920 milliards de dollars.",
    //                     "summary": "\"J'annoncerai des droits de douane sur l'acier lundi. (...) Tout l'acier arrivant aux Etats-Unis aura 25% de droits de douane\", a déclaré le chef de l'Etat dans l'avion présidentiel qui le menait à la Nouvelle-Orléans pour assister au Super...",
    //                     "url": "https://www.laprovence.com/article/france-monde/5995873404772314/escalade-des-droits-de-douane-aux-etats-unis-trump-cible-aluminium-et-acier-importes",
    //                     "image": "https://pictures.laprovence.com/cdn-cgi/image//media/afp/fc7c15356bcb8b2d72680b86bbde6a1936265780.jpg",
    //                     "video": null,
    //                     "publish_date": "2025-02-10 01:10:03",
    //                     "author": "Afp Import",
    //                     "authors": [
    //                         "Afp Import"
    //                     ],
    //                     "language": "fr",
    //                     "category": "politics",
    //                     "source_country": "fr"
    //                 },
    //             ]
    //         },
    //     ],
    //     "language": "fr",
    //     "country": "fr"
    // }

    return data;
}

export async function collectRawArticleSeeds(
    job: Job,
    limit: number = 10
): Promise<RawArticleSeed[]> {
    // console.log(">>>> collectRawArticleSeeds");

    // console.log('>>>> job data', job?.data);

    const data = job?.data ? JSON.parse(job.data) : undefined;

    if (!data) {
        console.log("no data");
        return [];
    }

    const databaseArticleSeeds = job.articleSeeds.map(
        (articleSeed: ArticleSeed) =>
            articleSeed.seedData
                ? { ...JSON.parse(articleSeed.seedData), id: articleSeed.id }
                : undefined
    );

    // console.log(">>>> databaseArticleSeeds", databaseArticleSeeds);

    const articles: RawArticleSeed[] = data.top_news
        .slice(0, limit)
        .flatMap((news: any) => {
            // const parentExternalId = `${news.news[0].id}`
            return news.news.slice(0, 1).map((data: any) => {
                const existingArticleSeed = databaseArticleSeeds.find(
                    (databaseArticleSeed: ArticleSeed) =>
                        databaseArticleSeed.externalId === `${data.id}`
                );

                // console.log(">>>> data.id", data.id);
                // console.log(">>>> existingArticleSeed", existingArticleSeed);

                return existingArticleSeed
                    ? {
                          id: existingArticleSeed.id,
                          externalId: `${existingArticleSeed.externalId}`,
                          title: existingArticleSeed.title,
                          image: existingArticleSeed.image,
                          text: existingArticleSeed.text,
                          summary: existingArticleSeed.summary,
                          language: existingArticleSeed.language,
                          url: existingArticleSeed.url,
                          source_country: existingArticleSeed.source_country,
                          category: existingArticleSeed.category,
                          publishDate: existingArticleSeed.publish_date
                              ? new Date(existingArticleSeed.publish_date)
                              : undefined,
                          author: existingArticleSeed.author,
                          seedJobId: job.id,
                      }
                    : {
                          id: null,
                          externalId: `${data.id}`,
                          title: data.title,
                          image: data.image,
                          text: data.text,
                          summary: data.summary,
                          language: data.language,
                          url: data.url,
                          source_country: data.source_country,
                          category: data.category,
                          publishDate: data.publish_date
                              ? new Date(data.publish_date)
                              : undefined,
                          author: data.author,
                          seedJobId: job.id,
                      };
            });
        });

    // console.log('>>>> articles', articles);

    return articles;
}

export async function collectTopNews(
    job: Job,
    limit: number = 10
): Promise<TopNews[]> {
    console.log(">>>> collectTopNews");

    // console.log('>>>> job data', job?.data);

    const data = job?.data ? JSON.parse(job.data) : undefined;

    if (!data) {
        console.log("no data");
        return [];
    }

    const databaseArticleSeeds = job.articleSeeds.map(
        (articleSeed: ArticleSeed) =>
            articleSeed.seedData
                ? { ...JSON.parse(articleSeed.seedData), id: articleSeed.id }
                : undefined
    );

    // console.log(">>>> databaseArticleSeeds", databaseArticleSeeds);

    const topNews: TopNews[] = data.top_news
        .slice(0, limit)
        .flatMap((news: any) => {
            // const parentExternalId = `${news.news[0].id}`
            return news.news.slice(0, 1).map((data: any) => {

                const articleSeed = job.articleSeeds.find(
                    (articleSeed: ArticleSeed) =>
                        articleSeed.externalId === `${data.id}`
                );

                // console.log(">>>> data.id", data.id);
                // console.log(">>>> articleSeed", articleSeed);

                return {
                          externalId: `${data.id}`,
                          title: data.title,
                          image: data.image,
                          text: data.text,
                          summary: data.summary,
                          language: data.language,
                          url: data.url,
                          source_country: data.source_country,
                          category: data.category,
                          publishDate: data.publish_date
                              ? new Date(data.publish_date)
                              : undefined,
                          author: data.author,
                          seedJobId: job.id,
                          articleSeed: articleSeed
                      };
            });
        });

    // console.log('>>>> topNews', topNews);

    return topNews;
}

// export async function persistArticleSeeds(articleSeeds: ArticleSeed[]): Promise<Article[]> {
//     console.log('>>>> persistArticles');

//     try {

//         const persistedArticles = await Promise.all(
//             articleSeeds.map(article => persistArticleSeed(article))
//         );

//         return persistedArticles;

//     } catch (error) {
//         console.log('>>>> error', error);
//         throw new Error('Failed to persist articles', { cause: error });
//     }
// }

// export async function persistArticleSeed(articleSeed: ArticleSeed): Promise<Article> {

//     console.log('>>>> persistArticle', articleSeed);

//     try {
//         const persistedArticle = await prisma.article.create({
//             data: {
//                 slug: slugify(articleSeed.title, { lower: true, strict: true })+'-' + randomUUID(),
//                 externalId: articleSeed.externalId,
//                 title: articleSeed.title,
//                 image: articleSeed.image,
//                 text: articleSeed.text,
//                 summary: articleSeed.summary,
//                 url: articleSeed.url,
//                 language: articleSeed.language,
//                 sourceCountry: articleSeed.source_country,
//                 category: articleSeed.category,
//                 author: articleSeed.author,
//                 seedData: JSON.stringify(articleSeed),
//                 publishedAt: articleSeed.publishDate,
//                 seedJob: {
//                     connect: {
//                         id: articleSeed.seedJobId
//                     }
//                 }
//             }
//         })

//         return persistedArticle;
//     } catch (error) {
//         console.log('>>>> error', error);
//         throw new Error('Failed to persist article', { cause: error });
//     }
// }
