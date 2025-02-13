import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import ArticleCard from "@/components/ArticleCard";
import PostItem from "@/components/PostItem";
// import { fetchHeadlines } from "@/lib/new sapi";
import { collectTopNews, getLatestJob } from "@/lib/worldnewsapi";
import { JobType } from "@/types";
// import { deepSeek, main } from "@/lib/openai";
import { main } from "@/lib/huggingface";

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Posts",
    description: "Latest news and articles from AzNews",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Home() {
    // const posts = await getAllPosts();
    // const latestJob = await getLatestJob(JobType.FetchTopNews);
    // const topNews = latestJob ? await collectTopNews(latestJob) : [];

    // const toto = await deepSeek("What is the capital of France?");
    // const toto = await main("What is the capital of France?");
    const toto = await main("Le procès du Tunisien Brahim Aouissaoui, 25 ans, l'auteur présumé de l'attentat de la basilique de Nice qui a fait trois morts le 29 octobre 2020, s'ouvre ce lundi 10 février devant la cour d'assises spéciale de Paris. L'audience doit débuter à 10 heures devant la cour composée uniquement de magistrats professionnels. Le jeune Tunisien comparaît pour assassinats et tentatives d'assassinat en relation avec une entreprise terroriste. Il encourt une peine de réclusion criminelle à perpétuité. Le matin du 29 octobre, armé d'un couteau de cuisine, il avait quasiment décapité Nadine Vincent, une fidèle de 60 ans, blessé de 24 coups de couteau une mère de famille franco-brésilienne âgée de 44 ans, Simone Barreto Silva, qui avait réussi à s'enfuir avant de succomber et égorgé le sacristain Vincent Loquès, 55 ans, père de deux filles. \"C'est là en permanence, on ne peut pas oublier ce genre de drame\", explique Joffrey Devillers, l'époux de Nadine, à BFMTV. \"Le fait d'en reparler va être le plus dur. Il y a de l'appréhension et en même temps l'envie que cela soit fini. Je pense que c'est une étape importante psychologiquement pour se reconstruire.\" \"Je crains ses réactions à lui. Je vais lui dire ce que je pense de lui, de l'acte monstrueux qu'il a commis et qui a changé la vie de trois familles\", ajoute-t-il en espérant, sans trop y croire, obtenir des explications. Contrairement aux autres grands procès liés à des affaires de terrorisme, l'attentat du 14 juillet 2016 à Nice notamment, le procès de Brahim Aouissaoui ne se tiendra pas dans la salle des \"grands procès\" du palais de justice, qui doit être démontée début mars, mais dans une autre salle de cour d'assises. L'auteur présumé prône l'amnésie Grièvement blessé par des policiers après son attentat, Brahim Aouissaoui soutient qu'il ne se souvient de rien. Son examen médical n'a cependant révélé aucune lésion cérébrale et l'expertise psychiatrique a conclu à l'absence d'altération ou d'abolition de son discernement au moment des faits. Surtout, les écoutes de ses conversations téléphoniques en prison ont démontré, selon l'accusation, \"que sa prétendue amnésie était pour le moins très exagérée\". Des avocats de parties civiles, une trentaine enregistrés à l'ouverture de l'audience, ont dénoncé une \"amnésie fictive\", voire \"une supercherie\" de l'accusé.");

    console.log(toto);

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Latest Headlines
                </h1>
                {/* <div className="grid gap-8">
                    {topNews.map((article, index) => (
                        <ArticleCard key={index} article={article} />
                    ))}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Latest Posts
                </h1>
                <div className="grid gap-8">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div> */}
            </main>
        </>
    );
}
