// import { deepSeek, main } from "@/lib/openai";
import { main } from "@/lib/huggingface";

// Add metadata export
export const metadata = {
    title: "AzNews - Ia",
    description: "Latest news and articles from AzNews",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Ia() {
    
    const toto = await main("Deux jours seulement après la découverte du corps de Louise dans le bois d’Epinay-sur-Orge (Essonne), le collège André-Mauroy dans lequel était scolarisée la jeune fille rouvre, ce lundi 10 février.\n\nDès 8 heures, un dispositif de sécurité est mis en place pour accompagner le trajet des enfants vers le collège et le lycée de Longjumeau et d’Epinay-sur-Orge. Sur les réseaux sociaux, la municipalité de Longjumeau a confirmé ce dispositif censé \"assurer la sécurité des enfants et des collégiens\".\n\nPost dispositif de sécurité Longjumeau\n\nDes initiatives citoyennes de sécurité ont également été mises en place par les parents d’élèves qui ont organisé un pedibus, un système d’encadrement des élèves se rendant à pied à l’école. Pour accompagner au mieux les élèves et les personnels de l’établissement, le rectorat a confirmé l’installation d’un \"dispositif d’écoute psychologique\" au sein même du collège.\n\nUne cellule d’écoute et d’accompagnement coordonnée par le SAMU ainsi qu’un accompagnement psychologique individuel par une psychologue sont également proposés aux habitants des communes de Longjumeau et d’Epinay-sur-Orge depuis dimanche 9 février.\n\nPost dispositif d’écoute et d’accompagnement\n\nCes initiatives ont pour objectif de répondre au mieux à la peur des parents de voir leurs enfants reprendre le même chemin qui a coûté la vie à Louise. Un meurtre qui a profondément bouleversé les deux communes.\n\nDimanche 9 février, devant le collège, les habitants ont déposé bougies, fleurs, poèmes et peluches en hommage à Louise. Une enquête a été ouverte par le parquet d’Ivry pour meurtre sur mineure de moins de 15 ans.");

    console.log(toto);

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Latest Headlines
                </h1>
            </main>
        </>
    );
}
